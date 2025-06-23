
"use client";

import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import type { Dispatch, ReactNode, SetStateAction} from "react";
import { createContext, useContext, useEffect, useState } from "react";
// Import the getter functions instead of direct instances
import { getAuthInstance, getDbInstance } from "@/lib/firebase"; 
import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

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
  firebaseAuthInitialized: boolean; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseAuthInitialized, setFirebaseAuthInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    // Get instances inside useEffect to ensure this runs client-side after mount
    const authService = getAuthInstance();
    const dbService = getDbInstance();

    if (!authService) {
      setInitializationError("Authentication service could not be initialized. Please check your environment variables or contact support.");
      setLoading(false);
      return;
    }
    setFirebaseAuthInitialized(true);
    
    const unsubscribe = onAuthStateChanged(authService, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        if (!dbService) {
          console.warn("AuthContext: Firestore is not available. Using basic profile for UID:", fbUser.uid);
          setUser({ 
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || "User",
            photoURL: fbUser.photoURL,
            role: "student", 
            isEmailVerified: fbUser.emailVerified,
          });
          setLoading(false);
          return;
        }

        const userRef = doc(dbService, "users", fbUser.uid);
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
            console.warn(`AuthContext: User document not found in Firestore for UID: ${fbUser.uid}. This may happen for new registrations before the document is created.`);
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
            setUser(basicProfile);
          }
        } catch (error: any) {
          console.error("AuthContext: Error fetching user profile from Firestore:", error);
           let profileFetchError = "Could not load your profile information.";
          if (error.code === 'permission-denied') {
            profileFetchError = "Failed to load profile due to permission issues. Please check Firestore rules or contact support.";
          }
          setUser({ // Fallback to basic auth user info
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            isEmailVerified: fbUser.emailVerified,
          });
           console.error("AuthContext - Profile Fetch Error:", profileFetchError);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs once on mount.

  if (initializationError) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Service Initialization Error</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          {initializationError}
        </p>
      </div>
    );
  }
  
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
