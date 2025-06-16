
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function PrintCenterRegisterForm() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // UI-only: Simulate Print Center registration
    toast({
      title: "Shop Registration Submitted",
      description: "Your Print Center account application is pending admin approval. You will be notified via email once approved.",
      variant: "default",
      duration: 7000,
    });
    router.push("/printcenter/login");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pc-shopName">Shop Name</Label>
        <Input id="pc-shopName" type="text" placeholder="e.g., Speedy Prints" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pc-email">Shop Email Address</Label>
        <Input id="pc-email" type="email" placeholder="contact@speedyprints.com" required />
      </div>
       <div className="space-y-2">
        <Label htmlFor="pc-address">Shop Address</Label>
        <Textarea id="pc-address" placeholder="Full shop address including street, city, state/county" required rows={3}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="pc-phone">Shop Phone Number</Label>
        <Input id="pc-phone" type="tel" placeholder="e.g., 0712345678" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pc-password">Password</Label>
        <Input id="pc-password" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pc-confirmPassword">Confirm Password</Label>
        <Input id="pc-confirmPassword" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pc-services">Key Services Offered (comma-separated)</Label>
        <Input id="pc-services" type="text" placeholder="e.g., Color Printing, Binding, Lamination" />
         <p className="text-xs text-muted-foreground">You can add more details in your shop profile later.</p>
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox id="pc-terms" required />
        <Label htmlFor="pc-terms" className="text-sm font-normal">
          I agree to the STIPS Lite <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, including specific terms for Print Centers.
        </Label>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Register My Print Center
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have a Print Center account?{" "}
        <Link href="/printcenter/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
