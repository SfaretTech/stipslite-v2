
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { VaSearch } from "@/components/va-directory/VaSearch";
import { VaList, type VirtualAssistant as VaListVirtualAssistant } from "@/components/va-directory/VaList";
import { Users } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation"; // Added usePathname
import { useToast } from "@/hooks/use-toast";


export interface PageVirtualAssistant extends VaListVirtualAssistant {
  planType?: "Professional Business VA";
  shopName?: string;
  businessName?: string;
}

const mockVAs: PageVirtualAssistant[] = [
  { id: "VA001", name: "Aisha Bello", avatarUrl: "https://placehold.co/100x100.png?text=AB", rating: 4.8, tagline: "Expert academic writer and researcher.", skills: ["Academic Writing", "Research", "Proofreading", "APA/MLA Formatting"], specializations: ["Humanities", "Social Sciences", "Literature Reviews"], availability: "Available", hourlyRate: "₦5000/hr", shopName: "Aisha's Academic Pro"},
  { id: "VA002", name: "Chinedu Okoro", avatarUrl: "https://placehold.co/100x100.png?text=CO", rating: 4.5, tagline: "Technical task wizard, specializing in STEM.", skills: ["Data Analysis", "Programming (Python)", "Technical Reports", "Statistical Analysis"], specializations: ["Engineering", "Computer Science", "Mathematics"], availability: "Busy", businessName: "Okoro Tech Solutions", planType: "Professional Business VA" },
  { id: "VA003", name: "Fatima Diallo", avatarUrl: "https://placehold.co/100x100.png?text=FD", rating: 4.9, tagline: "Creative presentations and business support.", skills: ["Presentation Design (PPT/Slides)", "Graphic Design (Canva)", "Market Research", "Content Creation"], specializations: ["Business Proposals", "Marketing Materials", "General Admin"], availability: "Available"},
  { id: "VA004", name: "David Adebayo", avatarUrl: "https://placehold.co/100x100.png?text=DA", rating: 4.3, tagline: "Reliable VA for diverse tasks.", skills: ["Transcription", "Data Entry", "Customer Support", "Scheduling"], specializations: ["General Academic Support", "Administrative Tasks"], availability: "Unavailable", shopName: "Dave's Gigs"},
];

export default function FindVaPage() {
  const [searchFilters, setSearchFilters] = useState<any>({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const planActivated = searchParams.get('plan_activated');
    let toastTitle = "";
    let toastDescription = "";

    if (planActivated === 'expert_va') {
      toastTitle = "Expert VA Plan Activated!";
      toastDescription = "You can now search for and request specific Virtual Assistants.";
    } else if (planActivated === 'business_org_va') {
      toastTitle = "Professional Business VA Plan Activated!";
      toastDescription = "Your business VA profile features are now active. (Further navigation/management TBD)";
    }

    if (toastTitle) {
      toast({
        title: toastTitle,
        description: toastDescription,
        variant: "default",
        duration: 5000,
      });
      // Remove the query parameter from the URL without reloading or adding to history
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, toast, pathname]);

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
  };

  const filteredVAs = useMemo(() => {
    if (Object.keys(searchFilters).length === 0 || (!searchFilters.name && !searchFilters.skills && !searchFilters.specialization)) {
      return mockVAs;
    }
    return mockVAs.filter(va => {
      const nameMatch = searchFilters.name ? va.name.toLowerCase().includes(searchFilters.name.toLowerCase()) || (va.shopName && va.shopName.toLowerCase().includes(searchFilters.name.toLowerCase())) || (va.businessName && va.businessName.toLowerCase().includes(searchFilters.name.toLowerCase())) : true;
      const skillsMatch = searchFilters.skills ? va.skills.some(skill => skill.toLowerCase().includes(searchFilters.skills.toLowerCase())) : true;
      const specializationMatch = searchFilters.specialization ? va.specializations.some(spec => spec.toLowerCase().includes(searchFilters.specialization.toLowerCase())) : true;
      return nameMatch && skillsMatch && specializationMatch;
    });
  }, [searchFilters]);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Find a Virtual Assistant (VA Plus)"
        description="Browse and search for Virtual Assistants. This feature is enhanced if you have an active VA plan. VAs with a 'Professional Business VA' plan are indicated on their profile cards."
        icon={Users}
      />
      <VaSearch onSearch={handleSearch} />
      <VaList virtualAssistants={filteredVAs} />
    </div>
  );
}
