import { Firestore } from "firebase/firestore";
import { FirebaseApp } from "firebase/app";

import { firebaseInstanceType } from "./types/index.js";

type store = {
    "app" : FirebaseApp | null
    "firestore" : Firestore | null,
    "database" : any
}

class DependencyStore {

    /**
     * The store where various 
     */
    static store : store = {
        "app" : null,
        "firestore" : null,
        "database" : null,
    }

    static addValueToStore(instanceType : firebaseInstanceType , instance : any) {
        DependencyStore.store[instanceType] = instance

    }
}

export default DependencyStore;