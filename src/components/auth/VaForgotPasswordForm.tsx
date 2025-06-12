
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function VaForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // UI-only: Simulate password reset link sending for VA
     toast({
      title: "VA Password Reset Email Sent",
      description: "If a VA account exists for this email, you will receive password reset instructions.",
    });
    router.push("/va/login");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="vaEmail">VA Account Email Address</Label>
        <Input id="vaEmail" type="email" placeholder="va.you@example.com" required />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Send Reset Link
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link href="/va/login" className="font-semibold text-primary hover:underline">
          Login to VA Portal
        </Link>
      </p>
    </form>
  );
}
