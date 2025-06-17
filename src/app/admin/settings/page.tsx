
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, DollarSign, Percent, Gift, Users2, Building } from "lucide-react"; // Added Gift, Users2, Building

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
                  { id: "expert_va_student", name: "Student Expert VA Plan", priceMonthly: 500, priceYearly: 2000, currency: "NGN"},
                  { id: "va_professional_business", name: "VA Professional Business Plan", priceMonthly: 1000, priceYearly: 5000, currency: "NGN"}
              ], null, 2)} 
              className="font-code"
              />
              <p className="text-xs text-muted-foreground">Define subscription plans and their pricing. Requires restart to apply changes.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Gift className="mr-2 h-5 w-5 text-primary"/>Referral Program Management</CardTitle>
            <CardDescription>Configure referral bonuses for different user types and actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="referralProgramActive" className="text-base">Referral Program Active</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable the entire referral program.
                </p>
              </div>
              <Switch id="referralProgramActive" defaultChecked aria-label="Toggle referral program" />
            </div>
            
            <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium text-md flex items-center"><Users2 className="mr-2 h-4 w-4 text-muted-foreground"/> Student Referral Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="studentSignupBonus">New Student Signup Bonus (NGN)</Label>
                         <div className="relative">
                            <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                            <Input id="studentSignupBonus" type="number" defaultValue="100.00" className="pl-8" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="studentYearlySubBonus">Student Yearly Subscription Bonus (NGN)</Label>
                         <div className="relative">
                            <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                            <Input id="studentYearlySubBonus" type="number" defaultValue="1000.00" className="pl-8" />
                        </div>
                    </div>
                </div>
            </div>

             <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium text-md flex items-center"><Building className="mr-2 h-4 w-4 text-muted-foreground"/> Print Center Referral Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="pcSignupBonus">New Print Center Signup Bonus (NGN)</Label>
                         <div className="relative">
                            <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                            <Input id="pcSignupBonus" type="number" defaultValue="250.00" className="pl-8" />
                        </div>
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="pcFirstTransactionBonus">Print Center First Paid Job Bonus (NGN)</Label>
                         <div className="relative">
                            <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                            <Input id="pcFirstTransactionBonus" type="number" defaultValue="500.00" className="pl-8" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="space-y-1.5">
                <Label htmlFor="minWithdrawalGlobal">Minimum Withdrawal Amount (NGN - Global)</Label>
                 <div className="relative">
                    <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                    <Input id="minWithdrawalGlobal" type="number" defaultValue="100.00" className="pl-8" />
                </div>
                 <p className="text-xs text-muted-foreground">This applies to all referral earnings withdrawals.</p>
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
