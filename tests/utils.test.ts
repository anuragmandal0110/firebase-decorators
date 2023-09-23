// import { mockFirebase } from 'firestore-jest-mock';
// import { mockCollection } from 'firestore-jest-mock/mocks/firestore';
import { initializeApp } from "@firebase/app";
import { checkAppInitialization, createDataObject, handleData, writeToDatabase } from "../src/util"
import { firebaseConfig } from "./mocks";
import { dataKeyType } from "../src/types";
import {
    getFirestore, doc,
    onSnapshot, setDoc, updateDoc, getDoc
} from "firebase/firestore";


jest.mock("firebase/firestore");



describe('testing utility', () => {

beforeAll(() => {
    jest.resetAllMocks()
})

    test("test checkAppInitialization with apps not initialized", () => {
        expect(() => checkAppInitialization()).toThrow(Error)
    });

    test("test checkAppInitialization with apps initialized", () => {
        initializeApp(firebaseConfig);
        expect(() => checkAppInitialization()).not.toThrow(Error)
    });

    test("test data object creation", () => {
        const obj = { "name": "Anurag", "job": "none" }
        const datakeys: dataKeyType = [{ name: "name", remoteKeyName: "firstName" }]
        const objectToWrite = createDataObject(obj, datakeys)
        expect(objectToWrite).toEqual({ "firstName": "Anurag" })
    });

    test("test data population to the object", () => {
        const obj = {}
        const data = { "firstName": "Anurag", "job": "none", "test": "test" }
        const datakeys: dataKeyType = [{ name: "name", remoteKeyName: "firstName" }
            , { name: "job", remoteKeyName: "job" }]
        handleData(data, datakeys, obj);
        expect(obj).toEqual({ "name": "Anurag", "job": "none" })
    });


    test("test writing to database", () => {
        //@ts-ignore
        //writeToDatabase("test", "test", {}, false)
    });



})
