
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { auth, db } from "@/lib/firebase"; // Import db
import { createUserWithEmailAndPassword, type FirebaseError, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // Import Firestore functions
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Name Required",
        description: "First and last name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const displayName = `${firstName.trim()} ${lastName.trim()}`;

      // Update Firebase Auth profile (optional, but good practice)
      await updateProfile(firebaseUser, { displayName });

      // Create user document in Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: displayName,
        role: "student", // Default role for this registration form
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isEmailVerified: firebaseUser.emailVerified,
        // Add any other initial fields, e.g., photoURL: null, phoneNumber: null
      });
      
      toast({
        title: "Registration Successful!",
        description: "Your account has been created. Please login.",
        variant: "default",
      });
      router.push("/auth/login"); 
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error("Registration error:", firebaseError);
      let errorMessage = "An unknown error occurred during registration.";
      if (firebaseError.code === "auth/email-already-in-use") {
        errorMessage = "This email address is already in use.";
      } else if (firebaseError.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (firebaseError.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            type="text" 
            placeholder="John" 
            required 
            disabled={isLoading}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            type="text" 
            placeholder="Doe" 
            required 
            disabled={isLoading}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="you@example.com" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input 
          id="confirmPassword" 
          type="password" 
          required 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox id="terms" required disabled={isLoading} />
        <Label htmlFor="terms" className="text-sm font-normal">
          I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </Label>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
