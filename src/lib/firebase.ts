
import { initializeApp, getApps, getApp, type FirebaseApp } from "@firebase/app";
import { getAuth, type Auth } from "@firebase/auth"; 
import { getFirestore, type Firestore } from "firebase/firestore";

// Helper for logging config to avoid repeating JSON.stringify with replacer
const replacer = (key: string, value: any) => {
  if (value === undefined) return "ENV_VAR_OR_CONFIG_VALUE_UNDEFINED";
  if (value === null) return "CONFIG_VALUE_NULL";
  return value;
};

const errorContextGlobal = typeof window === 'undefined' ? "SERVER-SIDE" : "CLIENT-SIDE";

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

if (typeof window !== 'undefined') {
  console.log(`${errorContextGlobal}: Raw Firebase Config Values from process.env:`, JSON.stringify(firebaseConfigValues, replacer, 2));
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
  const valueStr = String(value).toLowerCase();
  if (!value || value.trim() === "" || valueStr === 'null' || valueStr === 'undefined') {
    const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`.replace('__','_');
    missingKeysMessages.push(envVarName);
  }
}

if (missingKeysMessages.length > 0) {
  const errorMessage = `Firebase configuration error (${errorContextGlobal}): The following required environment variables are missing, empty, or invalid placeholders: ${missingKeysMessages.join(", ")}. Please ensure they are set correctly.`;
  const currentConfigForError = JSON.stringify(firebaseConfigValues, (key, value) => value === undefined ? "ENV_VAR_UNDEFINED_AT_ERROR" : value, 2);
  
  console.error(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ${errorContextGlobal} !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
  console.error(`!!! FIREBASE CONFIGURATION ERROR !!! (${errorContextGlobal})`);
  console.error(errorMessage);
  console.error(`Current firebaseConfigValues that failed validation (${errorContextGlobal}):`, currentConfigForError);
  console.error(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ${errorContextGlobal} !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
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

// 4. Initialize Firebase App
let app: FirebaseApp;
if (!getApps().length) {
  if (typeof window === 'undefined') {
    console.log("SERVER-SIDE: Effective firebaseConfig for initializeApp:", JSON.stringify(firebaseConfig, replacer, 2));
  } else {
    console.log("CLIENT-SIDE: Effective firebaseConfig for initializeApp:", JSON.stringify(firebaseConfig, replacer, 2));
  }
  app = initializeApp(firebaseConfig);
  if (typeof window === 'undefined') {
    console.log("SERVER-SIDE: Firebase app initialized (first time). Name:", app.name, "Options:", JSON.stringify(app.options, replacer, 2));
  } else {
    console.log("CLIENT-SIDE: Firebase app initialized (first time). Name:", app.name, "Options:", JSON.stringify(app.options, replacer, 2));
  }
} else {
  app = getApp();
  if (typeof window === 'undefined') {
    console.log("SERVER-SIDE: Retrieving existing Firebase app. Name:", app.name, "Options:", JSON.stringify(app.options, replacer, 2));
  } else {
    console.log("CLIENT-SIDE: Retrieving existing Firebase app. Name:", app.name, "Options:", JSON.stringify(app.options, replacer, 2));
  }
}

// Singleton instances for services
let authSingleton: Auth | null = null;
let dbSingleton: Firestore | null = null;

// Getter function for Auth
const getFirebaseAuth = (): Auth | null => {
  if (authSingleton) {
    return authSingleton;
  }
  const errorContext = typeof window === 'undefined' ? "SERVER-SIDE" : "CLIENT-SIDE";
  if (app && firebaseConfig.authDomain && firebaseConfig.authDomain.includes('.') && firebaseConfig.authDomain.toLowerCase() !== 'null' && firebaseConfig.authDomain.toLowerCase() !== 'undefined' && firebaseConfig.authDomain.trim() !== "") {
    try {
      authSingleton = getAuth(app);
      console.log(`${errorContext}: Firebase Auth service obtained on demand.`);
      return authSingleton;
    } catch (e) {
      console.error(`${errorContext}: Firebase Auth on-demand initialization FAILED. App Name: ${app?.name}. App Options:`, JSON.stringify(app?.options, replacer, 2), "Error:", e);
      authSingleton = null; // Explicitly set to null on failure
      return null;
    }
  } else {
    console.error(`${errorContext}: Firebase Auth on-demand initialization SKIPPED due to invalid/missing authDomain. Configured authDomain:`, firebaseConfig.authDomain);
    authSingleton = null; // Explicitly set to null
    return null;
  }
};

// Getter function for Firestore
const getFirebaseDb = (): Firestore | null => {
  if (dbSingleton) {
    return dbSingleton;
  }
  const errorContext = typeof window === 'undefined' ? "SERVER-SIDE" : "CLIENT-SIDE";
  if (app) {
    try {
      dbSingleton = getFirestore(app);
      console.log(`${errorContext}: Firebase Firestore service obtained on demand.`);
      return dbSingleton;
    } catch (e) {
      console.error(`${errorContext}: Firebase Firestore on-demand initialization FAILED. Error:`, e);
      dbSingleton = null;
      return null;
    }
  } else {
    console.error(`${errorContext}: Firebase Firestore on-demand initialization SKIPPED because Firebase app is not available.`);
    dbSingleton = null;
    return null;
  }
};

export const firebaseApp = app;
// Export the getter functions
export const getAuthInstance = getFirebaseAuth;
export const getDbInstance = getFirebaseDb;
