
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const ADMIN_EMAIL = "admin@sfaret";
const ADMIN_PASSWORD = "Sfaret@stipslite";

export function AdminLoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      toast({
        title: "Admin Login Successful",
        description: "Redirecting to the Admin Dashboard...",
      });
      router.push("/admin/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="admin-email">Email Address</Label>
        <Input 
          id="admin-email" 
          type="email" 
          placeholder="admin@sfaret" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="admin-password">Password</Label>
        <Input 
          id="admin-password" 
          type="password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Login to Admin Dashboard
      </Button>
       <p className="text-center text-xs text-muted-foreground mt-4">
        Not an admin? Return to <Link href="/" className="font-semibold text-accent hover:underline">Homepage</Link>.
      </p>
    </form>
  );
}
