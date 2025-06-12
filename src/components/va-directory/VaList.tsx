
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Briefcase, Award, CheckCircle, Sparkles, UserCheck } from "lucide-react"; // Added UserCheck
import Link from "next/link"; // Added Link
import { useToast } from "@/hooks/use-toast"; // Added useToast
import { cn } from "@/lib/utils"; // Added import for cn

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
  shopName?: string; // Added shopName
  businessName?: string; // Added businessName
}

interface VaListProps {
  virtualAssistants: VirtualAssistant[];
}

export function VaList({ virtualAssistants }: VaListProps) {
  const { toast } = useToast();

  const handleRequestVa = (vaName: string) => {
    toast({
      title: "VA Request Sent (Simulated)",
      description: `Your request to work with ${vaName} has been sent. They will be notified to review and accept your task.`,
      duration: 5000,
    });
    // In a real app, this would trigger a backend notification to the VA
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
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={va.avatarUrl} alt={va.name} data-ai-hint="person avatar professional" />
                <AvatarFallback>{va.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
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
                        "text-xs",
                        va.availability === 'Available' ? 'bg-green-100 text-green-700' :
                        va.availability === 'Busy' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    )}
                >
                    {va.availability}
                </Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t space-x-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              {/* In a real app, this could link to a full VA profile page: /dashboard/va-profile/${va.id} */}
              <Link href="#">View Profile</Link>
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
