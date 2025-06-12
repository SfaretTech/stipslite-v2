
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { PageHeader } from "@/components/shared/PageHeader";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, AlertTriangle, CalendarDays, RefreshCcw, Users, Sparkles, Briefcase, Star } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";

const initialPlans = [ 
  {
    id: "expert_va", 
    name: "Expert VA Plan", 
    priceMonthly: "₦500", 
    priceYearly: "₦2000",
    features: [
      "Request specific Virtual Assistants by name", 
      "Priority in random VA assignment pool", 
      "Direct messaging with assigned VA (coming soon)",
      "All standard platform features"
    ],
    isCurrent: false, 
    isPopular: true, 
    description: "Ideal for students seeking to hire specific VAs for their tasks."
  },
  {
    id: "business_org_va",
    name: "Professional Business VA Plan",
    priceMonthly: "₦1000", 
    priceYearly: "₦5000",
    features: [
      "Premium Profile Listing in VA Directory (Top Placement)",
      "Advanced Analytics & Reporting Dashboard",
      "Integrated Client Communication & Task Management Suite (Coming Soon)",
      "Showcase Client Testimonials & Portfolio",
      "Offer Formal Service Level Agreements (e.g., Revisions, Guarantees)",
      "Team Management Features for VA Agencies (Coming Soon)",
      "Dedicated Business Support Channel"
    ],
    isCurrent: false,
    isPopular: false,
    description: "Tailored for established VA businesses and agencies seeking maximum visibility, advanced tools, and to showcase their professional services with enhanced credibility and client assurance."
  },
];


