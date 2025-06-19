
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react"; // Added useState
import { db } from "@/lib/firebase"; // Import db
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // Import Firestore functions
import { Loader2 } from "lucide-react"; // Added Loader2

export function VaRegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false); // Added isLoading state

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // UI-only: Simulate VA registration
    toast({
      title: "VA Registration Submitted",
      description: "Your VA account application is pending admin approval. You will be notified via email once approved.",
      variant: "default",
      duration: 3000, // Shortened duration as another toast will follow
    });

    // Simulate UID - In a real app, this would come from Firebase Auth userCredential.user.uid
    const simulatedUid = `VA_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("vaFirstName") as string;
    const lastName = formData.get("vaLastName") as string;
    const email = formData.get("vaEmail") as string;
    const skillsInput = formData.get("vaSkills") as string;
    const skills = skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(s => s) : [];
    const displayName = `${firstName.trim()} ${lastName.trim()}`;

    try {
      const userDocRef = doc(db, "users", simulatedUid);
      await setDoc(userDocRef, {
        uid: simulatedUid,
        email: email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: displayName,
        role: "va",
        skills: skills,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(), // Set lastLogin to now, as they are "logging in" after register
        isEmailVerified: false, // Default for new registrations
        // Add other VA-specific fields as needed
      });
      toast({
        title: "VA Registration Data Saved",
        description: "Your VA details have also been saved to our database.",
      });
      router.push("/va/login");
    } catch (firestoreError) {
      console.error("Error saving VA to Firestore:", firestoreError);
      toast({
        title: "Database Error",
        description: "Could not save VA details to the database. Please try again or contact support.",
        variant: "destructive",
      });
      setIsLoading(false); // Ensure loading is false on error before potential redirect
    }
    // No finally setIsLoading(false) here, as router.push will navigate away
    // setIsLoading(false) only on explicit error before navigation.
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vaFirstName">First Name</Label>
          <Input id="vaFirstName" name="vaFirstName" type="text" placeholder="Virtual" required disabled={isLoading}/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="vaLastName">Last Name</Label>
          <Input id="vaLastName" name="vaLastName" type="text" placeholder="Assistant" required disabled={isLoading}/>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="vaEmail">Email Address</Label>
        <Input id="vaEmail" name="vaEmail" type="email" placeholder="va.you@example.com" required disabled={isLoading}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="vaPassword">Password</Label>
        <Input id="vaPassword" name="vaPassword" type="password" required disabled={isLoading}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="vaConfirmPassword">Confirm Password</Label>
        <Input id="vaConfirmPassword" name="vaConfirmPassword" type="password" required disabled={isLoading}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="vaSkills">Key Skills (comma-separated)</Label>
        <Input id="vaSkills" name="vaSkills" type="text" placeholder="e.g., Academic Writing, Data Analysis, Python" required disabled={isLoading}/>
         <p className="text-xs text-muted-foreground">This will help us match you with suitable tasks.</p>
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox id="vaTerms" required disabled={isLoading}/>
        <Label htmlFor="vaTerms" className="text-sm font-normal">
          I agree to the STIPS Lite <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, including specific terms for Virtual Assistants.
        </Label>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Register VA Account
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have a VA account?{" "}
        <Link href="/va/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
