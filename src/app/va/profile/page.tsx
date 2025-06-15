
"use client";

import Link from "next/link"; 
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadCloud, Save, UserCircle, Briefcase, Award, CalendarCheck, DollarSign, ShieldCheck, Banknote, Power, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const mockVaProfileData = {
  name: "Aisha Bello",
  email: "aisha.va@example.com",
  avatarUrl: "https://placehold.co/100x100.png?text=AB",
  tagline: "Expert academic writer and researcher.",
  bio: "With over 5 years of experience, I provide top-notch academic support to students, ensuring quality and timely delivery. My expertise spans various citation styles and research methodologies.",
  initialSkills: ["Academic Writing", "Research", "Proofreading", "APA/MLA Formatting", "Data Analysis"],
  initialSpecializations: ["Humanities", "Social Sciences", "Literature Reviews", "Business Reports"],
  hourlyRate: "₦5000", 
  initialIsAvailableForDirectAssignment: true,
  shopName: "Aisha's Academic Pro",
  businessName: "", 
  bankName: "Zenith Bank",
  accountNumber: "1234567890",
  accountName: "Aisha Bello"
};


export default function VaProfilePage() {
  const { toast } = useToast();
  const [currentSkills, setCurrentSkills] = useState<string[]>(mockVaProfileData.initialSkills);
  const [skillInput, setSkillInput] = useState("");
  const [currentSpecs, setCurrentSpecs] = useState<string[]>(mockVaProfileData.initialSpecializations);
  const [specInput, setSpecInput] = useState("");
  const [isAvailableForDirect, setIsAvailableForDirect] = useState(mockVaProfileData.initialIsAvailableForDirectAssignment);
  const [isVaSubscribedToProPlan, setIsVaSubscribedToProPlan] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const proPlanStatus = localStorage.getItem('stipsLiteVaProPlanActive'); // Key for VA's own pro plan
      setIsVaSubscribedToProPlan(proPlanStatus === 'true');
    }
  }, []);

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
    console.log("Direct Assignment Availability:", isAvailableForDirect);
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
                    <AvatarImage src={mockVaProfileData.avatarUrl} alt={mockVaProfileData.name} data-ai-hint="person avatar professional"/>
                    <AvatarFallback>{mockVaProfileData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Input id="avatarUploadVa" type="file" className="text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vaName">Full Name</Label>
                  <Input id="vaName" defaultValue={mockVaProfileData.name} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vaEmail">Email (Cannot be changed)</Label>
                  <Input id="vaEmail" type="email" defaultValue={mockVaProfileData.email} readOnly disabled />
                </div>
                 <div className="space-y-1.5">
                  <Label htmlFor="vaShopName">Shop Name (Optional)</Label>
                  <Input id="vaShopName" defaultValue={mockVaProfileData.shopName} placeholder="e.g., Aisha's Academics" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vaBusinessName">Registered Business Name (If applicable)</Label>
                  <Input id="vaBusinessName" defaultValue={mockVaProfileData.businessName} placeholder="e.g., Okoro Tech Solutions Ltd." />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline flex items-center"><Power className="mr-2 h-5 w-5 text-primary"/> Availability for Direct Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="isAvailableForDirect" className="text-base">Accept Direct Assignments</Label>
                    <p className="text-sm text-muted-foreground">
                      If off, students cannot assign tasks directly to you (Business Service Tasks). You can still take Live Tasks.
                    </p>
                  </div>
                  <Switch 
                    id="isAvailableForDirect" 
                    checked={isAvailableForDirect}
                    onCheckedChange={setIsAvailableForDirect}
                    aria-label="Toggle direct assignment availability" 
                  />
                </div>
                 <p className="text-xs text-muted-foreground mt-2">
                    Note: This feature requires an active "Professional Business VA Plan".
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary"/> My VA Subscription</CardTitle>
              </CardHeader>
              <CardContent>
                {isVaSubscribedToProPlan ? (
                    <div>
                        <p className="text-sm font-medium">Plan: <Badge className="bg-green-100 text-green-700">Professional Business VA Plan</Badge></p>
                        <p className="text-xs text-muted-foreground mt-1">Renews on: Dec 31, 2024 (mock data)</p>
                        <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                           <Link href="/va/subscription">Manage Subscription</Link>
                        </Button>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-muted-foreground">You are not currently subscribed to the "Professional Business VA Plan". This plan unlocks Business Service Tasks and premium profile features.</p>
                        <Button asChild size="sm" className="w-full mt-3 bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Link href="/va/subscription">Upgrade to Professional Business VA</Link>
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
                        <Input id="vaTagline" defaultValue={mockVaProfileData.tagline} placeholder="e.g., Your reliable partner for academic success." />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="vaBio">Full Biography / About Me</Label>
                        <Textarea id="vaBio" defaultValue={mockVaProfileData.bio} placeholder="Describe your experience, expertise, and working style." rows={5} />
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="vaHourlyRate">Standard Hourly Rate (Optional)</Label>
                        <div className="relative">
                             <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                            <Input id="vaHourlyRate" type="text" defaultValue={mockVaProfileData.hourlyRate?.replace('₦','')} placeholder="e.g., 5000" className="pl-8"/>
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
                  <Input id="bankName" defaultValue={mockVaProfileData.bankName} placeholder="e.g., Guaranty Trust Bank" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" defaultValue={mockVaProfileData.accountNumber} placeholder="e.g., 0123456789" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="accountName">Account Name (as registered with bank)</Label>
                  <Input id="accountName" defaultValue={mockVaProfileData.accountName} placeholder="e.g., John Doe Ventures" />
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
