
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
console.log("Attempting to load Firebase Config from process.env:");
console.log("NEXT_PUBLIC_FIREBASE_API_KEY:", firebaseConfigValues.apiKey ? "Loaded" : "MISSING or EMPTY");
console.log("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", firebaseConfigValues.authDomain ? "Loaded" : "MISSING or EMPTY");
console.log("NEXT_PUBLIC_FIREBASE_PROJECT_ID:", firebaseConfigValues.projectId ? "Loaded" : "MISSING or EMPTY");
console.log("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:", firebaseConfigValues.storageBucket ? "Loaded" : "Optional - MISSING or EMPTY");
console.log("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:", firebaseConfigValues.messagingSenderId ? "Loaded" : "Optional - MISSING or EMPTY");
console.log("NEXT_PUBLIC_FIREBASE_APP_ID:", firebaseConfigValues.appId ? "Loaded" : "Optional - MISSING or EMPTY");


const requiredKeys: (keyof typeof firebaseConfigValues)[] = [
  "apiKey",
  "authDomain",
  "projectId",
];

let missingKeysMessages: string[] = [];
for (const key of requiredKeys) {
  if (!firebaseConfigValues[key]) {
    const envVarName = `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`.replace('__','_');
    missingKeysMessages.push(envVarName);
  }
}

if (missingKeysMessages.length > 0) {
  const errorMessage = `Firebase configuration error: The following required environment variables are missing or empty: ${missingKeysMessages.join(", ")}. Please ensure they are set correctly in your .env.local file (or hosting provider's settings) and that the server has been restarted.`;
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.error("!!! FIREBASE CONFIGURATION ERROR !!!");
  console.error(errorMessage);
  console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  // Forcing a more visible error in case the one below is caught and re-thrown differently by Next.js
  // This error will likely stop execution if the environment variables are not properly set.
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
  try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully.");
  } catch (e) {
    console.error("Firebase initialization failed with config:", firebaseConfig);
    console.error("Error during initializeApp:", e);
    throw e; // Re-throw the error to make it visible
  }
} else {
  app = getApp();
  console.log("Existing Firebase app retrieved.");
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app); // Initialize Firestore
// const storage: FirebaseStorage = getStorage(app); // Uncomment if you need Storage
// const functions: Functions = getFunctions(app); // Uncomment if you need Functions

export { app, auth, db /*, storage, functions */ }; // Export db
