
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
// Changed from "firebase/auth" to "@firebase/auth"
import { getAuth, type Auth } from "@firebase/auth"; 
import { getFirestore, type Firestore } from "firebase/firestore";
// import { getStorage, type FirebaseStorage } from "firebase/storage";
// import { getFunctions, type Functions } from "firebase/functions";

// Helper for logging config to avoid repeating JSON.stringify with replacer
const replacer = (key: string, value: any) => {
  if (value === undefined) return "ENV_VAR_OR_CONFIG_VALUE_UNDEFINED";
  if (value === null) return "CONFIG_VALUE_NULL"; // Differentiate from undefined
  return value;
};

// 1. Read environment variables ONCE at the module scope.
const firebaseConfigValues = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const errorContextGlobal = typeof window === 'undefined' ? "SERVER-SIDE" : "CLIENT-SIDE";

// Client-side specific logging for the raw values read from process.env
if (typeof window !== 'undefined') {
  console.log("CLIENT-SIDE: Raw Firebase Config Values from process.env:", JSON.stringify(firebaseConfigValues, replacer, 2));
} else {
  // console.log("SERVER-SIDE: Raw Firebase Config Values from process.env:", JSON.stringify(firebaseConfigValues, replacer, 2));
}

// 2. Perform validation ONCE and IMMEDIATELY.
const requiredKeys: (keyof typeof firebaseConfigValues)[] = [
  "apiKey",
  "authDomain",
  "projectId",
];
let missingKeysMessages: string[] = [];
for (const key of requiredKeys) {
  const value = firebaseConfigValues[key];
  const valueStr = String(value).toLowerCase(); // Convert to string and then lowercase for "null"/"undefined" check
  if (!value || value.trim() === "" || valueStr === 'null' || valueStr === 'undefined') {
    const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`.replace('__','_');
    missingKeysMessages.push(envVarName);
  }
}

if (missingKeysMessages.length > 0) {
  const errorMessage = `Firebase configuration error: The following required environment variables are missing, empty, or invalid placeholders (e.g., "null", "undefined"): ${missingKeysMessages.join(", ")}. Please ensure they are set correctly in your .env.local file (or hosting provider's settings) and that the server/build process has been restarted/re-run.`;
  const currentConfigForError = JSON.stringify(firebaseConfigValues, (key, value) => value === undefined ? "ENV_VAR_UNDEFINED_AT_ERROR" : value, 2);
  
  console.error(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ${errorContextGlobal} !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
  console.error(`!!! FIREBASE CONFIGURATION ERROR !!! (${errorContextGlobal})`);
  console.error(errorMessage);
  console.error(`Current firebaseConfigValues that failed validation (${errorContextGlobal}):`, currentConfigForError);
  console.error(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ${errorContextGlobal} !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
  throw new Error(errorMessage); // This will halt execution if config is bad
}

// 3. Construct the final config object ONCE.
const firebaseConfig = {
  apiKey: firebaseConfigValues.apiKey!,
  authDomain: firebaseConfigValues.authDomain!,
  projectId: firebaseConfigValues.projectId!,
  storageBucket: firebaseConfigValues.storageBucket,
  messagingSenderId: firebaseConfigValues.messagingSenderId,
  appId: firebaseConfigValues.appId,
  measurementId: firebaseConfigValues.measurementId,
};

// 4. Initialize Firebase App and services
let app: FirebaseApp;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
// let storageInstance: FirebaseStorage | null = null; // Uncomment if used
// let functionsInstance: Functions | null = null; // Uncomment if used


if (!getApps().length) {
  console.log(`${errorContextGlobal}: Effective firebaseConfig for initializeApp:`, JSON.stringify(firebaseConfig, replacer, 2));
  app = initializeApp(firebaseConfig);
  console.log(`${errorContextGlobal}: Firebase app initialized (first time). Name:`, app.name, "Options:", JSON.stringify(app.options, replacer, 2));
} else {
  app = getApp();
  console.log(`${errorContextGlobal}: Retrieving existing Firebase app. Name:`, app.name, "Options:", JSON.stringify(app.options, replacer, 2));
}

if (typeof window !== 'undefined') { // Client-side
  console.log("CLIENT-SIDE: Firebase app object before service init:", app ? { name: app.name, options: app.options } : "App object not available");
  if (app && firebaseConfig.authDomain && firebaseConfig.authDomain.includes('.') && firebaseConfig.authDomain !== "ENV_VAR_OR_CONFIG_VALUE_UNDEFINED") {
    try {
      authInstance = getAuth(app);
      console.log("CLIENT-SIDE: Firebase Auth service obtained.");
    } catch (e) {
      console.error(`CLIENT-SIDE: Firebase Auth initialization FAILED. App Name: ${app?.name}. App Options:`, JSON.stringify(app?.options, replacer, 2), "Error:", e);
      authInstance = null;
    }
  } else {
    console.error("CLIENT-SIDE: Firebase Auth initialization SKIPPED due to invalid or missing authDomain. Auth Domain:", firebaseConfig.authDomain);
    authInstance = null;
  }

  try {
    dbInstance = getFirestore(app);
    console.log("CLIENT-SIDE: Firebase Firestore service obtained.");
  } catch (e) {
    console.error("CLIENT-SIDE: Firebase Firestore initialization FAILED. Error:", e);
    dbInstance = null;
  }
} else { // Server-side
  if (app && firebaseConfig.authDomain && firebaseConfig.authDomain.includes('.') && firebaseConfig.authDomain !== "ENV_VAR_OR_CONFIG_VALUE_UNDEFINED") {
    try {
      authInstance = getAuth(app);
      console.log("SERVER-SIDE: Firebase Auth service obtained.");
    } catch (e) {
      console.error("SERVER-SIDE: Firebase Auth initialization FAILED. Error:", e);
      authInstance = null;
    }
  } else {
    console.error("SERVER-SIDE: Firebase Auth initialization SKIPPED due to invalid or missing authDomain. Auth Domain:", firebaseConfig.authDomain);
    authInstance = null;
  }

  try {
    dbInstance = getFirestore(app);
    console.log("SERVER-SIDE: Firebase Firestore service obtained.");
  } catch (e) {
    console.error("SERVER-SIDE: Firebase Firestore initialization FAILED. Error:", e);
    dbInstance = null;
  }
}

export const firebaseApp = app;
export const auth = authInstance;
export const db = dbInstance;
// export const storage = storageInstance;
// export const functions = functionsInstance;

