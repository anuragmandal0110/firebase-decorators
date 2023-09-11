import {
    getFirestore, Firestore, doc,
    onSnapshot, setDoc, updateDoc, collection
} from "firebase/firestore";
import {
    getFirestore as getFirestoreAdmin,
} from "firebase-admin/firestore";

import { checkAppInitialization } from "../util/index.js";
import { DATA_KEY, PRIMARY_KEY } from "../constant/index.js";
import { BaseFirebaseModel } from "../interface/BaseFirebaseModel.js";
import { dataKeyType } from "../types/index.js";

/**
 * This decorator can be used to initialize a model
 * and listen for changes to the document. It will 
 * automatically update the model anytime a change is 
 * detected.
 * 
 * Example usage
 * 
 * @FirestoreModel("user")
 * class User {
 * 
 *  @PrimaryKey
 *  const userId! :string;
 * 
 *  const joinDate! :string;
 * 
 *  const name! : string
 * 
 * }
 * 
 */
export const FirestoreModel = (collection: string, useAdminSdk = false) => {
    checkAppInitialization();

    return function (value: any, _context: ClassDecoratorContext): any {

        return class extends value {
            constructor(...args: any[]) {
                super(args);

                console.log(`Using admin ask - ${useAdminSdk}`);

                // check if all keys are present.
                validateKeys(this)

                const primaryKeyValue: string = this[this[PRIMARY_KEY]][0]
                const dataKeys: dataKeyType = this[DATA_KEY]

                // initialize all datakeys with a 0 value;
                initializeKeys(dataKeys, this);

                // add the listener which will continuously
                // update the model whenever new data is available.
                addListener(collection, primaryKeyValue, useAdminSdk,
                    dataKeys, (this as unknown) as BaseFirebaseModel);


                // define the write function
                this.write = () => {
                    const objectToWrite = createDataObject(this, dataKeys)
                    useAdminSdk ? getFirestoreAdmin()
                        .collection(collection)
                        .doc(primaryKeyValue)
                        .set(objectToWrite).catch((error) => {
                            console.error(error);
                            throw new Error("Write failed");
                        }) :
                        writeToDatabase(collection, primaryKeyValue, getFirestore(),
                            objectToWrite);
                }

                this.update = () => {
                    const objectToWrite = createDataObject(this, dataKeys)
                    // accumulate all the datakeys and create an object
                    dataKeys.forEach((val) => {
                        const valueToWrite = this[val.name]

                        if (!valueToWrite) {
                            console.warn(`${val.name} is null`)
                        } else {
                            objectToWrite[val.remoteKeyName] = this[val.name]
                        }

                    });
                    useAdminSdk ? getFirestoreAdmin()
                        .collection(collection)
                        .doc(primaryKeyValue)
                        .update(objectToWrite).catch((error) => {
                            console.error(error);
                            throw new Error("Update failed");
                        }) :
                        updateModel(collection, primaryKeyValue,
                            getFirestore(), objectToWrite)
                }
            }
        }
    }

}


const createDataObject = (object: any, dataKeys: dataKeyType) => {
    const objectToWrite = {}
    // accumulate all the datakeys and create an object
    dataKeys.forEach((val) => {
        const valueToWrite = object[val.name]

        if (!valueToWrite) {
            console.warn(`${val.name} is null`)
        } else {
            objectToWrite[val.remoteKeyName] = object[val.name]
        }

    });

    return objectToWrite;
}


const writeToDatabase = (
    collectionName: string,
    documentId: string,
    db: Firestore,
    objectToWrite: any) => {


    const docRef = doc(db, `${collectionName}/${documentId}`);
    setDoc(docRef, objectToWrite);

}


const updateModel = (
    collectionName: string,
    documentId: string,
    db: Firestore,
    objectToWrite: any) => {

    const docRef = doc(db, `${collectionName}/${documentId}`);
    updateDoc(docRef, objectToWrite);

}

/**
 * Adds a listener to update the model in real time
 * @param collectionName the name of the collection
 * @param documentId the id of the document
 * @param useAdminSdk whether to use the admin apis
 * @param datakeys the keys of the model marked with DataKey decorator
 * @param obj the model object
 */
const addListener = (
    collectionName: string,
    documentId: string,
    useAdminSdk: boolean,
    datakeys: dataKeyType,
    obj: BaseFirebaseModel) => {

    const handleData = (data: any) => {
        // populate the data 
        if (data) {
            datakeys.forEach((value) => {
                obj[value.name] = data[value.remoteKeyName] ?? 0;
            });

            console.log(`Data has been populated in the model ${documentId}`)

            //pass the data to the registered callbacks
            obj.callbacks.forEach((val) => {
                val(obj);
            });
        }
    }

    if (useAdminSdk) {

        getFirestoreAdmin().collection(collectionName)
            .doc(documentId)
            .onSnapshot((doc) => {
                console.log(`New data is available for the model
                ${documentId}`);
                const data = doc.data();
                handleData(data);

            })

    } else {

        const db = getFirestore();
        const docRef = doc(db, `${collectionName}/${documentId}`);

        onSnapshot(docRef, (doc) => {
            console.log(`New data is available for the model
            ${documentId}`);
            const data = doc.data();
            handleData(data);
        });
    }

}

/**
 * Validate whether all the keys are present or not
 * @param obj the model ovject
 */
const validateKeys = (obj: any) => {

    if (!obj[PRIMARY_KEY]) {
        throw new Error(`Primary key is missing,
        use @PrimaryKey to mark the document id. Refer to 
        the usage guide for details.`)
    }

    if (!obj[DATA_KEY] || obj[DATA_KEY].length == 0) {
        throw new Error(`Data keys are missing,
        use @DataKey to mark the fields that should be populated.
        Refer to the usage guide for details.`)
    }

}

/**
 * Initialize all the data key with a value of 0
 * @param keys the keys that have been marked with data key decorator
 * @param obj the model object
 */
const initializeKeys = (keys: dataKeyType, obj: any) => {
    keys.forEach((value) => {
        obj[value.name] = 0;
    })
}

