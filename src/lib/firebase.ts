
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Side-effect only imports to ensure modules are registered
import "firebase/auth";
import "firebase/firestore";

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

// 4. Initialize Firebase App (Singleton Pattern)
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Singleton instances for services
let auth: Auth | null = null;
let db: Firestore | null = null;

// Getter function for Auth
export function getAuthInstance(): Auth | null {
  if (auth) {
    return auth;
  }
  
  if (app) {
    try {
        auth = getAuth(app);
        return auth;
    } catch (e) {
        console.error("Failed to get Firebase Auth instance:", e);
        return null;
    }
  }
  return null;
}

// Getter function for Firestore
export function getDbInstance(): Firestore | null {
  if (db) {
    return db;
  }
  
  if (app) {
    try {
      db = getFirestore(app);
      return db;
    } catch(e) {
       console.error("Failed to get Firebase DB instance:", e);
       return null;
    }
  }
  return null;
}

export const firebaseApp = app;
