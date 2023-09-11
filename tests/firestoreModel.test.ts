import { getApp, initializeApp } from "firebase/app";
import { FirestoreModel } from "../src/decorators/firestoreModel"
import { PrimaryKey } from "../src/decorators/primaryKey";
import { DataKey } from "../src/decorators/dataKey";
import { firebaseConfig } from "./mocks";
import DependencyStore from "../src/dependencyStore";
import { BaseFirebaseModel } from "../src/interface/BaseFirebaseModel";

describe('Testing firestore Model', () => {

    beforeEach(() => {
        DependencyStore.store.app = null;
    });


    test('test exception when app is not initialized', () => {

        expect(() => {
            @FirestoreModel("user")
            class Model extends BaseFirebaseModel {

                @PrimaryKey(false)
                key!: string;

                @DataKey()
                fieldOne!: string


                constructor(primaryKey: string) {
                    super()
                    this.key = primaryKey;
                }

            }
            const model = new Model("test");
        }).toThrow(Error)

    });

    test('test exception is thrown if primary key is missing', () => {

        const app = initializeApp(firebaseConfig);
        // store the app 
        DependencyStore.store.app = app;

        @FirestoreModel("user")
        class Model extends BaseFirebaseModel {

            key!: string;

            @DataKey()
            fieldOne!: string

            constructor(primaryKey: string) {
                super();
                this.key = primaryKey;
            }
            
        }

        expect(() => {
            const model = new Model("test");
        }).toThrow(Error)

    });


    test('test exception is not thrown if app is initialized', () => {

        const app = initializeApp(firebaseConfig);
        // store the app 
        DependencyStore.store.app = app;

        @FirestoreModel("user")
        class Model extends BaseFirebaseModel {

            @PrimaryKey(false)
            key!: string;

            @DataKey()
            fieldOne!: string


            constructor(primaryKey: string) {
                super();
                this.key = primaryKey;
            }

        }

        expect(() => {
            const model = new Model("test");
        }).not.toThrow(Error)

    });

    test('test exception is thrown if no datakeys are present', () => {

        const app = initializeApp(firebaseConfig);
        // store the app 
        DependencyStore.store.app = app;

        @FirestoreModel("user")
        class Model extends BaseFirebaseModel {

            @PrimaryKey(false)
            key!: string;


            constructor(primaryKey: string) {
                super();
                this.key = primaryKey;
            }

        }

        expect(() => {
            const model = new Model("test");
        }).toThrow(Error)

    });

    test('test all datakeys are initialized', () => {

        const app = initializeApp(firebaseConfig);
        // store the app 
        DependencyStore.store.app = app;

        @FirestoreModel("user")
        class Model extends BaseFirebaseModel {

            @PrimaryKey(false)
            key!: string;

            @DataKey()
            fieldOne!: string

            @DataKey()
            fieldTwo!: string

            fieldFour!: string


            constructor(primaryKey: string) {
                super();
                this.key = primaryKey;
            }

        }

        const model = new Model("test");
        expect(Object.keys(model).length).toEqual(8);
        expect(model.fieldOne).not.toBeNull()
        expect(model.fieldTwo).not.toBeNull()
        expect(model.fieldOne).toEqual(0);
        expect(model.fieldTwo).toEqual(0);
    });


    test('test model is populated', () => {

        const app = initializeApp(firebaseConfig);
        // store the app 
        DependencyStore.store.app = app;

        @FirestoreModel("user")
        class Model extends BaseFirebaseModel {

            @PrimaryKey(false)
            key!: string;


            constructor(primaryKey: string) {
                super();
                this.key = primaryKey;
            }

        }

        expect(() => {
            const model = new Model("test");
        }).toThrow(Error)

    });

});
