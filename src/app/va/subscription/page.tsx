
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { PageHeader } from "@/components/shared/PageHeader";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, AlertTriangle, CalendarDays, RefreshCcw, Briefcase, Star, ShieldOff } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";

const vaSubscriptionPlansInitial = [ 
  {
    id: "va_professional_business", 
    name: "Professional Business VA Plan",
    priceMonthly: "₦1000", 
    priceYearly: "₦5000", 
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
    isPopular: true, 
    description: "Tailored for established VA businesses and agencies seeking maximum visibility, advanced tools, and to showcase their professional services with enhanced credibility and client assurance.",
    icon: Briefcase,
  },
  {
    id: "ads_blocker_va", // Unique ID for VA ads blocker
    name: "Ads Blocker (VA)",
    priceMonthly: "₦200",
    priceYearly: "₦2000",
    features: [
      "Enjoy an ad-free experience across STIPS Lite.",
      "No more interruptions from advertisements while you work.",
      "Supports the platform development.",
    ],
    isCurrent: false,
    isPopular: false,
    description: "Remove all advertisements for a cleaner browsing and working experience.",
    icon: ShieldOff,
  },
];


export default function VaSubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly"); 
  const { toast } = useToast();
  const router = useRouter(); 
  const [plans, setPlans] = useState(vaSubscriptionPlansInitial.map(p => ({...p}))); 
  const [isAdsBlockerActive, setIsAdsBlockerActive] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeVaPlanId = localStorage.getItem('stipsLiteActiveVaPlanId'); 
      const activeVaPlanCycle = localStorage.getItem('stipsLiteActiveVaPlanCycle') as "monthly" | "yearly" | null; 
      const vaAdsBlockerActive = localStorage.getItem('stipsLiteVaAdsBlockerActive') === 'true';
      setIsAdsBlockerActive(vaAdsBlockerActive);
      
      setPlans(prevPlans => prevPlans.map(p => {
        let isCurrentPlan = p.id === activeVaPlanId;
        if (vaAdsBlockerActive && p.id === 'ads_blocker_va') isCurrentPlan = true;

        return { 
          ...p, 
          isCurrent: isCurrentPlan, 
          billingCycle: activeVaPlanCycle || billingCycle 
        };
      }));
    }
  }, [billingCycle]);


  const handleChoosePlan = (planId: string, cycle: "monthly" | "yearly") => {
    const chosenPlan = plans.find(p => p.id === planId);
    if (!chosenPlan) return;

    let toastTitle = `Processing ${chosenPlan.name} (${cycle})...`;
    let toastDescription = "Your VA subscription selection is being updated.";
    let redirectPath = "/va/dashboard"; 

    toast({ title: "Initiating Flutterwave Payment...", description: `Preparing payment for ${chosenPlan.name} (${cycle}). Please wait.` });

    setTimeout(() => {
      if (typeof window !== 'undefined') {
          if (planId === 'ads_blocker_va') {
            localStorage.setItem('stipsLiteVaAdsBlockerActive', 'true');
            setIsAdsBlockerActive(true);
            toastDescription = "Ads Blocker for VAs is now active. Enjoy an ad-free experience!";
            redirectPath = `/va/subscription?plan_activated=${planId}`;
          } else if (planId === 'va_professional_business') {
              localStorage.setItem('stipsLiteActiveVaPlanId', planId); 
              localStorage.setItem('stipsLiteActiveVaPlanCycle', cycle); 
              localStorage.setItem('stipsLiteVaProPlanActive', 'true'); 
              toastDescription = "Your Professional Business VA Plan is active. You can now manage Business Service Tasks and enjoy premium features.";
              redirectPath = `/va/business-tasks?plan_activated=${planId}`;
          } else {
              localStorage.setItem('stipsLiteActiveVaPlanId', planId); 
              localStorage.setItem('stipsLiteActiveVaPlanCycle', cycle); 
          }
      }
      
      setPlans(prevPlans => prevPlans.map(p => 
          p.id === planId ? { ...p, isCurrent: true, billingCycle: cycle } : { ...p, isCurrent: p.id === 'ads_blocker_va' ? isAdsBlockerActive : false }
      ));

      toast({
        title: `Subscription Activated: ${chosenPlan.name} (Simulated)`,
        description: toastDescription,
        duration: 7000,
      });
      
      router.push(redirectPath);
    }, 2500); 
  };

  const currentPlan = plans.find(p => p.isCurrent && p.id !== 'ads_blocker_va');
  const currentAdsBlockerPlan = plans.find(p => p.id === 'ads_blocker_va' && isAdsBlockerActive);


  const handleFlutterwavePaymentForPlanId = (planIdToActivate: string) => { 
    const planToActivate = plans.find(p => p.id === planIdToActivate);
    if (!planToActivate) {
        toast({ title: "Error", description: "Selected plan not found for payment.", variant: "destructive"});
        return;
    }

    let toastPaymentDescription = `Processing payment for ${planToActivate.name} (${billingCycle}) via Flutterwave...`;
    let redirectPath = "/va/dashboard"; 

    toast({ 
        title: "Flutterwave Payment Initiated (VA - Simulated)", 
        description: toastPaymentDescription
    });
    
    setTimeout(() => {
        setPlans(prevPlans => prevPlans.map(p => 
            p.id === planIdToActivate ? { ...p, isCurrent: true, billingCycle: billingCycle } : { ...p, isCurrent: p.id === 'ads_blocker_va' ? isAdsBlockerActive : (p.isCurrent && p.id !== planIdToActivate ? p.isCurrent : false) }
        ));
        if (typeof window !== 'undefined') {
            if (planIdToActivate === 'ads_blocker_va') {
                localStorage.setItem('stipsLiteVaAdsBlockerActive', 'true');
                setIsAdsBlockerActive(true);
                redirectPath = `/va/subscription?plan_activated=${planIdToActivate}`;
            } else if (planIdToActivate === 'va_professional_business') {
                localStorage.setItem('stipsLiteActiveVaPlanId', planIdToActivate); 
                localStorage.setItem('stipsLiteActiveVaPlanCycle', billingCycle); 
                localStorage.setItem('stipsLiteVaProPlanActive', 'true'); 
                redirectPath = `/va/business-tasks?plan_activated=${planIdToActivate}`;
            } else {
                localStorage.setItem('stipsLiteActiveVaPlanId', planIdToActivate); 
                localStorage.setItem('stipsLiteActiveVaPlanCycle', billingCycle); 
            }
        }
         toast({
            title: `Payment Successful & Plan Activated: ${planToActivate.name} (Simulated)`,
            description: `Your ${planToActivate.name} for VAs is now active.`,
            duration: 7000,
        });
        router.push(redirectPath);
    }, 2500); 
  };

  const handleCancelSubscription = (planIdToCancel: string) => {
    if (typeof window !== 'undefined') {
      if (planIdToCancel === 'ads_blocker_va') {
        localStorage.removeItem('stipsLiteVaAdsBlockerActive');
        setIsAdsBlockerActive(false);
        setPlans(prevPlans => prevPlans.map(p => p.id === 'ads_blocker_va' ? { ...p, isCurrent: false } : p));
        toast({ title: "Ads Blocker (VA) Cancelled", description: "Ads may now be displayed."});
      } else {
        localStorage.removeItem('stipsLiteVaProPlanActive'); 
        localStorage.removeItem('stipsLiteActiveVaPlanId'); 
        localStorage.removeItem('stipsLiteActiveVaPlanCycle'); 
        setPlans(prevPlans => prevPlans.map(p => (p.id === planIdToCancel || p.id === 'va_professional_business') ? { ...p, isCurrent: false } : p));
        toast({ title: "VA Subscription Cancelled (Simulated)", description: "Your VA subscription has been cancelled. Premium VA features are now locked."});
      }
    }
  };


  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Your VA Subscription"
        description="Subscribe to the 'Professional Business VA Plan' or 'Ads Blocker' to enhance your experience and unlock features."
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
              plan={{...plan, isCurrent: plan.id === 'ads_blocker_va' ? isAdsBlockerActive : plan.isCurrent}}
              onChoosePlan={handleChoosePlan}
              currentBillingCycle={billingCycle}
              icon={plan.icon}
            />
          </div>
        ))}
         {plans.length === 0 && (
            <p className="text-center text-muted-foreground col-span-full py-8">No VA subscription plans are currently available. Please check back later.</p>
        )}
      </div>

      {(currentPlan || currentAdsBlockerPlan) && (
        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline">Current VA Subscription Details</CardTitle>
            <CardDescription>Overview of your active VA plan(s) and billing information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {currentPlan && (
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-md mb-3">
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
            )}
             {currentAdsBlockerPlan && (
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-md">
                <div>
                  <p className="text-lg font-semibold">{currentAdsBlockerPlan.name} ({currentAdsBlockerPlan.billingCycle || billingCycle})</p>
                  <p className="text-sm text-muted-foreground">
                    Status: Active
                  </p>
                </div>
                  <Button variant="destructive" size="sm" onClick={() => handleCancelSubscription('ads_blocker_va')}>Cancel Ads Blocker</Button>
              </div>
            )}
            
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
                    This is a UI demonstration. Actual payments would be handled via Flutterwave. Subscription changes are simulated.
                </p>
            </div>
          </CardContent>
          {currentPlan && (
            <CardFooter className="border-t pt-4 flex justify-end">
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={() => handleCancelSubscription(currentPlan.id)}>Cancel {currentPlan.name}</Button>
            </CardFooter>
          )}
        </Card>
      )}

       <Card className="shadow-lg max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline">Flutterwave Payment (VA Plans)</CardTitle>
                <CardDescription>Simulated payment section for VA subscriptions. Choose a plan by clicking its "Choose Plan" button above.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
                {plans.find(p => p.id === "va_professional_business") && (
                    <Button 
                        size="lg" 
                        className="bg-purple-600 hover:bg-purple-700 text-white mr-2"
                        onClick={() => handleFlutterwavePaymentForPlanId("va_professional_business")} 
                        disabled={plans.some(p => p.isCurrent && p.id === "va_professional_business")} 
                    >
                        <Briefcase className="mr-2 h-5 w-5" /> Pay for Professional Business VA Plan
                    </Button>
                )}
                 {plans.find(p => p.id === "ads_blocker_va") && (
                    <Button 
                        size="lg" 
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                        onClick={() => handleFlutterwavePaymentForPlanId("ads_blocker_va")} 
                        disabled={isAdsBlockerActive} 
                    >
                        <ShieldOff className="mr-2 h-5 w-5" /> Pay for Ads Blocker (VA)
                    </Button>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                    The "Choose Plan" buttons on the VA plan cards above provide the primary way to simulate plan activation.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}


    