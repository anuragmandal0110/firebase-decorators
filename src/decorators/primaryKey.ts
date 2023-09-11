import { PRIMARY_KEY } from "../constant/index.js";

/**
 * This decorator is used to mark a model's attribute as the
 * primary key. By default, the primary key is expected to be
 * the documnent id as well. 
 * If the primary key is not the document id, then the model will
 * be populated with the result of a query using the primary key.
 * In case more than 1 result is returned by firebase, the first
 * item will be used to populate the model.
 */
export const PrimaryKey = (isDocId: Boolean = true) => {

    let value = "";

    // Define the custom get and set handlers for the field.
    const handler = {

        get() {
            return value;
        },

        set(newValue: any) {
            value = newValue;
        }
    }

    return (_value: any, context: ClassFieldDecoratorContext) => {

        const { kind, name } = context;
        if (kind === "field") {
            return function (initialValue: void | any) : any | void {

                // set the name of the property as primary key
                // this will be used query and update the object.
                Reflect.defineProperty(this, PRIMARY_KEY, { value: name })

                value = initialValue;

                Object.defineProperty(this, name, {
                    get: handler.get,
                    set: handler.set,
                    configurable : true
                })
                return initialValue;
            };

        } else {
            throw new Error("This decorator can only be used on class fields");
        }
    }
};