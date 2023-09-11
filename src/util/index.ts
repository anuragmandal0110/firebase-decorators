import { getApps } from "firebase/app";
import { getApps as getAppsAdmin } from "firebase-admin/app";

export const checkAppInitialization = () => {
    const adminApps = getAppsAdmin();
    // if apps or admin app is not available then throw and error.
    if (getApps().length === 0 && adminApps.length == 0) {
        throw new Error("Firebase app has not been initialized");
    }
}