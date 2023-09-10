/**
 * Interface for the firestoremodel.
 */
export interface IFirebaseModel {

    /**
     * @param fn The callback function which must be triggered
     * whenever there is a change in the data.
     * @returns void
     */
    addCallback : (fn : Function) => void

}

