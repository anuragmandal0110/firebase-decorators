import { DATA_KEY } from "../src/constant";
import { DataKey } from "../src/decorators/dataKey";
import DependencyStore from "../src/dependencyStore";


describe('Testing data key decorator', () => {

    test('test data key attribute of the class', () => {
        class Model {

            @DataKey()
            key!: string;

        }

        const model = new Model();
        expect(model[DATA_KEY]).toEqual([{ name: "key", remoteKeyName: "key" }]);
    });




    test('test data key attribute with custom name', () => {
        class Model {

            @DataKey("test")
            key!: string;

        }

        const model = new Model();
        expect(model[DATA_KEY]).toEqual([{ name: "key", remoteKeyName: "test" }]);
    });



    test('test multiple data keys', () => {
        class Model {

            @DataKey("test")
            key!: string;

            @DataKey("test2")
            key1!: string;

            @DataKey()
            key3!: string;

        }

        const model = new Model();
        const sortedKeys = model[DATA_KEY]
        const expected = [
            { name: "key", remoteKeyName: "test" },
            { name: "key1", remoteKeyName: "test2" },
            { name: "key3", remoteKeyName: "key3" },
        ]
        expect(sortedKeys).toEqual(expected);
    });





});