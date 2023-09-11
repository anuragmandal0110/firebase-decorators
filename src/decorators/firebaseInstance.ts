import DependencyStore from "../dependencyStore";
import { firebaseInstanceType } from "../types/index";

/**
 * This decorator is used to create a singleton instance
 * of different firebase services such as firestore,
 * realtime database etc.
 */
export const FirebaseInstance = (instanceType: firebaseInstanceType,
) => {

    // Define the custom get and set handlers for the field.
    const handler = {

        get() {
            const value = DependencyStore.store[instanceType]
            if (!value) {
                console.error(`Trying to access ${instanceType} without setting the value`);
            }
            return value;
        },

        set(value: any) {
            DependencyStore.addValueToStore(instanceType, value);
        }
    }

    return (value: any, context: ClassFieldDecoratorContext) => {

        const { kind, name } = context;
        if (kind === "field") {
            return function (initialValue: any) {

                if (initialValue) {
                    DependencyStore.addValueToStore(instanceType, initialValue)
                }

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