export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly"); 
  const { toast } = useToast();
  const router = useRouter(); 
  const [plans, setPlans] = useState(initialPlans.map(p => ({...p}))); 

  // Effect to check localStorage for current plan status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activePlanId = localStorage.getItem('stipsLiteActivePlanId');
      const activePlanCycle = localStorage.getItem('stipsLiteActivePlanCycle') as "monthly" | "yearly" | null;
      if (activePlanId) {
        setPlans(prevPlans => prevPlans.map(p => 
          p.id === activePlanId ? { ...p, isCurrent: true, billingCycle: activePlanCycle || billingCycle } : { ...p, isCurrent: false }
        ));
      }
    }
  }, [billingCycle]);


  const handleChoosePlan = (planId: string, cycle: "monthly" | "yearly") => {
    const chosenPlan = plans.find(p => p.id === planId);
    if (!chosenPlan) return;

    setPlans(prevPlans => prevPlans.map(p => 
        p.id === planId ? { ...p, isCurrent: true, billingCycle: cycle } : { ...p, isCurrent: false }
    ));
    
    if (typeof window !== 'undefined') {
        localStorage.setItem('stipsLiteVaPlanActive', 'true'); // For sidebar unlock
        localStorage.setItem('stipsLiteActivePlanId', planId);
        localStorage.setItem('stipsLiteActivePlanCycle', cycle);
    }

    toast({
      title: `Processing ${chosenPlan.name} (${cycle})...`,
      description: "Your subscription selection is being updated.",
    });
    
    setTimeout(() => {
      router.push(`/dashboard/find-va?plan_activated=${planId}`);
    }, 1500); 
  };

  const currentPlan = plans.find(p => p.isCurrent);

  const handleFlutterwavePayment = (planIdToActivate: string) => {
    const planToActivate = plans.find(p => p.id === planIdToActivate);
    if (!planToActivate) {
        toast({ title: "Error", description: "Selected plan not found for payment.", variant: "destructive"});
        return;
    }

    toast({ 
        title: "Flutterwave Payment Initiated", 
        description: `Processing payment for ${planToActivate.name} (${billingCycle})... (simulation)`
    });
    
    setTimeout(() => {
        setPlans(prevPlans => prevPlans.map(p => 
            p.id === planIdToActivate ? { ...p, isCurrent: true, billingCycle: billingCycle } : { ...p, isCurrent: false }
        ));
        if (typeof window !== 'undefined') {
            localStorage.setItem('stipsLiteVaPlanActive', 'true'); // For sidebar unlock
            localStorage.setItem('stipsLiteActivePlanId', planIdToActivate);
            localStorage.setItem('stipsLiteActivePlanCycle', billingCycle);
        }
        router.push(`/dashboard/find-va?plan_activated=${planIdToActivate}`);
    }, 2500); 
  };

  const handleCancelSubscription = () => {
    // Simulate canceling subscription
    if (typeof window !== 'undefined') {
      localStorage.removeItem('stipsLiteVaPlanActive');
      localStorage.removeItem('stipsLiteActivePlanId');
      localStorage.removeItem('stipsLiteActivePlanCycle');
    }
    setPlans(prevPlans => prevPlans.map(p => ({ ...p, isCurrent: false })));
    toast({
      title: "Subscription Cancelled",
      description: "Your subscription has been cancelled (simulation).",
    });
    // Optionally, navigate away or refresh to reflect changes in sidebar
    // router.push('/dashboard/subscription'); or router.refresh();
  };


  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Your Subscription"
        description="Students: Activate the 'Expert VA Plan' to find specific VAs. VA Businesses: Subscribe to the 'Professional Business VA Plan' to list your services."
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
      </div>

      {currentPlan && (
        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline">Current Subscription Details</CardTitle>
            <CardDescription>Overview of your active plan and billing information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-md">
              <div>
                <p className="text-lg font-semibold">{currentPlan.name} ({currentPlan.billingCycle || billingCycle})</p>
                <p className="text-sm text-muted-foreground">
                  Price: {(currentPlan.billingCycle || billingCycle) === 'yearly' ? currentPlan.priceYearly : currentPlan.priceMonthly} / {(currentPlan.billingCycle || billingCycle) === 'yearly' ? 'year' : 'month'}
                </p>
              </div>
               {currentPlan.id === "expert_va" && ( 
                 <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/find-va')}>
                    Find an Expert VA
                  </Button>
               )}
                {currentPlan.id === "business_org_va" && (
                 <Button variant="outline" size="sm" /*onClick={() => router.push('/dashboard/manage-va-profile')}*/>
                    Manage VA Profile
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
                <CardTitle className="font-headline">Flutterwave Payment</CardTitle>
                <CardDescription>Simulated payment section. In a real app, this would integrate Flutterwave. Choose a plan above and click its "Choose Plan" button to simulate payment for that plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
                 <p className="text-muted-foreground">
                    The "Choose Plan" buttons on the cards above now simulate the subscription and payment process for the respective plan.
                    If you were to have a direct payment button for a specific default plan (e.g. the "Expert VA Plan"), it would look like this:
                </p>
                <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => handleFlutterwavePayment("expert_va")} 
                    disabled={plans.some(p => p.isCurrent && p.id === "expert_va")} 
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 108 29" role="img"><path fill="currentColor" d="M22.68 28.46H16.9L13.14 17.9H7.38V28.46H1.6V.5h11.1c2.58 0 4.8.36 6.66 1.08 1.92.72 3.42 1.86 4.5 3.42.96 1.5.96 3.3.96 5.46V10.5c0 2.76-.6 4.92-1.86 6.42-1.2.ಾಗ1.5-2.88 2.46-5.04 2.88l7.56 8.64h-.36ZM7.38 13.02h5.22c1.98 0 3.42-.36 4.32-1.02.9-.72 1.32-1.86 1.32-3.42V6.42c0-1.38-.42-2.46-1.26-3.18-.78-.72-2.1-.96-3.9-.96H7.38v10.74Zm18.9 15.44h10.62V.5H26.28v27.96Zm14.16 0h10.62V.5H40.44v27.96Zm27.42-13.8L58.26 28.46h-6.3L60.36.5h5.82l-3.78 13.8 3.78 14.16h5.58L76.02.5h5.82l-8.4 27.96h-6.06l4.02-13.74Zm14.46 13.8h5.76V.5h-5.76v27.96Zm14.76 0h5.76V.5h-5.76v27.96Z"></path></svg>
                    Pay with Flutterwave (Expert VA Plan)
                </Button>
                <p className="text-xs text-muted-foreground">This button is for UI demonstration only.</p>
            </CardContent>
        </Card>
    </div>
  );
}

