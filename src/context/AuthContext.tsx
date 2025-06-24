
"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";
// Only import types from firebase at the top level
import type { User as FirebaseUser, Auth } from "firebase/auth";
import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";

// This is a client-side only context.
// Firebase will be dynamically imported and initialized in a useEffect hook
// to ensure it only runs in the browser, preventing server-side build errors.

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role?: "student" | "va" | "print-center" | "admin";
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  passportNumber?: string;
  isEmailVerified?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  setUser: Dispatch<SetStateAction<UserProfile | null>>;
  // Instances are now available via context for components that need them
  authInstance: Auth | null;
  dbInstance: Firestore | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInstance, setAuthInstance] = useState<Auth | null>(null);
  const [dbInstance, setDbInstance] = useState<Firestore | null>(null);

  useEffect(() => {
    // This effect runs only on the client side.
    const initializeFirebase = async () => {
      try {
        // Use dynamic imports to prevent server-side bundling
        const { initializeApp, getApps, getApp } = await import("firebase/app");
        const { getAuth, onAuthStateChanged } = await import("firebase/auth");
        const { getFirestore } = await import("firebase/firestore");
        
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        const auth = getAuth(app);
        const db = getFirestore(app);
        
        setAuthInstance(auth);
        setDbInstance(db);

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            // For now, using a mocked-up profile. In a real app, you'd fetch this from Firestore.
            const profile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "STIPS Lite User",
              photoURL: firebaseUser.photoURL,
              isEmailVerified: firebaseUser.emailVerified,
              role: "student",
              firstName: firebaseUser.displayName?.split(' ')[0] || "Test",
              lastName: firebaseUser.displayName?.split(' ')[1] || "User",
            };
            setUser(profile);
          } else {
            setUser(null);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Firebase initialization error:", error);
        setLoading(false);
      }
    };

    initializeFirebase();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, loading, setUser, authInstance, dbInstance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
