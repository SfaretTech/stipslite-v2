
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react"; // Added useState
import { db } from "@/lib/firebase"; // Import db
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // Import Firestore functions
import { Loader2 } from "lucide-react"; // Added Loader2

export function PrintCenterRegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false); // Added isLoading state

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // UI-only: Simulate Print Center registration
    toast({
      title: "Shop Registration Submitted",
      description: "Your Print Center account application is pending admin approval. You will be notified via email once approved.",
      variant: "default",
      duration: 3000, // Shortened duration
    });

    // Simulate UID
    const simulatedUid = `PC_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const formData = new FormData(event.currentTarget);
    const shopName = formData.get("pc-shopName") as string;
    const email = formData.get("pc-email") as string;
    const address = formData.get("pc-address") as string;
    const phone = formData.get("pc-phone") as string;
    const servicesInput = formData.get("pc-services") as string;
    const services = servicesInput ? servicesInput.split(',').map(s => s.trim()).filter(s => s) : [];

    try {
      const userDocRef = doc(db, "users", simulatedUid);
      await setDoc(userDocRef, {
        uid: simulatedUid,
        email: email,
        displayName: shopName.trim(), // Using shopName as displayName for print centers
        shopName: shopName.trim(),
        address: address.trim(),
        phone: phone.trim(),
        role: "print-center",
        services: services,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isEmailVerified: false, // Default for new registrations
        // Other Print Center-specific fields can be added here or in their profile management
      });
      toast({
        title: "Print Center Data Saved",
        description: "Your Print Center details have also been saved to our database.",
      });
      router.push("/print-center/login");
    } catch (firestoreError) {
      console.error("Error saving Print Center to Firestore:", firestoreError);
      toast({
        title: "Database Error",
        description: "Could not save Print Center details to the database. Please try again or contact support.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pc-shopName">Shop Name</Label>
        <Input id="pc-shopName" name="pc-shopName" type="text" placeholder="e.g., Speedy Prints" required disabled={isLoading}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pc-email">Shop Email Address</Label>
        <Input id="pc-email" name="pc-email" type="email" placeholder="contact@speedyprints.com" required disabled={isLoading}/>
      </div>
       <div className="space-y-2">
        <Label htmlFor="pc-address">Shop Address</Label>
        <Textarea id="pc-address" name="pc-address" placeholder="Full shop address including street, city, state/county" required rows={3} disabled={isLoading}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pc-phone">Shop Phone Number</Label>
        <Input id="pc-phone" name="pc-phone" type="tel" placeholder="e.g., 0712345678" required disabled={isLoading}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pc-password">Password</Label>
        <Input id="pc-password" name="pc-password" type="password" required disabled={isLoading}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pc-confirmPassword">Confirm Password</Label>
        <Input id="pc-confirmPassword" name="pc-confirmPassword" type="password" required disabled={isLoading}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pc-services">Key Services Offered (comma-separated)</Label>
        <Input id="pc-services" name="pc-services" type="text" placeholder="e.g., Color Printing, Binding, Lamination" disabled={isLoading}/>
         <p className="text-xs text-muted-foreground">You can add more details in your shop profile later.</p>
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox id="pc-terms" required disabled={isLoading}/>
        <Label htmlFor="pc-terms" className="text-sm font-normal">
          I agree to the STIPS Lite <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, including specific terms for Print Centers.
        </Label>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Register My Print Center
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have a Print Center account?{" "}
        <Link href="/print-center/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
