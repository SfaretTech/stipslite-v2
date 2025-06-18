
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { PageHeader } from "@/components/shared/PageHeader";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, AlertTriangle, CalendarDays, RefreshCcw, Printer, ShieldOff } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";

const printCenterSubscriptionPlansInitial = [ 
  // Add any specific Print Center plans here if needed in the future.
  // For now, only Ads Blocker.
  {
    id: "ads_blocker_pc", // Unique ID for Print Center ads blocker
    name: "Ads Blocker (Print Center)",
    priceMonthly: "₦200",
    priceYearly: "₦2000",
    features: [
      "Enjoy an ad-free experience across the STIPS Lite Print Center portal.",
      "Focus on managing your print jobs without interruptions.",
      "Supports the platform development.",
    ],
    isCurrent: false,
    isPopular: false,
    description: "Remove all advertisements from your Print Center dashboard.",
    icon: ShieldOff,
  },
];


export default function PrintCenterSubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly"); 
  const { toast } = useToast();
  const router = useRouter(); 
  const [plans, setPlans] = useState(printCenterSubscriptionPlansInitial.map(p => ({...p}))); 
  const [isAdsBlockerActive, setIsAdsBlockerActive] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pcAdsBlockerActive = localStorage.getItem('stipsLitePcAdsBlockerActive') === 'true';
      setIsAdsBlockerActive(pcAdsBlockerActive);
      
      setPlans(prevPlans => prevPlans.map(p => {
        let isCurrentPlan = false;
        if (pcAdsBlockerActive && p.id === 'ads_blocker_pc') isCurrentPlan = true;
        
        return { ...p, isCurrent: isCurrentPlan };
      }));
    }
  }, [billingCycle]);


  const handleChoosePlan = (planId: string, cycle: "monthly" | "yearly") => {
    const chosenPlan = plans.find(p => p.id === planId);
    if (!chosenPlan) return;

    let toastTitle = `Processing ${chosenPlan.name} (${cycle})...`;
    let toastDescription = "Your Print Center subscription selection is being updated.";
    let redirectPath = "/print-center/dashboard"; 

    toast({ title: "Initiating Flutterwave Payment...", description: `Preparing payment for ${chosenPlan.name} (${cycle}). Please wait.` });

    setTimeout(() => {
      if (typeof window !== 'undefined') {
          if (planId === 'ads_blocker_pc') {
            localStorage.setItem('stipsLitePcAdsBlockerActive', 'true');
            setIsAdsBlockerActive(true);
            toastDescription = "Ads Blocker for Print Centers is now active. Enjoy an ad-free experience!";
            redirectPath = `/print-center/subscription?plan_activated=${planId}`;
          }
          // Add other Print Center specific plan logic here if any
      }
      
      setPlans(prevPlans => prevPlans.map(p => 
          p.id === planId ? { ...p, isCurrent: true, billingCycle: cycle } : { ...p, isCurrent: p.id === 'ads_blocker_pc' ? isAdsBlockerActive : false }
      ));

      toast({
        title: `Subscription Activated: ${chosenPlan.name} (Simulated)`,
        description: toastDescription,
        duration: 7000,
      });
      
      router.push(redirectPath);
    }, 2500); 
  };
  
  const currentAdsBlockerPlan = plans.find(p => p.id === 'ads_blocker_pc' && isAdsBlockerActive);


  const handleFlutterwavePaymentForPlanId = (planIdToActivate: string) => { 
    const planToActivate = plans.find(p => p.id === planIdToActivate);
    if (!planToActivate) {
        toast({ title: "Error", description: "Selected plan not found for payment.", variant: "destructive"});
        return;
    }

    let toastPaymentDescription = `Processing payment for ${planToActivate.name} (${billingCycle}) via Flutterwave...`;
    let redirectPath = "/print-center/dashboard"; 

    toast({ 
        title: "Flutterwave Payment Initiated (Print Center - Simulated)", 
        description: toastPaymentDescription
    });
    
    setTimeout(() => {
        setPlans(prevPlans => prevPlans.map(p => 
            p.id === planIdToActivate ? { ...p, isCurrent: true, billingCycle: billingCycle } : { ...p, isCurrent: p.id === 'ads_blocker_pc' ? isAdsBlockerActive : (p.isCurrent && p.id !== planIdToActivate ? p.isCurrent : false) }
        ));
        if (typeof window !== 'undefined') {
            if (planIdToActivate === 'ads_blocker_pc') {
                localStorage.setItem('stipsLitePcAdsBlockerActive', 'true');
                setIsAdsBlockerActive(true);
                redirectPath = `/print-center/subscription?plan_activated=${planIdToActivate}`;
            }
             // Add other Print Center specific plan logic here
        }
         toast({
            title: `Payment Successful & Plan Activated: ${planToActivate.name} (Simulated)`,
            description: `Your ${planToActivate.name} for Print Centers is now active.`,
            duration: 7000,
        });
        router.push(redirectPath);
    }, 2500); 
  };

  const handleCancelSubscription = (planIdToCancel: string) => {
    if (typeof window !== 'undefined') {
      if (planIdToCancel === 'ads_blocker_pc') {
        localStorage.removeItem('stipsLitePcAdsBlockerActive');
        setIsAdsBlockerActive(false);
        setPlans(prevPlans => prevPlans.map(p => p.id === 'ads_blocker_pc' ? { ...p, isCurrent: false } : p));
        toast({ title: "Ads Blocker (Print Center) Cancelled", description: "Ads may now be displayed in your portal."});
      }
      // Add cancellation for other PC specific plans if any
    }
  };


  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Your Print Center Subscription"
        description="Subscribe to 'Ads Blocker' to remove advertisements from your Print Center portal."
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
              plan={{...plan, isCurrent: plan.id === 'ads_blocker_pc' ? isAdsBlockerActive : plan.isCurrent}}
              onChoosePlan={handleChoosePlan}
              currentBillingCycle={billingCycle}
              icon={plan.icon}
            />
          </div>
        ))}
         {plans.length === 0 && (
            <p className="text-center text-muted-foreground col-span-full py-8">No Print Center subscription plans are currently available. Please check back later.</p>
        )}
      </div>

      {currentAdsBlockerPlan && (
        <Card className="shadow-lg max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline">Current Print Center Subscription Details</CardTitle>
            <CardDescription>Overview of your active plan(s) and billing information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentAdsBlockerPlan && (
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-md">
                <div>
                  <p className="text-lg font-semibold">{currentAdsBlockerPlan.name} ({currentAdsBlockerPlan.billingCycle || billingCycle})</p>
                  <p className="text-sm text-muted-foreground">
                    Status: Active
                  </p>
                </div>
                  <Button variant="destructive" size="sm" onClick={() => handleCancelSubscription('ads_blocker_pc')}>Cancel Ads Blocker</Button>
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
        </Card>
      )}

       <Card className="shadow-lg max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline">Flutterwave Payment (Print Center Plans)</CardTitle>
                <CardDescription>Simulated payment section for Print Center subscriptions. Choose a plan by clicking its "Choose Plan" button above.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
                {plans.find(p => p.id === "ads_blocker_pc") && (
                    <Button 
                        size="lg" 
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                        onClick={() => handleFlutterwavePaymentForPlanId("ads_blocker_pc")} 
                        disabled={isAdsBlockerActive} 
                    >
                        <ShieldOff className="mr-2 h-5 w-5" /> Pay for Ads Blocker (Print Center)
                    </Button>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                    The "Choose Plan" buttons on the Print Center plan cards above provide the primary way to simulate plan activation.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
