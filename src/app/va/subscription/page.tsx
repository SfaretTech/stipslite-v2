
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { PageHeader } from "@/components/shared/PageHeader";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard"; // Re-usable component
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, AlertTriangle, CalendarDays, RefreshCcw, Briefcase, Star } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";

// VA-specific plans
const vaSubscriptionPlans = [ 
  {
    id: "va_professional_business", // Unique ID for VA plan
    name: "Professional Business VA Plan",
    priceMonthly: "₦1000", 
    priceYearly: "₦5000", // Example: 2 months free for yearly
    features: [
      "Premium Profile Listing in VA Directory (Top Placement)",
      "Access to 'Business Service Tasks' (Direct Assignments)",
      "Advanced Analytics & Reporting Dashboard (Coming Soon)",
      "Integrated Client Communication & Task Management Suite (Coming Soon)",
      "Showcase Client Testimonials & Portfolio",
      "Offer Formal Service Level Agreements (e.g., Revisions, Guarantees)",
      "Team Management Features for VA Agencies (Coming Soon)",
      "Dedicated Business Support Channel"
    ],
    isCurrent: false,
    isPopular: true, // Mark as popular for VAs
    description: "Tailored for established VA businesses and agencies seeking maximum visibility, advanced tools, and to showcase their professional services with enhanced credibility and client assurance."
  },
  // Potentially add a "VA Basic" or other VA-specific tiers in the future
];


