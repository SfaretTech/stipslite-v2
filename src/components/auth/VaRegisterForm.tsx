
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react"; 
import { Loader2 } from "lucide-react"; 

export function VaRegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // TODO: Re-implement Firebase account creation and Firestore logic here.
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("vaFirstName") as string;
    console.log("VA Registration attempt:", { name: firstName });

    // Simulate API call
    setTimeout(() => {
        toast({
            title: "VA Registration Submitted (Simulated)",
            description: "Your VA account application is pending admin approval. You will be notified via email once approved.",
            variant: "default",
            duration: 7000, 
        });
        router.push("/va/login");
        setIsLoading(false);
    }, 1500);
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
