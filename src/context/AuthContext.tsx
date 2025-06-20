
"use client";

import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import type { Dispatch, ReactNode, SetStateAction} from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { auth as firebaseAuthInstance, db } from "@/lib/firebase"; // Import potentially null auth
import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react"; // For error display

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
  createdAt?: Timestamp | any; 
  lastLoginAt?: Timestamp | any;
  isEmailVerified?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  setUser: Dispatch<SetStateAction<UserProfile | null>>;
  firebaseAuthInitialized: boolean; // To indicate if Firebase Auth is usable
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseAuthInitialized, setFirebaseAuthInitialized] = useState(false);

  useEffect(() => {
    if (!firebaseAuthInstance) {
      console.error("AuthContext: Firebase Auth service is not available from firebase.ts. User functionality will be disabled.");
      setLoading(false);
      setFirebaseAuthInitialized(false);
      return; // Stop here if auth service itself isn't initialized
    }
    setFirebaseAuthInitialized(true); // Mark auth as available

    const unsubscribe = onAuthStateChanged(firebaseAuthInstance, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const userRef = doc(db, "users", fbUser.uid);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const firestoreUser = docSnap.data() as Omit<UserProfile, 'uid'>;
            setUser({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: firestoreUser.displayName || fbUser.displayName,
              photoURL: fbUser.photoURL,
              ...firestoreUser,
              isEmailVerified: fbUser.emailVerified,
            });
          } else {
            console.warn(`AuthContext: User document not found in Firestore for UID: ${fbUser.uid}. Using basic auth profile.`);
            const basicProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || fbUser.email?.split('@')[0] || "New User",
              photoURL: fbUser.photoURL,
              role: "student", 
              createdAt: serverTimestamp(), 
              lastLoginAt: serverTimestamp(),
              isEmailVerified: fbUser.emailVerified,
            };
            // Optionally create a basic doc here if it's critical that it exists
            // await setDoc(userRef, basicProfile, { merge: true });
            setUser(basicProfile);
          }
        } catch (error) {
          console.error("AuthContext: Error fetching user profile from Firestore:", error);
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            isEmailVerified: fbUser.emailVerified,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Removed firebaseAuthInstance from deps, it should be stable or null

  if (loading && !firebaseAuthInitialized) { // Initial check before we know if auth is even available
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-8 w-1/3" />
        <p className="text-sm text-muted-foreground mt-2">Checking authentication service...</p>
      </div>
    );
  }
  
  if (!firebaseAuthInitialized) { // If Firebase Auth service failed to initialize in firebase.ts
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Authentication Service Error</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          The application could not connect to the authentication services. This might be due to a configuration issue. Please contact support or try again later.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          (Technical detail: Firebase Auth component failed to register. Check browser console and server logs for Firebase configuration errors.)
        </p>
      </div>
    );
  }
  
  // If auth service IS initialized, but we are still loading actual user state
  if (loading) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-8 w-1/3" />
        <p className="text-sm text-muted-foreground mt-2">Loading user session...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, firebaseAuthInitialized }}>
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
