// IMPORTANT: Side-effect imports to ensure Firebase services are registered.
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// This object holds the configuration keys.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required keys are present and not placeholders
const isConfigValid = 
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes("placeholder") &&
    !firebaseConfig.projectId.includes("placeholder");


let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Initialize Firebase App and services if config is valid
if (isConfigValid) {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    // This will only run on the client, as env vars are not defined on the server in this context
    if (typeof window !== 'undefined') {
        console.warn("Firebase config is missing or invalid. Firebase features will be disabled. Please check your .env file and restart the development server.");
    }
    // Set dummy objects to prevent crashes when services are used without being initialized.
    // @ts-ignore
    app = null;
    // @ts-ignore
    auth = null;
    // @ts-ignore
    db = null;
}

export { app, auth, db };
