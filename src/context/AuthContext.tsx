
"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";
// Firebase-specific types are removed to resolve build errors.
// They can be re-introduced when Firebase is integrated correctly.

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A mock user for demonstration purposes.
const mockUser: UserProfile = {
    uid: "mock-user-123",
    email: "user@stipslite.com",
    displayName: "John Doe",
    firstName: "John",
    lastName: "Doe",
    role: "student",
    isEmailVerified: true
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect simulates an authentication check.
    const simulateAuthCheck = () => {
      setTimeout(() => {
        // To test the logged-out state, set the user to null.
        // To test the logged-in state, set it to mockUser.
        setUser(mockUser); 
        setLoading(false);
      }, 500);
    };

    simulateAuthCheck();
  }, []);
  
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
