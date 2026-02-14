import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAzRUGZUzBCnf0e2JeY4l8m_Hg49lpzmUI",
    authDomain: "chronos-bharat.firebaseapp.com",
    projectId: "chronos-bharat",
    storageBucket: "chronos-bharat.firebasestorage.app",
    messagingSenderId: "215398977160",
    appId: "1:215398977160:web:321bba6b837f498e0a193d",
    measurementId: "G-2H3X12J4CZ"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, analytics };
