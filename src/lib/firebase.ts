
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
// import { getStorage, type FirebaseStorage } from "firebase/storage";
// import { getFunctions, type Functions } from "firebase/functions";

// Helper for logging config to avoid repeating JSON.stringify with replacer
const replacer = (key: string, value: any) => value === undefined ? "ENV_VAR_OR_CONFIG_VALUE_UNDEFINED" : value;

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

// Client-side specific logging for the raw values read from process.env
if (typeof window !== 'undefined') {
  console.log("CLIENT-SIDE: Raw Firebase Config Values from process.env:", JSON.stringify(firebaseConfigValues, replacer, 2));
} else {
  console.log("SERVER-SIDE: Raw Firebase Config Values from process.env:", JSON.stringify(firebaseConfigValues, replacer, 2));
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
  
  const errorContextLog = typeof window === 'undefined' ? "SERVER-SIDE" : "CLIENT-SIDE";
  console.error(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ${errorContextLog} !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
  console.error(`!!! FIREBASE CONFIGURATION ERROR !!! (${errorContextLog})`);
  console.error(errorMessage);
  console.error(`Current firebaseConfigValues that failed validation (${errorContextLog}):`, currentConfigForError);
  console.error(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ${errorContextLog} !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
  throw new Error(errorMessage);
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

const errorContext = typeof window === 'undefined' ? "SERVER-SIDE" : "CLIENT-SIDE";

try {
  if (!getApps().length) {
    console.log(`${errorContext}: Initializing Firebase for the first time with effective config:`, JSON.stringify(firebaseConfig, replacer, 2));
    app = initializeApp(firebaseConfig);
    console.log(`${errorContext}: Firebase app initialized (first time). Name:`, app.name);
  } else {
    app = getApp();
    console.log(`${errorContext}: Retrieving existing Firebase app. Name:`, app.name);
  }

  // Attempt to initialize Auth only if authDomain is plausible
  if (firebaseConfig.authDomain && firebaseConfig.authDomain.includes('.') && firebaseConfig.authDomain.length > 3) {
    try {
      authInstance = getAuth(app);
      console.log(`${errorContext}: Firebase Auth service obtained.`);
    } catch (e) {
      console.error(`${errorContext}: Firebase Auth initialization FAILED. Config used for app:`, JSON.stringify(app.options, replacer, 2), "Error:", e);
    }
  } else {
    console.error(`${errorContext}: Firebase Auth initialization SKIPPED due to invalid or missing authDomain in effective config:`, firebaseConfig.authDomain);
  }

  // Attempt to initialize Firestore
  try {
    dbInstance = getFirestore(app);
    console.log(`${errorContext}: Firebase Firestore service obtained.`);
  } catch (e) {
    console.error(`${errorContext}: Firebase Firestore initialization FAILED. Config used for app:`, JSON.stringify(app.options, replacer, 2), "Error:", e);
  }

  // Initialize other services similarly if needed
  // try {
  //   storageInstance = getStorage(app);
  //   console.log(`${errorContext}: Firebase Storage service obtained.`);
  // } catch (e) {
  //    console.error(`${errorContext}: Firebase Storage initialization FAILED. Error:`, e);
  // }

} catch (e) {
  console.error(`${errorContext}: Firebase App main initialization FAILED. Effective config used:`, JSON.stringify(firebaseConfig, replacer, 2));
  console.error(`${errorContext}: Full error during app initialization:`, e);
  // If app itself fails to initialize, re-throw. Services failing might be recoverable by the app.
  // However, auth is critical for AuthContext.
  throw e; 
}

export const firebaseApp = app; // Export the app instance
export const auth = authInstance;
export const db = dbInstance;
// export const storage = storageInstance;
// export const functions = functionsInstance;
