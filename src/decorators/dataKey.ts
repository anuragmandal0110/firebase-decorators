import { DATA_KEY, PRIMARY_KEY } from "../constant/index.js";

/**
 * This decorator is used to mark a model's field as a data field.
 * When the model is populated, only the fields marked with
 * this decorator will be populated.
 */
export const DataKey = (remoteKeyName: string | null = "") => {

    return (_value: any, context: ClassFieldDecoratorContext) => {

        const { kind, name } = context;
        if (kind === "field") {
            return function (initialValue: void | any) : any | void {

                // set the name of the property as primary key
                // this will be used query and update the object.
                const keys: Array<{
                    name: string,
                    remoteKeyName: string
                }> | null = Reflect.get(this, DATA_KEY);

                const keyToPush = {
                    name: name as string,
                    remoteKeyName: (remoteKeyName.length == 0 ? name
                        : remoteKeyName) as string
                }

                if (!keys) {
                    Reflect.defineProperty(this, DATA_KEY, {
                        value: [keyToPush]
                    })
                } else {
                    keys.push(keyToPush)
                    Reflect.defineProperty
                }

                return initialValue;
            };

        } else {
            throw new Error("This decorator can only be used on class fields");
        }
    }
};