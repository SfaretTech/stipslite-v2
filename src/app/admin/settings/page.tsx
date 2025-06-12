
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, DollarSign, Percent } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Platform Settings"
        description="Configure general settings, payment parameters, and referral program rules."
        icon={Settings}
      />
      
      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">General Settings</CardTitle>
            <CardDescription>Basic configuration for the STIPS Lite platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" defaultValue="STIPS Lite" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode" className="text-base">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable access to the platform for users.
                </p>
              </div>
              <Switch id="maintenanceMode" aria-label="Toggle maintenance mode" />
            </div>
             <div className="space-y-1.5">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" type="email" defaultValue="support@stipslite.com" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Payment & Subscription Settings</CardTitle>
            <CardDescription>Manage currency, task pricing, and subscription tiers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Input id="currency" defaultValue="NGN" />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="serviceFee">Service Fee Percentage</Label>
                    <div className="relative">
                        <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="serviceFee" type="number" defaultValue="5" className="pl-8" />
                    </div>
                </div>
            </div>
             <div className="space-y-1.5">
              <Label htmlFor="subscriptionTiers">Subscription Tier Configuration (JSON)</Label>
              <Textarea id="subscriptionTiers" rows={5} defaultValue={JSON.stringify([
                  { id: "basic", name: "Basic", priceMonthly: 9.99, priceYearly: 99.99, currency: "NGN" },
                  { id: "pro", name: "Pro", priceMonthly: 19.99, priceYearly: 199.99, currency: "NGN" },
              ], null, 2)} 
              className="font-code"
              />
              <p className="text-xs text-muted-foreground">Define subscription plans and their pricing. Requires restart to apply changes.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Referral Program Settings</CardTitle>
            <CardDescription>Configure referral bonuses and withdrawal limits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="referralBonus">Referral Bonus Amount (NGN)</Label>
                     <div className="relative">
                        <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                        <Input id="referralBonus" type="number" defaultValue="5.00" className="pl-8" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="minWithdrawal">Minimum Withdrawal Amount (NGN)</Label>
                     <div className="relative">
                        <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                        <Input id="minWithdrawal" type="number" defaultValue="10.00" className="pl-8" />
                    </div>
                </div>
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="referralProgramActive" className="text-base">Referral Program Active</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable the referral program for users.
                </p>
              </div>
              <Switch id="referralProgramActive" defaultChecked aria-label="Toggle referral program" />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Save className="mr-2 h-4 w-4" /> Save All Settings
            </Button>
        </div>
      </form>
    </div>
  );
}
