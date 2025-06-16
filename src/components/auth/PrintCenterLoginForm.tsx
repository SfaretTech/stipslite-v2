
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function PrintCenterLoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // UI-only: Simulate Print Center login
    toast({
      title: "Print Center Login Successful",
      description: "Redirecting to your Print Center dashboard...",
    });
    router.push("/printcenter/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="pc-email">Shop Email Address</Label>
        <Input id="pc-email" type="email" placeholder="shop@example.com" required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="pc-password">Password</Label>
          <Link href="/printcenter/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input id="pc-password" type="password" required />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="pc-remember-me" />
          <Label htmlFor="pc-remember-me" className="text-sm font-normal">Remember me</Label>
        </div>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Login to Print Center
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have a Print Center account?{" "}
        <Link href="/printcenter/signup" className="font-semibold text-primary hover:underline">
          Register Your Shop
        </Link>
      </p>
    </form>
  );
}
