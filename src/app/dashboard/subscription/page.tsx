
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { PageHeader } from "@/components/shared/PageHeader";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, AlertTriangle, CalendarDays, RefreshCcw, Users, Sparkles, Briefcase, Star, ShieldOff } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";

const studentFocusedPlansInitial = [ 
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
    description: "Ideal for students seeking to hire specific VAs for their tasks.",
    icon: Star,
  },
  {
    id: "ads_blocker",
    name: "Ads Blocker",
    priceMonthly: "₦200",
    priceYearly: "₦2000",
    features: [
      "Enjoy an ad-free experience across STIPS Lite.",
      "No more interruptions from advertisements.",
      "Supports the platform development.",
    ],
    isCurrent: false,
    isPopular: false,
    description: "Remove all advertisements for a cleaner browsing experience.",
    icon: ShieldOff,
  },
];


export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly"); 
  const { toast } = useToast();
  const router = useRouter(); 
  const [plans, setPlans] = useState(studentFocusedPlansInitial.map(p => ({...p}))); 
  const [isAdsBlockerActive, setIsAdsBlockerActive] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const studentVaPlanActive = localStorage.getItem('stipsLiteVaPlanActive') === 'true';
      const activeStudentPlanId = localStorage.getItem('stipsLiteActivePlanId'); 
      const activeStudentPlanCycle = localStorage.getItem('stipsLiteActivePlanCycle') as "monthly" | "yearly" | null;
      const studentAdsBlockerActive = localStorage.getItem('stipsLiteStudentAdsBlockerActive') === 'true';
      setIsAdsBlockerActive(studentAdsBlockerActive);

      setPlans(prevPlans => prevPlans.map(p => {
        let isCurrentPlan = p.id === activeStudentPlanId;
        if (studentVaPlanActive && p.id === 'expert_va') isCurrentPlan = true;
        if (studentAdsBlockerActive && p.id === 'ads_blocker') isCurrentPlan = true;
        
        return { ...p, isCurrent: isCurrentPlan, billingCycle: activeStudentPlanCycle || billingCycle };
      }));
    }
  }, [billingCycle]);


  const handleChoosePlan = (planId: string, cycle: "monthly" | "yearly") => {
    const chosenPlan = plans.find(p => p.id === planId);
    if (!chosenPlan) return;

    let toastTitle = `Processing ${chosenPlan.name} (${cycle})...`;
    let toastDescription = "Your subscription selection is being updated.";
    let redirectPath = "/dashboard"; 

    toast({ title: "Initiating Flutterwave Payment...", description: `Preparing payment for ${chosenPlan.name} (${cycle}). Please wait.` });

    setTimeout(() => {
      if (typeof window !== 'undefined') {
          if (planId === 'ads_blocker') {
            localStorage.setItem('stipsLiteStudentAdsBlockerActive', 'true');
            setIsAdsBlockerActive(true);
            toastDescription = "Ads Blocker is now active. Enjoy an ad-free experience!";
            redirectPath = `/dashboard/subscription?plan_activated=${planId}`;
          } else if (planId === 'expert_va') {
              localStorage.setItem('stipsLiteActivePlanId', planId); 
              localStorage.setItem('stipsLiteActivePlanCycle', cycle);
              localStorage.setItem('stipsLiteVaPlanActive', 'true'); 
              toastDescription = "Expert VA Plan activated. You can now search for and request specific Virtual Assistants.";
              redirectPath = `/dashboard/find-va?plan_activated=${planId}`;
          } else {
            localStorage.setItem('stipsLiteActivePlanId', planId); 
            localStorage.setItem('stipsLiteActivePlanCycle', cycle);
          }
      }
      
      setPlans(prevPlans => prevPlans.map(p => 
          p.id === planId ? { ...p, isCurrent: true, billingCycle: cycle } : { ...p, isCurrent: p.id === 'ads_blocker' ? isAdsBlockerActive : false } // Keep ads blocker active if it was
      ));

      toast({
        title: `Subscription Activated: ${chosenPlan.name} (Simulated)`,
        description: toastDescription,
        duration: 7000,
      });
      
      router.push(redirectPath);
    }, 2500); 
  };

  const currentPlan = plans.find(p => p.isCurrent && p.id !== 'ads_blocker'); // Main functional plan
  const currentAdsBlockerPlan = plans.find(p => p.id === 'ads_blocker' && isAdsBlockerActive);


  const handleFlutterwavePaymentForPlanId = (planIdToActivate: string) => {
    const planToActivate = plans.find(p => p.id === planIdToActivate);
    if (!planToActivate) {
        toast({ title: "Error", description: "Selected plan not found for payment.", variant: "destructive"});
        return;
    }

    let toastPaymentDescription = `Processing payment for ${planToActivate.name} (${billingCycle}) via Flutterwave...`;
    let redirectPath = "/dashboard"; 

    toast({ 
        title: "Flutterwave Payment Initiated (Simulated)", 
        description: toastPaymentDescription
    });
    
    setTimeout(() => {
        setPlans(prevPlans => prevPlans.map(p => 
            p.id === planIdToActivate ? { ...p, isCurrent: true, billingCycle: billingCycle } : { ...p, isCurrent: p.id === 'ads_blocker' ? isAdsBlockerActive : (p.isCurrent && p.id !== planIdToActivate ? p.isCurrent : false) }
        ));
        if (typeof window !== 'undefined') {
            if (planIdToActivate === 'ads_blocker') {
                localStorage.setItem('stipsLiteStudentAdsBlockerActive', 'true');
                setIsAdsBlockerActive(true);
                redirectPath = `/dashboard/subscription?plan_activated=${planIdToActivate}`;
            } else if (planIdToActivate === 'expert_va') {
                localStorage.setItem('stipsLiteActivePlanId', planIdToActivate);
                localStorage.setItem('stipsLiteActivePlanCycle', billingCycle);
                localStorage.setItem('stipsLiteVaPlanActive', 'true');
                redirectPath = `/dashboard/find-va?plan_activated=${planIdToActivate}`;
            } else {
                 localStorage.setItem('stipsLiteActivePlanId', planIdToActivate);
                 localStorage.setItem('stipsLiteActivePlanCycle', billingCycle);
            }
        }
        toast({
            title: `Payment Successful & Plan Activated: ${planToActivate.name} (Simulated)`,
            description: `Your ${planToActivate.name} is now active.`,
            duration: 7000,
        });
        router.push(redirectPath);
    }, 2500); 
  };

  const handleCancelSubscription = (planIdToCancel: string) => {
    if (typeof window !== 'undefined') {
      if (planIdToCancel === 'ads_blocker') {
        localStorage.removeItem('stipsLiteStudentAdsBlockerActive');
        setIsAdsBlockerActive(false);
        setPlans(prevPlans => prevPlans.map(p => p.id === 'ads_blocker' ? { ...p, isCurrent: false } : p));
        toast({ title: "Ads Blocker Cancelled (Simulated)", description: "Ads may now be displayed."});
      } else {
        localStorage.removeItem('stipsLiteVaPlanActive'); 
        localStorage.removeItem('stipsLiteActivePlanId'); 
        localStorage.removeItem('stipsLiteActivePlanCycle');
        setPlans(prevPlans => prevPlans.map(p => (p.id === planIdToCancel || p.id === 'expert_va') ? { ...p, isCurrent: false } : p));
        toast({ title: "Subscription Cancelled (Simulated)", description: "Your subscription has been cancelled. Premium features are now locked."});
      }
    }
    
  };


  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Your Subscription (Student)"
        description="Students: Activate 'Expert VA Plan' or 'Ads Blocker'. Other platform feature subscriptions may appear here."
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
              plan={{...plan, isCurrent: plan.id === 'ads_blocker' ? isAdsBlockerActive : plan.isCurrent}} // Ensure ads_blocker reflects its own state
              onChoosePlan={handleChoosePlan}
              currentBillingCycle={billingCycle}
              icon={plan.icon}
            />
          </div>
        ))}
         {plans.length === 0 && (
            <p className="text-center text-muted-foreground col-span-full py-8">No student subscription plans are currently available. Please check back later.</p>
        )}
      </div>

      {(currentPlan || currentAdsBlockerPlan) && (
        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline">Current Subscription Details</CardTitle>
            <CardDescription>Overview of your active plan(s) and billing information.</CardDescription>
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
                {currentPlan.id === "expert_va" && ( 
                  <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/find-va')}>
                      Find an Expert VA
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
                  <Button variant="destructive" size="sm" onClick={() => handleCancelSubscription('ads_blocker')}>Cancel Ads Blocker</Button>
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
                <CardTitle className="font-headline">Flutterwave Payment (Student Plans)</CardTitle>
                <CardDescription>Simulated payment section. Choose a plan by clicking its "Choose Plan" button above. That button now directly simulates the payment and activation process.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
                {plans.find(p => p.id === "expert_va") && (
                    <Button 
                        size="lg" 
                        className="bg-orange-500 hover:bg-orange-600 text-white mr-2"
                        onClick={() => handleFlutterwavePaymentForPlanId("expert_va")} 
                        disabled={plans.some(p => p.isCurrent && p.id === "expert_va")} 
                    >
                        <Sparkles className="mr-2 h-5 w-5" /> Pay for Expert VA Plan
                    </Button>
                )}
                 {plans.find(p => p.id === "ads_blocker") && (
                    <Button 
                        size="lg" 
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                        onClick={() => handleFlutterwavePaymentForPlanId("ads_blocker")} 
                        disabled={isAdsBlockerActive} 
                    >
                        <ShieldOff className="mr-2 h-5 w-5" /> Pay for Ads Blocker
                    </Button>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                    The "Choose Plan" buttons on the cards above provide the primary way to simulate plan activation.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}


    