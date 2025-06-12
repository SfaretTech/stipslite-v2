
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadCloud, Save, UserCircle, Briefcase, Award, CalendarCheck, DollarSign, ShieldCheck, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const mockVaProfile = {
  name: "Aisha Bello",
  email: "aisha.va@example.com",
  avatarUrl: "https://placehold.co/100x100.png?text=AB",
  tagline: "Expert academic writer and researcher.",
  bio: "With over 5 years of experience, I provide top-notch academic support to students, ensuring quality and timely delivery. My expertise spans various citation styles and research methodologies.",
  skills: ["Academic Writing", "Research", "Proofreading", "APA/MLA Formatting", "Data Analysis"],
  specializations: ["Humanities", "Social Sciences", "Literature Reviews", "Business Reports"],
  hourlyRate: "₦5000", // Assuming NGN if not specified
  isAvailable: true,
  shopName: "Aisha's Academic Pro",
  businessName: "", // Empty if not a registered business
  planType: null, // Could be "Professional Business VA" if subscribed
  bankName: "Zenith Bank",
  accountNumber: "1234567890",
  accountName: "Aisha Bello"
};


export default function VaProfilePage() {
  const { toast } = useToast();
  const [currentSkills, setCurrentSkills] = useState<string[]>(mockVaProfile.skills);
  const [skillInput, setSkillInput] = useState("");
  const [currentSpecs, setCurrentSpecs] = useState<string[]>(mockVaProfile.specializations);
  const [specInput, setSpecInput] = useState("");

  const handleAddSkill = () => {
    if (skillInput.trim() && !currentSkills.includes(skillInput.trim())) {
      setCurrentSkills([...currentSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };
  const handleRemoveSkill = (skillToRemove: string) => {
    setCurrentSkills(currentSkills.filter(skill => skill !== skillToRemove));
  };

  const handleAddSpec = () => {
    if (specInput.trim() && !currentSpecs.includes(specInput.trim())) {
      setCurrentSpecs([...currentSpecs, specInput.trim()]);
      setSpecInput("");
    }
  };
  const handleRemoveSpec = (specToRemove: string) => {
    setCurrentSpecs(currentSpecs.filter(spec => spec !== specToRemove));
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // UI-only: Simulate profile update
    toast({
      title: "VA Profile Updated!",
      description: "Your VA profile details have been saved successfully.",
    });
  };
  
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Your VA Profile"
        description="Keep your skills, availability, and payment details up to date to attract task assignments."
        icon={UserCircle}
      />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Basic Info, Availability, Subscription */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2">
                    <AvatarImage src={mockVaProfile.avatarUrl} alt={mockVaProfile.name} data-ai-hint="person avatar professional" />
                    <AvatarFallback>{mockVaProfile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Input id="avatarUploadVa" type="file" className="text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vaName">Full Name</Label>
                  <Input id="vaName" defaultValue={mockVaProfile.name} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vaEmail">Email (Cannot be changed)</Label>
                  <Input id="vaEmail" type="email" defaultValue={mockVaProfile.email} readOnly disabled />
                </div>
                 <div className="space-y-1.5">
                  <Label htmlFor="vaShopName">Shop Name (Optional)</Label>
                  <Input id="vaShopName" defaultValue={mockVaProfile.shopName} placeholder="e.g., Aisha's Academics" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vaBusinessName">Registered Business Name (If applicable)</Label>
                  <Input id="vaBusinessName" defaultValue={mockVaProfile.businessName} placeholder="e.g., Okoro Tech Solutions Ltd." />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline flex items-center"><CalendarCheck className="mr-2 h-5 w-5 text-primary"/> Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="isAvailable" className="text-base">Currently Available for Tasks</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle this off if you are not accepting new tasks.
                    </p>
                  </div>
                  <Switch id="isAvailable" defaultChecked={mockVaProfile.isAvailable} aria-label="Toggle availability" />
                </div>
              </CardContent>
            </Card>
            
             {/* VA Subscription Status - Placeholder */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/> My Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                {mockVaProfile.planType === "Professional Business VA" ? (
                    <div>
                        <p className="text-sm font-medium">Plan: <Badge>{mockVaProfile.planType}</Badge></p>
                        <p className="text-xs text-muted-foreground mt-1">Renews on: [Date]</p>
                        <Button variant="outline" size="sm" className="w-full mt-3">Manage Subscription</Button>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-muted-foreground">You are not currently subscribed to the "Professional Business VA" plan.</p>
                        <Button asChild size="sm" className="w-full mt-3 bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Link href="/dashboard/subscription">Upgrade to Professional Business VA</Link>
                        </Button>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Profile Details, Skills, Payout Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Profile Details</CardTitle>
                    <CardDescription>Information that will be visible to students.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="vaTagline">Tagline / Short Pitch</Label>
                        <Input id="vaTagline" defaultValue={mockVaProfile.tagline} placeholder="e.g., Your reliable partner for academic success." />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="vaBio">Full Biography / About Me</Label>
                        <Textarea id="vaBio" defaultValue={mockVaProfile.bio} placeholder="Describe your experience, expertise, and working style." rows={5} />
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="vaHourlyRate">Standard Hourly Rate (Optional)</Label>
                        <div className="relative">
                             <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                            <Input id="vaHourlyRate" type="text" defaultValue={mockVaProfile.hourlyRate?.replace('₦','')} placeholder="e.g., 5000" className="pl-8"/>
                        </div>
                        <p className="text-xs text-muted-foreground">Specify your rate if you offer hourly services. Task payouts are typically per-project.</p>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Skills</CardTitle>
                  <CardDescription>List skills relevant to the tasks you can perform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-3">
                        <Input 
                            value={skillInput} 
                            onChange={(e) => setSkillInput(e.target.value)}
                            placeholder="Add a skill (e.g., SPSS, Canva)"
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill();}}}
                        />
                        <Button type="button" onClick={handleAddSkill} variant="outline">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {currentSkills.map(skill => (
                            <Badge key={skill} variant="secondary" className="py-1">
                                {skill}
                                <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-1.5 text-secondary-foreground/70 hover:text-secondary-foreground">
                                    &times;
                                </button>
                            </Badge>
                        ))}
                         {currentSkills.length === 0 && <p className="text-xs text-muted-foreground">No skills added yet.</p>}
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center"><Award className="mr-2 h-5 w-5 text-primary"/>Specializations / Areas of Expertise</CardTitle>
                  <CardDescription>Highlight your main areas of expertise.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-3">
                        <Input 
                            value={specInput} 
                            onChange={(e) => setSpecInput(e.target.value)}
                            placeholder="Add specialization (e.g., Engineering, Law)"
                             onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSpec();}}}
                        />
                        <Button type="button" onClick={handleAddSpec} variant="outline">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {currentSpecs.map(spec => (
                            <Badge key={spec} variant="outline" className="py-1">
                                {spec}
                                <button type="button" onClick={() => handleRemoveSpec(spec)} className="ml-1.5 text-muted-foreground hover:text-foreground">
                                    &times;
                                </button>
                            </Badge>
                        ))}
                        {currentSpecs.length === 0 && <p className="text-xs text-muted-foreground">No specializations added yet.</p>}
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline flex items-center"><Banknote className="mr-2 h-5 w-5 text-primary"/> Payout Information</CardTitle>
                <CardDescription>Ensure your bank details are correct for receiving payments.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" defaultValue={mockVaProfile.bankName} placeholder="e.g., Guaranty Trust Bank" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" defaultValue={mockVaProfile.accountNumber} placeholder="e.g., 0123456789" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="accountName">Account Name (as registered with bank)</Label>
                  <Input id="accountName" defaultValue={mockVaProfile.accountName} placeholder="e.g., John Doe Ventures" />
                </div>
                 <p className="text-xs text-muted-foreground pt-1">
                    Payments are processed weekly for completed and approved tasks. Ensure these details are accurate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end mt-8">
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Save className="mr-2 h-4 w-4" /> Save All VA Profile Changes
            </Button>
        </div>
      </form>
    </div>
  );
}
