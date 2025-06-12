
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Briefcase, Award, CheckCircle, Sparkles, UserCheck, ShieldCheck } from "lucide-react"; // Added ShieldCheck
import { useRouter } from "next/navigation"; 
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface VirtualAssistant {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  tagline: string;
  skills: string[];
  specializations: string[];
  availability: 'Available' | 'Busy' | 'Unavailable';
  hourlyRate?: string;
  shopName?: string;
  businessName?: string;
  planType?: "Professional Business VA"; // Added planType
}

interface VaListProps {
  virtualAssistants: VirtualAssistant[];
}

export function VaList({ virtualAssistants }: VaListProps) {
  const { toast } = useToast();
  const router = useRouter(); 

  const handleRequestVa = (vaName: string) => {
    toast({
      title: "VA Request Sent (Simulated)",
      description: `Your request to work with ${vaName} has been sent. They will be notified to review and accept your task.`,
      duration: 5000,
    });
  };

  const handleViewProfile = (va: VirtualAssistant) => {
    // Toast no longer needed here as navigation will happen directly.
    // toast({
    //   title: "Navigating to Profile",
    //   description: `Viewing ${va.name}'s profile...`,
    //   duration: 1500, 
    // });
    router.push(`/dashboard/va-profile/${va.id}`);
  };

  if (virtualAssistants.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No Virtual Assistants Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {virtualAssistants.map(va => (
        <Card key={va.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4"> {/* Changed to items-start for plan badge alignment */}
              <Avatar className="h-16 w-16 border-2 border-primary shrink-0">
                <AvatarImage src={va.avatarUrl} alt={va.name} data-ai-hint="person avatar professional" />
                <AvatarFallback>{va.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <CardTitle className="font-headline text-xl">{va.name}</CardTitle>
                { (va.shopName || va.businessName) && 
                    <CardDescription className="text-xs">
                        {va.shopName && <span>Shop: {va.shopName}</span>}
                        {va.shopName && va.businessName && <span className="mx-1">|</span>}
                        {va.businessName && <span>Business: {va.businessName}</span>}
                    </CardDescription>
                }
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(va.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-1 text-xs text-muted-foreground">({va.rating.toFixed(1)})</span>
                </div>
                 {va.planType === "Professional Business VA" && (
                  <Badge variant="default" className="mt-1.5 text-xs bg-primary/80 hover:bg-primary/70">
                    <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Professional Business VA
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm flex-grow">
            <p className="text-muted-foreground italic">"{va.tagline}"</p>
            
            {va.hourlyRate && (
              <p><span className="font-semibold">Rate:</span> {va.hourlyRate}</p>
            )}
            
            <div>
              <h4 className="font-medium mb-1 text-primary/90 flex items-center"><Sparkles className="h-4 w-4 mr-1.5"/>Skills:</h4>
              <div className="flex flex-wrap gap-1.5">
                {va.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                ))}
              </div>
            </div>
             <div>
              <h4 className="font-medium mb-1 text-primary/90 flex items-center"><Award className="h-4 w-4 mr-1.5"/>Specializations:</h4>
              <div className="flex flex-wrap gap-1.5">
                {va.specializations.map(spec => (
                  <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
                ))}
              </div>
            </div>
            <div>
                <Badge 
                    className={cn(
                        "text-xs py-1", // Added py-1 for consistent height
                        va.availability === 'Available' ? 'bg-green-100 text-green-700 border border-green-300' :
                        va.availability === 'Busy' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                        'bg-red-100 text-red-700 border border-red-300'
                    )}
                    variant="outline" // Use outline and control bg/text directly
                >
                    {va.availability}
                </Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => handleViewProfile(va)}
            >
              View Profile
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => handleRequestVa(va.name)}
              disabled={va.availability !== 'Available'}
            >
              <UserCheck className="mr-2 h-4 w-4" /> Request VA
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
