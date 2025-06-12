
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Briefcase, Award, Mail, Phone, MessageSquare, CalendarDays, DollarSign, UserCircle, Sparkles, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Re-using the mock data and interface from the find-va page for consistency
// In a real app, this data would likely be fetched from a service.
const mockVAs = [
  { id: "VA001", name: "Aisha Bello", avatarUrl: "https://placehold.co/100x100.png?text=AB", rating: 4.8, tagline: "Expert academic writer and researcher.", skills: ["Academic Writing", "Research", "Proofreading", "APA/MLA Formatting"], specializations: ["Humanities", "Social Sciences", "Literature Reviews"], availability: "Available" as const, hourlyRate: "₦5000/hr", shopName: "Aisha's Academic Pro", bio: "With over 5 years of experience, I provide top-notch academic support to students, ensuring quality and timely delivery. My expertise spans various citation styles and research methodologies.", email: "aisha.bello@example.com", phone: "08012345678", joinedDate: "2023-01-15", completedTasks: 120 },
  { id: "VA002", name: "Chinedu Okoro", avatarUrl: "https://placehold.co/100x100.png?text=CO", rating: 4.5, tagline: "Technical task wizard, specializing in STEM.", skills: ["Data Analysis", "Programming (Python)", "Technical Reports", "Statistical Analysis"], specializations: ["Engineering", "Computer Science", "Mathematics"], availability: "Busy" as const, businessName: "Okoro Tech Solutions", bio: "I'm a passionate problem-solver with a strong background in STEM fields. I help students tackle complex technical assignments and data-driven projects.", email: "chinedu.okoro@example.com", phone: "08023456789", joinedDate: "2022-11-01", completedTasks: 85, planType: "Professional Business VA" as const},
  { id: "VA003", name: "Fatima Diallo", avatarUrl: "https://placehold.co/100x100.png?text=FD", rating: 4.9, tagline: "Creative presentations and business support.", skills: ["Presentation Design (PPT/Slides)", "Graphic Design (Canva)", "Market Research", "Content Creation"], specializations: ["Business Proposals", "Marketing Materials", "General Admin"], availability: "Available" as const, bio: "I bring creativity and precision to every task, helping students and professionals create compelling presentations and business documents. Let's make your project shine!", email: "fatima.diallo@example.com", phone: "08034567890", joinedDate: "2023-05-20", completedTasks: 95 },
  { id: "VA004", name: "David Adebayo", avatarUrl: "https://placehold.co/100x100.png?text=DA", rating: 4.3, tagline: "Reliable VA for diverse tasks.", skills: ["Transcription", "Data Entry", "Customer Support", "Scheduling"], specializations: ["General Academic Support", "Administrative Tasks"], availability: "Unavailable" as const, shopName: "Dave's Gigs", bio: "I provide dependable support for a wide range of administrative and general academic tasks. My focus is on efficiency and accuracy.", email: "david.adebayo@example.com", phone: "08045678901", joinedDate: "2023-03-10", completedTasks: 70 },
];

export type VirtualAssistant = typeof mockVAs[0];

export default function VaProfilePage() {
  const paramsFromHook = useParams();
  // Create a plain object to avoid potential enumeration issues with the proxy
  const params = { vaId: paramsFromHook.vaId as string };
  const router = useRouter();
  const vaId = params.vaId;

  const va = mockVAs.find(v => v.id === vaId);

  if (!va) {
    return (
      <div>
        <PageHeader 
            title="Virtual Assistant Not Found" 
            description="The profile you are looking for does not exist or could not be loaded."
            icon={UserCircle}
            actions={
                <Button variant="outline" onClick={() => router.push('/dashboard/find-va')}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to VA List
                </Button>
            }
        />
        <Card>
          <CardContent className="pt-6 text-center">
            <p>Sorry, we couldn't find details for Virtual Assistant ID: {vaId}.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title={va.name}
        description={`Virtual Assistant Profile - ${va.tagline}`}
        icon={UserCircle}
        actions={
            <Button variant="outline" onClick={() => router.push('/dashboard/find-va')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to VA List
            </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info & Contact */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 mb-4 border-4 border-primary shadow-md">
                <AvatarImage src={va.avatarUrl} alt={va.name} data-ai-hint="person avatar professional large" />
                <AvatarFallback className="text-4xl">{va.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold font-headline text-primary">{va.name}</h2>
              { (va.shopName || va.businessName) && 
                <p className="text-sm text-muted-foreground">
                    {va.shopName && <span>Shop: {va.shopName}</span>}
                    {va.shopName && va.businessName && <span className="mx-1">|</span>}
                    {va.businessName && <span>Business: {va.businessName}</span>}
                </p>
              }
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(va.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">({va.rating.toFixed(1)} rating)</span>
              </div>
              <Badge 
                className={cn(
                    "mt-3 text-sm py-1 px-3",
                    va.availability === 'Available' ? 'bg-green-100 text-green-700 border-green-300' :
                    va.availability === 'Busy' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                    'bg-red-100 text-red-700 border-red-300'
                )}
                variant="outline"
              >
                {va.availability}
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center"><Mail className="mr-2 h-5 w-5 text-primary"/>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="font-medium">Email:</span> <a href={`mailto:${va.email}`} className="text-accent hover:underline">{va.email}</a></p>
              <p><span className="font-medium">Phone:</span> {va.phone || "Not provided"}</p>
            </CardContent>
            <CardFooter>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <MessageSquare className="mr-2 h-4 w-4"/> Message {va.name.split(' ')[0]} (Coming Soon)
                </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column - Details, Skills, Specializations */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-lg">About {va.name.split(' ')[0]}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/90 whitespace-pre-wrap">
              {va.bio || "No biography provided."}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary"/>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {va.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm">{skill}</Badge>
                ))}
                {va.skills.length === 0 && <p className="text-sm text-muted-foreground">No skills listed.</p>}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center"><Award className="mr-2 h-5 w-5 text-primary"/>Specializations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {va.specializations.map(spec => (
                  <Badge key={spec} variant="outline" className="px-3 py-1 text-sm">{spec}</Badge>
                ))}
                {va.specializations.length === 0 && <p className="text-sm text-muted-foreground">No specializations listed.</p>}
              </div>
            </CardContent>
          </Card>

           <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium flex items-center"><CalendarDays className="mr-1.5 h-4 w-4 text-muted-foreground"/>Joined STIPS Lite:</p>
                <p className="text-foreground/90">{va.joinedDate ? new Date(va.joinedDate).toLocaleDateString() : "N/A"}</p>
              </div>
              <div>
                <p className="font-medium flex items-center"><CheckCircle className="mr-1.5 h-4 w-4 text-muted-foreground"/>Tasks Completed:</p>
                <p className="text-foreground/90">{va.completedTasks || 0}</p>
              </div>
              {va.hourlyRate && (
                <div>
                    <p className="font-medium flex items-center"><DollarSign className="mr-1.5 h-4 w-4 text-muted-foreground"/>Standard Rate:</p>
                    <p className="text-foreground/90">{va.hourlyRate}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
