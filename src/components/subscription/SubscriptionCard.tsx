
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Zap, Briefcase } from "lucide-react"; 
import { cn } from "@/lib/utils";

interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: string;
  priceYearly?: string;
  features: string[];
  isCurrent?: boolean;
  isPopular?: boolean;
  billingCycle?: "monthly" | "yearly";
}

export function SubscriptionCard({ plan, onChoosePlan, currentBillingCycle }: { plan: SubscriptionPlan, onChoosePlan: (planId: string, cycle: "monthly" | "yearly") => void, currentBillingCycle: "monthly" | "yearly" }) {
  const price = currentBillingCycle === "yearly" && plan.priceYearly ? plan.priceYearly : plan.priceMonthly;
  const cycleText = currentBillingCycle === "yearly" ? "/year" : "/month";
  
  let savingsText = "";
  if (currentBillingCycle === "yearly" && plan.priceYearly && plan.priceMonthly) {
    const monthlyPriceNum = parseFloat(plan.priceMonthly.replace('₦', ''));
    const yearlyPriceNum = parseFloat(plan.priceYearly.replace('₦', ''));
    if (!isNaN(monthlyPriceNum) && !isNaN(yearlyPriceNum)) {
      const totalMonthlyCost = monthlyPriceNum * 12;
      const yearlySavings = totalMonthlyCost - yearlyPriceNum;
      if (yearlySavings > 0) {
        savingsText = `(Save ₦${yearlySavings.toLocaleString()} vs. monthly)`;
      }
    }
  }


  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full", plan.isPopular ? "border-2 border-primary ring-2 ring-primary/20" : "")}>
      {plan.isPopular && (
        <div className="bg-primary text-primary-foreground text-xs font-semibold py-1 px-3 rounded-t-md text-center -mb-px z-10 relative">
          Most Popular
        </div>
      )}
      <CardHeader className="pb-4">
        <CardTitle className="font-headline text-2xl flex items-center justify-between">
          <span className="flex items-center">
            {plan.id === "business_org_va" && <Briefcase className="h-6 w-6 mr-2 text-primary/80" />}
            {plan.name}
          </span>
          {plan.isCurrent && <Zap className="h-6 w-6 text-green-500 fill-green-200" />}
        </CardTitle>
        <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-primary">{price}</span>
            <span className="text-lg font-medium text-muted-foreground">{cycleText}</span>
        </div>
        {savingsText && (
             <p className="text-sm text-green-600 font-medium">
                {savingsText}
            </p>
        )}
        <CardDescription>{plan.isCurrent ? "This is your current plan." : `Ideal for ${plan.name.toLowerCase().includes('expert') ? 'students seeking VA services' : 'VAs/Agencies offering services'}.`}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
          {plan.name === "Basic" && ( 
             <li className="flex items-start text-muted-foreground">
              <XCircle className="h-5 w-5 text-red-400 mr-2 shrink-0 mt-0.5" />
              <span>Advanced AI search features</span>
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="mt-auto pt-6 border-t">
        {plan.isCurrent ? (
          <Button variant="outline" disabled className="w-full">Currently Subscribed</Button>
        ) : (
          <Button 
            onClick={() => onChoosePlan(plan.id, currentBillingCycle)} 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Choose {plan.name}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
