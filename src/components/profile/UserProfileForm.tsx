"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadCloud, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UserProfileForm() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // UI-only: Simulate profile update
    toast({
      title: "Profile Updated!",
      description: "Your personal details have been saved successfully.",
    });
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Manage Your Profile</CardTitle>
        <CardDescription>Keep your personal information and passport details up to date.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2">
              <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person avatar" />
              <AvatarFallback>SL</AvatarFallback>
            </Avatar>
            <div className="flex-grow space-y-1.5">
              <Label htmlFor="avatarUpload">Change Profile Picture</Label>
              <Input id="avatarUpload" type="file" accept="image/*" />
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline text-primary/90 border-b pb-2">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="Student" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Lite" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address (Cannot be changed)</Label>
              <Input id="email" type="email" defaultValue="student@example.com" readOnly disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" type="tel" placeholder="e.g., +254 712 345678" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bio">Short Bio (Optional)</Label>
              <Textarea id="bio" placeholder="Tell us a little about yourself..." rows={3} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-headline text-primary/90 border-b pb-2">Passport Information (Optional)</h3>
             <p className="text-sm text-muted-foreground">
              This information may be required for certain services or identity verification.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="passportNumber">Passport Number</Label>
              <Input id="passportNumber" placeholder="Enter your passport number" />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="passportUpload">Upload Passport Copy</Label>
                <div className="flex items-center justify-center w-full">
                    <Label 
                      htmlFor="passport-file" 
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-1 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PDF, JPG, PNG (MAX. 5MB)</p>
                        </div>
                        <Input id="passport-file" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    </Label>
                </div> 
              </div>
          </div>

        </CardContent>
        <CardFooter className="pt-6 border-t">
          <Button type="submit" size="lg" className="ml-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
