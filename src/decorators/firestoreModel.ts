import {
    checkAppInitialization, createDataObject,
    fetchData, handleData, updateModel, writeToDatabase
} from "../util/index.js";
import { DATA_KEY, PRIMARY_KEY } from "../constant/index.js";
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
 * @param collection The name of the collection where the model will be written to.
 * @param useAdminSdk Whether to use the firebase admin sdk or not.
 */
export const FirestoreModel = (collection: string, useAdminSdk = false) => {
    checkAppInitialization();


    return function (value: any, _context: ClassDecoratorContext): any {

        // the promise that resolves after fetching the initial data.
        let initialDataPromise: Promise<any> = null

        return class extends value {
            constructor(...args: any[]) {
                super(args);
                const thisObj = this;
                console.log(`Using admin ask - ${useAdminSdk}`);

                // check if all keys are present.
                validateKeys(thisObj)

                const primaryKeyValue: string = thisObj[thisObj[PRIMARY_KEY]][0]
                const dataKeys: dataKeyType = thisObj[DATA_KEY]

                // initialize all datakeys with a 0 value;
                initializeKeys(dataKeys, thisObj);

                initialDataPromise = fetchData(collection,
                    primaryKeyValue, useAdminSdk).then((data) => {
                        // for initial fetch, DO NOT OVERWRITE local data
                        handleData(data, dataKeys, thisObj, true)
                        console.log(`Initail fetch successful, data = ${JSON.stringify(data)}, model = ${JSON.stringify(thisObj)}`);
                    }).catch((error) => {
                        console.error("Initial fetch error", error);
                    });

                // set the isReady parameter of the model.
                this.ready = initialDataPromise;

                // // add the listener which will continuously
                // // update the model whenever new data is available.
                // if (realTimeUpdate) {
                //     addListener(collection, primaryKeyValue, useAdminSdk,
                //         dataKeys, (thisObj as unknown) as BaseFirebaseModel);
                // }

                // define the write function
                thisObj.write = async () => {
                    const objectToWrite = createDataObject(thisObj, dataKeys)
                    await writeToDatabase(collection, primaryKeyValue,
                        objectToWrite, useAdminSdk);
                }

                // define the update function
                thisObj.update = async (): Promise<any> => {
                    // update will be done only after initial promise is successful
                    await initialDataPromise.then(async () => {
                        console.log(`Current model - ${JSON.stringify(thisObj)}`)
                        const objectToWrite = createDataObject(thisObj, dataKeys)
                        console.log(`Updated model - ${JSON.stringify(objectToWrite)} 
                        with datakeys - ${JSON.stringify(dataKeys)}`)
                        await updateModel(collection, primaryKeyValue,
                            objectToWrite, useAdminSdk)
                    })

                }
                // define this sync function
                this.sync = async (keepLocalChanges: Boolean = true)
                    : Promise<void> => {
                    await fetchData(collection,
                        primaryKeyValue, useAdminSdk)
                        .then((data) => {
                            handleData(data, dataKeys, thisObj, keepLocalChanges)
                            console.log(`Initail fetch successful,
                            data = ${JSON.stringify(data)},
                            model = ${JSON.stringify(thisObj)}`);
                        }).catch((error) => {
                            console.error("Initial fetch error", error);
                        });
                }
            }
        }
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

