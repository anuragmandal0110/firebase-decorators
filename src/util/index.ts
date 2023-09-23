import { getApps } from "firebase/app";
import { getApps as getAppsAdmin } from "firebase-admin/app";
import { dataKeyType } from "../types/index.js";
import {
    getFirestore, doc,
    onSnapshot, setDoc, updateDoc, getDoc, DocumentSnapshot
} from "firebase/firestore";
import {
    getFirestore as getFirestoreAdmin,
} from "firebase-admin/firestore";
import { BaseFirebaseModel } from "../index.js";


export const checkAppInitialization = () => {
    const adminApps = getAppsAdmin();
    // if apps or admin app is not available then throw and error.
    if (getApps().length === 0 && adminApps.length == 0) {
        throw new Error("Firebase app has not been initialized");
    }
}


export const createDataObject = (object: any, dataKeys: dataKeyType) => {
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

export const writeToDatabase = (
    collectionName: string,
    documentId: string,
    objectToWrite: any,
    useAdminSdk: boolean) => {

    if (useAdminSdk) {
        getFirestoreAdmin()
            .collection(collectionName)
            .doc(documentId)
            .set(objectToWrite).catch((error) => {
                console.error(error);
                throw new Error("Write failed");
            })
    } else {
        const docRef = doc(getFirestore(), `${collectionName}/${documentId}`);
        setDoc(docRef, objectToWrite);
    }

}

export const updateModel = (
    collectionName: string,
    documentId: string,
    objectToWrite: any,
    useAdminSdk: boolean) => {

    if (useAdminSdk) {
        getFirestoreAdmin()
            .collection(collectionName)
            .doc(documentId)
            .update(objectToWrite).catch((error) => {
                console.error(error);
                throw new Error("Update failed");
            })
    } else {
        const docRef = doc(getFirestore(), `${collectionName}/${documentId}`);
        updateDoc(docRef, objectToWrite);
    }

}

export const handleData = (data: any, datakeys: dataKeyType,
    obj: any) => {
    // populate the data 
    if (data) {
        datakeys.forEach((value) => {
            obj[value.name] = data[value.remoteKeyName] ?? null;
        });
        //pass the data to the registered callbacks
        obj?.callbacks?.forEach((val: any) => {
            val(obj);
        });
    }
}

/**
* Adds a listener to update the model in real time
* @param collectionName the name of the collection
* @param documentId the id of the document
* @param useAdminSdk whether to use the admin apis
* @param datakeys the keys of the model marked with DataKey decorator
* @param obj the model object
*/
export const addListener = (
    collectionName: string,
    documentId: string,
    useAdminSdk: boolean,
    datakeys: dataKeyType,
    obj: BaseFirebaseModel) => {

    if (useAdminSdk) {
        getFirestoreAdmin().collection(collectionName)
            .doc(documentId)
            .onSnapshot((doc) => {
                console.log(`New data is available for the model
               ${documentId}`);
                const data = doc.data();

            });

    } else {
        const db = getFirestore();
        const docRef = doc(db, `${collectionName}/${documentId}`);

        onSnapshot(docRef, (doc) => {
            console.log(`New data is available for the model
           ${documentId}`);
            const data = doc.data();
            handleData(data, datakeys, obj);;
        });
    }

    console.log(`Data has been populated in the model ${documentId}`)
}


export const fetchInitialData = async (collectionName: string,
    documentId: string, useAdminSdk: boolean) => {

    let document: DocumentSnapshot | FirebaseFirestore.DocumentSnapshot;
    if (useAdminSdk) {
        document = await getFirestoreAdmin().collection(collectionName)
            .doc(documentId)
            .get()
    } else {
        const db = getFirestore();
        const docRef = doc(db, `${collectionName}/${documentId}`);
        document = await getDoc(docRef)
        document
    }

    if (document.exists) {
        return document.data
    } else {
        return {}
    }
}

