
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore"; // Ensure Firestore is imported
// import { getStorage, type FirebaseStorage } from "firebase/storage"; // Uncomment if you need Storage
// import { getFunctions, type Functions } from "firebase/functions"; // Uncomment if you need Functions

const firebaseConfigValues = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Log all Firebase related env vars for debugging
if (typeof window === 'undefined') { // Server-side logging
    console.log("SERVER-SIDE: Reading Firebase Config from process.env:");
    Object.entries(firebaseConfigValues).forEach(([key, value]) => {
        const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`.replace('__','_');
        const valueExists = value && value.trim() !== "" && value.toLowerCase() !== 'null' && value.toLowerCase() !== 'undefined';
        console.log(`${envVarName}:`, valueExists ? "Exists" : `MISSING, EMPTY, or INVALID PLACEHOLDER ('${String(value)}')`);
    });
}


const requiredKeys: (keyof typeof firebaseConfigValues)[] = [
  "apiKey",
  "authDomain",
  "projectId",
];

let missingKeysMessages: string[] = [];
for (const key of requiredKeys) {
  const value = firebaseConfigValues[key];
  const valueStr = String(value).toLowerCase();
  if (!value || value.trim() === "" || valueStr === 'null' || valueStr === 'undefined') {
    const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`.replace('__','_');
    missingKeysMessages.push(envVarName);
  }
}

if (missingKeysMessages.length > 0) {
  const errorMessage = `Firebase configuration error: The following required environment variables are missing, empty, or invalid placeholders (e.g., "null", "undefined"): ${missingKeysMessages.join(", ")}. Please ensure they are set correctly in your .env.local file (or hosting provider's settings) and that the server has been restarted.`;
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.error("!!! FIREBASE CONFIGURATION ERROR !!!");
  console.error(errorMessage);
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  throw new Error(errorMessage);
}

const firebaseConfig = {
  apiKey: firebaseConfigValues.apiKey!,
  authDomain: firebaseConfigValues.authDomain!,
  projectId: firebaseConfigValues.projectId!,
  storageBucket: firebaseConfigValues.storageBucket,
  messagingSenderId: firebaseConfigValues.messagingSenderId,
  appId: firebaseConfigValues.appId,
  measurementId: firebaseConfigValues.measurementId,
};

// Initialize Firebase
let app: FirebaseApp;

if (!getApps().length) {
  // This block runs only once per process (e.g., server start, or first client load)
  try {
    if (typeof window === 'undefined') { // Server-side logging
      console.log("SERVER-SIDE: Initializing Firebase for the first time with config:", JSON.stringify(firebaseConfig, (key, value) => value === undefined ? "UNDEFINED_IN_CONFIG_OBJECT" : value, 2));
    }
    app = initializeApp(firebaseConfig);
    if (typeof window === 'undefined') { // Server-side logging AFTER initialization
      console.log("SERVER-SIDE: Firebase app initialized (first time). Name:", app.name, "Options:", JSON.stringify(app.options, (key, value) => value === undefined ? "UNDEFINED_IN_APP_OPTIONS" : value, 2));
    } else {
      // console.log("CLIENT-SIDE: Firebase app initialized (first time). Name:", app.name); // More verbose for client
    }
  } catch (e) {
    if (typeof window === 'undefined') {
        console.error("SERVER-SIDE: Firebase FIRST initialization FAILED. Config used:", JSON.stringify(firebaseConfig, (key, value) => value === undefined ? "UNDEFINED_IN_CONFIG_OBJECT" : value, 2));
    } else {
        console.error("CLIENT-SIDE: Firebase FIRST initialization FAILED.");
    }
    console.error("Error during initializeApp:", e);
    throw e;
  }
} else {
  // This block runs if Firebase is already initialized
  app = getApp();
   if (typeof window === 'undefined') { // Log only on server when retrieving existing app
     console.log("SERVER-SIDE: Retrieving existing Firebase app. Name:", app.name, "Options:", JSON.stringify(app.options, (key, value) => value === undefined ? "UNDEFINED_IN_APP_OPTIONS" : value, 2));
  } else {
    // console.log("CLIENT-SIDE: Retrieving existing Firebase app."); // Can be noisy on client
  }
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app); // Initialize Firestore
// const storage: FirebaseStorage = getStorage(app); // Uncomment if you need Storage
// const functions: Functions = getFunctions(app); // Uncomment if you need Functions

export { app, auth, db /*, storage, functions */ }; // Export db
