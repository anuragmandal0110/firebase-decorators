import { getFirestore, Firestore, doc, onSnapshot } from "firebase/firestore";
import DependencyStore from "../dependencyStore";
import { checkAppInitialization } from "../util";
import { getApp } from "firebase/app";
import { DATA_KEY, PRIMARY_KEY } from "../constant";
import { IFirebaseModel } from "../interface/IFirebaseModel";

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
export const FirestoreModel = (collection: string) => {
    checkAppInitialization();


    if (!DependencyStore.store.firestore) {
        DependencyStore.store.firestore = getFirestore(getApp());
    }

    const db = DependencyStore.store.firestore;


    return function (value: any, _context: ClassDecoratorContext): any {

        return class extends value {
            constructor(...args: any[]) {
                super(args);
                // check if all keys are present.
                validateKeys(this)

                const primaryKeyValue = this[this[PRIMARY_KEY]][0]
                const dataKeys = this[DATA_KEY]

                // initialize all datakeys with a 0 value;
                initializeKeys(dataKeys, this);

                // add the listener which will continuously
                // update the model whenever new data is available.
                //addListener(collection, primaryKeyValue, db, this);
            }


        }
    }

}

/**
 * Adds a listener to update the model in real time
 * @param collectionName the name of the collection
 * @param documentId the id of the document
 * @param db the database instance
 * @param object the model object
 */
const addListener = (collectionName: string, documentId: string,
    db: Firestore, object: any) => {

    const docRef = doc(db, collectionName, documentId)

    onSnapshot(docRef, (doc) => {
        const data = doc.data();

        // populate the data 
        if (data) {

        }

    })


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
const initializeKeys = (keys: Array<{name : string, remoteKeyName : string}>, obj: any) => {
    keys.forEach((value) => {
        obj[value.name] = 0;
    })
}