export default function VaSubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly"); 
  const { toast } = useToast();
  const router = useRouter(); 
  const [plans, setPlans] = useState(vaSubscriptionPlans.map(p => ({...p}))); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeVaPlanId = localStorage.getItem('stipsLiteActiveVaPlanId'); // VA-specific key
      const activeVaPlanCycle = localStorage.getItem('stipsLiteActiveVaPlanCycle') as "monthly" | "yearly" | null; // VA-specific key
      
      if (activeVaPlanId) {
        setPlans(prevPlans => prevPlans.map(p => {
          return { 
            ...p, 
            isCurrent: p.id === activeVaPlanId, 
            billingCycle: activeVaPlanCycle || billingCycle 
          };
        }));
      }
    }
  }, [billingCycle]);


  const handleChoosePlan = (planId: string, cycle: "monthly" | "yearly") => {
    const chosenPlan = plans.find(p => p.id === planId);
    if (!chosenPlan) return;

    let toastTitle = `Processing ${chosenPlan.name} (${cycle})...`;
    let toastDescription = "Your VA subscription selection is being updated.";
    let redirectPath = "/va/business-tasks"; // Default redirect for VAs after subscribing

    if (typeof window !== 'undefined') {
        localStorage.setItem('stipsLiteActiveVaPlanId', planId); // VA-specific
        localStorage.setItem('stipsLiteActiveVaPlanCycle', cycle); // VA-specific

        if (planId === 'va_professional_business') {
            localStorage.setItem('stipsLiteVaProPlanActive', 'true'); // Enables Business Tasks
            toastDescription = "Your Professional Business VA Plan is active. You can now manage Business Service Tasks and enjoy premium features.";
            redirectPath = `/va/business-tasks?plan_activated=${planId}`;
        }
        // Add more else if blocks for other VA plans if they exist
    }
    
    setPlans(prevPlans => prevPlans.map(p => 
        p.id === planId ? { ...p, isCurrent: true, billingCycle: cycle } : { ...p, isCurrent: false }
    ));

    toast({
      title: toastTitle,
      description: toastDescription,
      duration: 7000,
    });
    
    setTimeout(() => {
      router.push(redirectPath);
    }, 1500); 
  };

  const currentPlan = plans.find(p => p.isCurrent);

  const handleFlutterwavePayment = (planIdToActivate: string) => {
    const planToActivate = plans.find(p => p.id === planIdToActivate);
    if (!planToActivate) {
        toast({ title: "Error", description: "Selected plan not found for payment.", variant: "destructive"});
        return;
    }

    let toastDescription = `Processing payment for ${planToActivate.name} (${billingCycle})... (simulation)`;
    let redirectPath = "/va/business-tasks"; 

    toast({ 
        title: "Flutterwave Payment Initiated (VA)", 
        description: toastDescription
    });
    
    setTimeout(() => {
        setPlans(prevPlans => prevPlans.map(p => 
            p.id === planIdToActivate ? { ...p, isCurrent: true, billingCycle: billingCycle } : { ...p, isCurrent: false }
        ));
        if (typeof window !== 'undefined') {
            localStorage.setItem('stipsLiteActiveVaPlanId', planIdToActivate); // VA-specific
            localStorage.setItem('stipsLiteActiveVaPlanCycle', billingCycle); // VA-specific
            if (planIdToActivate === 'va_professional_business') {
                localStorage.setItem('stipsLiteVaProPlanActive', 'true'); // Enables Business Tasks
                redirectPath = `/va/business-tasks?plan_activated=${planIdToActivate}`;
            }
        }
        router.push(redirectPath);
    }, 2500); 
  };

  const handleCancelSubscription = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('stipsLiteVaProPlanActive'); // Clears Business Tasks access
      localStorage.removeItem('stipsLiteActiveVaPlanId'); // VA-specific
      localStorage.removeItem('stipsLiteActiveVaPlanCycle'); // VA-specific
    }
    setPlans(prevPlans => prevPlans.map(p => ({ ...p, isCurrent: false })));
    toast({
      title: "VA Subscription Cancelled",
      description: "Your VA subscription has been cancelled (simulation). Premium VA features are now locked.",
    });
  };


  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Your VA Subscription"
        description="Subscribe to the 'Professional Business VA Plan' to list your services, access Business Service Tasks, and unlock premium features."
        icon={CreditCard}
      />

      <div className="flex justify-center mb-8">
        <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")} className="w-auto">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"> 
        {plans.map(plan => (
          <div key={plan.id} className="w-full">
            <SubscriptionCard 
              plan={plan} 
              onChoosePlan={handleChoosePlan}
              currentBillingCycle={billingCycle}
            />
          </div>
        ))}
         {plans.length === 0 && (
            <p className="text-center text-muted-foreground col-span-full py-8">No VA subscription plans are currently available. Please check back later.</p>
        )}
      </div>

      {currentPlan && (
        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline">Current VA Subscription Details</CardTitle>
            <CardDescription>Overview of your active VA plan and billing information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-md">
              <div>
                <p className="text-lg font-semibold">{currentPlan.name} ({currentPlan.billingCycle || billingCycle})</p>
                <p className="text-sm text-muted-foreground">
                  Price: {(currentPlan.billingCycle || billingCycle) === 'yearly' ? currentPlan.priceYearly : currentPlan.priceMonthly} / {(currentPlan.billingCycle || billingCycle) === 'yearly' ? 'year' : 'month'}
                </p>
              </div>
                {currentPlan.id === "va_professional_business" && (
                 <Button variant="outline" size="sm" onClick={() => router.push('/va/business-tasks')}>
                    Manage Business Tasks
                  </Button>
               )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-medium text-sm mb-1 flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary"/>Billing Cycle</h4>
                    <p className="text-muted-foreground text-sm">Next renewal on: August 15, 2024 (mock data)</p>
                </div>
                <div>
                    <h4 className="font-medium text-sm mb-1 flex items-center"><CreditCard className="h-4 w-4 mr-2 text-primary"/>Payment Method</h4>
                    <p className="text-muted-foreground text-sm">Visa **** **** **** 1234 (mock data)</p>
                    <Button variant="link" className="p-0 h-auto text-sm">Update Payment Method</Button>
                </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0"/>
                <p className="text-sm">
                    This is a UI demonstration. Payments are handled via Flutterwave integration (not implemented in this UI-only version). Subscription changes are simulated.
                </p>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-end">
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={handleCancelSubscription}>Cancel Subscription</Button>
          </CardFooter>
        </Card>
      )}

       <Card className="shadow-lg max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline">Flutterwave Payment (VA Plans)</CardTitle>
                <CardDescription>Simulated payment section for VA subscriptions. Choose a plan above and click its "Choose Plan" button to simulate payment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
                 <p className="text-muted-foreground">
                    The "Choose Plan" buttons on the VA plan cards above now simulate the subscription and payment process.
                </p>
                <Button 
                    size="lg" 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => handleFlutterwavePayment("va_professional_business")} 
                    disabled={plans.some(p => p.isCurrent && p.id === "va_professional_business")} 
                >
                    <Briefcase className="mr-2 h-5 w-5" /> Pay with Flutterwave (Professional Business VA Plan)
                </Button>
                <p className="text-xs text-muted-foreground mt-2">This button is for UI demonstration only.</p>
            </CardContent>
        </Card>
    </div>
  );
}
