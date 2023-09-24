/**
 * Firebase Models should extend this calss.
 */
export abstract class BaseFirebaseModel {

    callbacks: Array<(value: any) => void>;

    constructor() {
        this.callbacks = [];
    }

    /**
     * Method which resolves to signify that the model has 
     * fetched and populated the data from the database.
     * @returns A Promise that resolves to when the model is ready.
     */
    readonly ready: Promise<void>

    /**
     * Method that syncs the latest data from the database to the local.
     * @param keepLocalChanges Whether to keep local values.
     * Default true.
     * If set to false then the database values will not overwrite the local values. 
     * @returns a Promise that resolves when the data has synced.
     */
    readonly sync = (keepLocalChanges = true) => Promise<void>

    /**
     * @param fn The callback function which must be triggered
     * whenever there is a change in the data.
     * @returns void
     */
    readonly addCallback = (fn: () => void) => {
        this.callbacks.push(fn);
    }

    /**
     * This function writes the model to the database.
     * Use this to create a new document with the specified
     * primary key or to overwrite a document.
     * @returns Promise<Void>
     */
    readonly write = async () => { };


    /**
     * This function updates the model in the database.
     * @returns Promise<Void>
     */
    readonly update = async () => { };

}

