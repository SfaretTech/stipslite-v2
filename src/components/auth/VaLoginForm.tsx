
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import { useToast } from "@/hooks/use-toast";

export function VaLoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // UI-only: Simulate VA login and redirect to VA dashboard
    toast({
      title: "VA Login Successful",
      description: "Redirecting to your VA dashboard...",
    });
    router.push("/va/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" placeholder="va.you@example.com" required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/va/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input id="password" type="password" required />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember-me-va" />
          <Label htmlFor="remember-me-va" className="text-sm font-normal">Remember me</Label>
        </div>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Login to VA Portal
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have a VA account?{" "}
        <Link href="/va/register" className="font-semibold text-primary hover:underline">
          Register as VA
        </Link>
      </p>
       <p className="text-center text-xs text-muted-foreground mt-4">
        Are you a student?{" "}
        <Link href="/auth/login" className="font-semibold text-accent hover:underline">
          Login here
        </Link>
      </p>
    </form>
  );
}
