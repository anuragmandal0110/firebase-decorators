import { getApps } from "firebase/app";

export const checkAppInitialization = () => {
    if (getApps().length === 0) {
        throw new Error("Firebase app has not been initialized");
    }
}