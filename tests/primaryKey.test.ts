import { PRIMARY_KEY } from "../src/constant";
import { PrimaryKey } from "../src/decorators/primaryKey";

describe('testing primary key decorator', () => {

    test('test get and set for primary key decorator', () => {
        class Model {

            @PrimaryKey(false)
            key!: string;


            constructor(primaryKey : string) {
                this.key = primaryKey;
            }
        }
        
        const model = new Model("test");
        expect(model.key).toEqual("test");
        expect(model[PRIMARY_KEY]).toEqual("key");
    });


    test('test primary key attribute of the class', () => {
        class Model {

            @PrimaryKey(false)
            key!: string;


            constructor(primaryKey : string) {
                this.key = primaryKey;
            }
        }
        
        const model = new Model("test");
        expect(model[PRIMARY_KEY]).toEqual("key");
    });



});