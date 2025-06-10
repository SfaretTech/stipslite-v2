"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, AlertTriangle, CalendarDays, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const plans = [
  { 
    id: "basic", 
    name: "Basic", 
    priceMonthly: "$9.99", 
    priceYearly: "$99.99", 
    features: ["Up to 10 task submissions/month", "Standard print center search", "Basic referral rewards", "Email support"],
    isCurrent: false,
  },
  { 
    id: "pro", 
    name: "Pro", 
    priceMonthly: "$19.99", 
    priceYearly: "$199.99",
    features: ["Unlimited task submissions", "Advanced print center filters", "Enhanced referral rewards", "AI-powered search tool", "Priority email & chat support"],
    isCurrent: true, // Mock current plan
    isPopular: true,
  },
  { 
    id: "premium", 
    name: "Premium", 
    priceMonthly: "$29.99", 
    priceYearly: "$299.99",
    features: ["All Pro features", "Dedicated account manager", "Early access to new features", "Custom task workflows (soon)"],
    isCurrent: false,
  },
];


export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { toast } = useToast();

  const handleChoosePlan = (planId: string, cycle: "monthly" | "yearly") => {
    // UI-only: Simulate choosing a plan
    const chosenPlan = plans.find(p => p.id === planId);
    toast({
      title: `Switched to ${chosenPlan?.name} (${cycle})!`,
      description: "Your subscription has been updated. This is a mock action.",
    });
    // In a real app, update user's subscription status
    plans.forEach(p => p.isCurrent = p.id === planId); // Update mock current plan for demo
  };

  const currentPlan = plans.find(p => p.isCurrent);

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Your Subscription"
        description="Choose the plan that best suits your needs or manage your current subscription."
        icon={CreditCard}
      />

      <div className="flex justify-center mb-8">
        <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")} className="w-auto">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly (Save ~16%)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {plans.map(plan => (
          <SubscriptionCard 
            key={plan.id} 
            plan={plan} 
            onChoosePlan={handleChoosePlan}
            currentBillingCycle={billingCycle}
          />
        ))}
      </div>

      {currentPlan && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Current Subscription Details</CardTitle>
            <CardDescription>Overview of your active plan and billing information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-md">
              <div>
                <p className="text-lg font-semibold">{currentPlan.name} Plan ({billingCycle})</p>
                <p className="text-sm text-muted-foreground">
                  Price: {billingCycle === 'yearly' ? currentPlan.priceYearly : currentPlan.priceMonthly} / {billingCycle}
                </p>
              </div>
              <Button variant="outline" size="sm">Change Plan</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-medium text-sm mb-1 flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary"/>Billing Cycle</h4>
                    <p className="text-muted-foreground text-sm">Next renewal on: August 15, 2024</p>
                </div>
                <div>
                    <h4 className="font-medium text-sm mb-1 flex items-center"><CreditCard className="h-4 w-4 mr-2 text-primary"/>Payment Method</h4>
                    <p className="text-muted-foreground text-sm">Visa **** **** **** 1234</p>
                    <Button variant="link" className="p-0 h-auto text-sm">Update Payment Method</Button>
                </div>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0"/>
                <p className="text-sm">
                    This is a UI demonstration. Payments are handled via Flutterwave integration (not implemented in this UI-only version).
                </p>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-end">
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">Cancel Subscription</Button>
          </CardFooter>
        </Card>
      )}
       <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline">Flutterwave Payment</CardTitle>
                <CardDescription>Simulated payment section. In a real app, this would integrate Flutterwave.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
                <p className="text-muted-foreground">Click the button below to simulate initiating a payment with Flutterwave.</p>
                <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => toast({ title: "Flutterwave Payment Initiated", description: "Redirecting to Flutterwave... (simulation)"})}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 108 29" role="img"><path fill="currentColor" d="M22.68 28.46H16.9L13.14 17.9H7.38V28.46H1.6V.5h11.1c2.58 0 4.8.36 6.66 1.08 1.92.72 3.42 1.86 4.5 3.42.96 1.5.96 3.3.96 5.46V10.5c0 2.76-.6 4.92-1.86 6.42-1.2.ಾಗ1.5-2.88 2.46-5.04 2.88l7.56 8.64h-.36ZM7.38 13.02h5.22c1.98 0 3.42-.36 4.32-1.02.9-.72 1.32-1.86 1.32-3.42V6.42c0-1.38-.42-2.46-1.26-3.18-.78-.72-2.1-.96-3.9-.96H7.38v10.74Zm18.9 15.44h10.62V.5H26.28v27.96Zm14.16 0h10.62V.5H40.44v27.96Zm27.42-13.8L58.26 28.46h-6.3L60.36.5h5.82l-3.78 13.8 3.78 14.16h5.58L76.02.5h5.82l-8.4 27.96h-6.06l4.02-13.74Zm14.46 13.8h5.76V.5h-5.76v27.96Zm14.76 0h5.76V.5h-5.76v27.96Z"></path></svg>
                    Pay with Flutterwave
                </Button>
                <p className="text-xs text-muted-foreground">This button is for UI demonstration only.</p>
            </CardContent>
        </Card>
    </div>
  );
}
