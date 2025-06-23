// Side-effect imports to ensure Firebase services are registered before use.
import "firebase/auth";
import "firebase/firestore";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Helper function to validate config keys and return the config object
const getFirebaseConfig = () => {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };
    
    const requiredKeys: (keyof typeof firebaseConfig)[] = ["apiKey", "authDomain", "projectId"];
    const missingKeysMessages: string[] = [];
    for (const key of requiredKeys) {
        const value = firebaseConfig[key];
        if (!value || String(value).trim() === "" || value.startsWith("NEXT_PUBLIC_")) {
            missingKeysMessages.push(`NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);
        }
    }

    if (missingKeysMessages.length > 0) {
        const errorContextGlobal = typeof window === 'undefined' ? "SERVER-SIDE" : "CLIENT-SIDE";
        const errorMessage = `Firebase configuration error (${errorContextGlobal}): The following required environment variables are missing or invalid: ${missingKeysMessages.join(", ")}. Please ensure they are set correctly in your .env file.`;
        console.error(errorMessage);
        return null;
    }
    return firebaseConfig;
}

// Initialize Firebase App (Singleton Pattern)
const app: FirebaseApp | null = (() => {
    const config = getFirebaseConfig();
    if (!config) return null;
    return getApps().length ? getApp() : initializeApp(config);
})();

// Getter function for Auth.
export function getAuthInstance(): Auth | null {
  if (!app) return null;
  try {
    return getAuth(app);
  } catch (e) {
    console.error("Failed to get Firebase Auth instance:", e);
    return null;
  }
}

// Getter function for Firestore.
export function getDbInstance(): Firestore | null {
  if (!app) return null;
  try {
    return getFirestore(app);
  } catch (e) {
    console.error("Failed to get Firebase DB instance:", e);
    return null;
  }
}
