
"use client";

import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import type { Dispatch, ReactNode, SetStateAction} from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase"; // Import db
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"; // Import Firestore functions
import { Skeleton } from "@/components/ui/skeleton";

// Define a more detailed user profile structure
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
  // Add other fields you expect in your Firestore user document
  createdAt?: any; // Consider using Firestore Timestamp type after fetch
  lastLoginAt?: any;
}

interface AuthContextType {
  user: UserProfile | null; // User type will now be our richer UserProfile
  loading: boolean;
  // setUser will now expect UserProfile or null
  setUser: Dispatch<SetStateAction<UserProfile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, try to fetch their profile from Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            // User document exists in Firestore
            const firestoreUser = docSnap.data() as Omit<UserProfile, 'uid'>;
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email, // Auth email is source of truth
              displayName: firestoreUser.displayName || firebaseUser.displayName, // Prefer Firestore, fallback to Auth
              photoURL: firebaseUser.photoURL, // Auth photoURL
              ...firestoreUser, // Spread the rest of Firestore data
            });
          } else {
            // User document doesn't exist in Firestore (e.g., new registration, or old auth user)
            // The RegisterForm will handle creating the initial document.
            // For an existing auth user without a Firestore profile, we set basic info.
            // This could also be a point to create a default profile if needed.
            console.warn(`User document not found in Firestore for UID: ${firebaseUser.uid}. A basic profile will be used. RegisterForm or UserProfileForm should create/update it.`);
            const basicProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "New User",
              photoURL: firebaseUser.photoURL,
              role: "student", // Default role, can be updated
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            };
             // Optionally, create a basic Firestore document here if it's truly missing
            // await setDoc(userRef, { email: firebaseUser.email, displayName: basicProfile.displayName, role: 'student', createdAt: serverTimestamp(), lastLoginAt: serverTimestamp() }, { merge: true });
            setUser(basicProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile from Firestore:", error);
          // Fallback to just Firebase Auth user data if Firestore fetch fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
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
