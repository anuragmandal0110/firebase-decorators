/**
 * Firebase Models should extend this calss.
 */ 
export abstract class BaseFirebaseModel {

    callbacks : Array<( value : any) => void>;

    constructor() {
        this.callbacks = [];
    }

    
    /**
     * @param fn The callback function which must be triggered
     * whenever there is a change in the data.
     * @returns void
     */
    readonly addCallback = (fn : () => void) => {
        this.callbacks.push(fn);
    }

    /**
     * This function writes the model to the database.
     * Use this to create a new document with the specified
     * primary key or to overwrite a document.
     * @returns void
     */
    readonly write = () => {};


    /**
     * This function updates the model in the database.
     * @returns void
     */
    readonly update = () => {};


    // /**
    //  * This function deletes the model from the dabase.
    //  * @returns void
    //  */
    // private delete = () => {};

}

