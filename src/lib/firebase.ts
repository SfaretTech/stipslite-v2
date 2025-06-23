
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Side-effect only imports to ensure modules are registered
import "firebase/auth";
import "firebase/firestore";

// --- Singleton instances for services ---
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const getFirebaseApp = (): FirebaseApp | null => {
  // If the app is already initialized, return it.
  if (app) {
    return app;
  }
  
  // Read environment variables
  const firebaseConfigValues = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // Perform validation.
  const requiredKeys: (keyof typeof firebaseConfigValues)[] = ["apiKey", "authDomain", "projectId"];
  const missingKeys: string[] = [];
  for (const key of requiredKeys) {
    const value = firebaseConfigValues[key];
    if (!value || String(value).trim() === "") {
        missingKeys.push(`NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);
    }
  }

  // If keys are missing, log a clear error and return null.
  if (missingKeys.length > 0) {
    const context = typeof window === 'undefined' ? "SERVER-SIDE" : "CLIENT-SIDE";
    console.error(
        `Firebase Init Error (${context}): The following required environment variables are missing or empty: ${missingKeys.join(", ")}. Please create a .env file and set them correctly. Your app will run, but Firebase services will be disabled.`
    );
    return null;
  }
  
  // Construct the final config object.
  const firebaseConfig = {
    apiKey: firebaseConfigValues.apiKey!,
    authDomain: firebaseConfigValues.authDomain!,
    projectId: firebaseConfigValues.projectId!,
    storageBucket: firebaseConfigValues.storageBucket,
    messagingSenderId: firebaseConfigValues.messagingSenderId,
    appId: firebaseConfigValues.appId,
    measurementId: firebaseConfigValues.measurementId,
  };

  // Initialize Firebase App (Singleton Pattern)
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  return app;
}


// Getter function for Auth
export function getAuthInstance(): Auth | null {
  if (auth) {
    return auth;
  }
  
  const firebaseApp = getFirebaseApp();
  if (firebaseApp) {
    try {
        auth = getAuth(firebaseApp);
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
  
  const firebaseApp = getFirebaseApp();
  if (firebaseApp) {
    try {
      db = getFirestore(firebaseApp);
      return db;
    } catch(e) {
       console.error("Failed to get Firebase DB instance:", e);
       return null;
    }
  }
  return null;
}
