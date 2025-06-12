
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, DollarSign, Users, Gift, Smartphone, Send } from "lucide-react"; // Added Send icon
import { StatCard } from "@/components/shared/StatCard";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Referral {
  id: string;
  referredUser: string;
  date: string;
  status: "Pending" | "Completed" | "Earned";
  earnings: string;
}

const mockReferrals: Referral[] = [
  { id: "REF001", referredUser: "Alice Wonderland", date: "2024-07-01", status: "Completed", earnings: "$5.00" },
  { id: "REF002", referredUser: "Bob The Builder", date: "2024-07-05", status: "Earned", earnings: "$5.00" },
  { id: "REF003", referredUser: "Charlie Brown", date: "2024-07-10", status: "Pending", earnings: "$0.00" },
];

const mobileMoneyPlatforms = [
  { value: "opay", label: "OPay" },
  { value: "moniepoint", label: "Moniepoint" },
  { value: "paga", label: "Paga" },
  { value: "palmpay", label: "PalmPay" },
];

export function ReferralDashboard() {
  const referralLink = "https://stips.lite/ref/YOUR_CODE_XYZ"; // Placeholder
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Referral Link Copied!", description: "Your referral link has been copied to the clipboard." });
  };

  const handleSaveWalletDetails = () => {
    // UI-only: Simulate saving details
    toast({
      title: "Wallet Details Saved!",
      description: "Your mobile money wallet information has been updated (simulation).",
    });
  };

  const handleWithdrawFunds = () => {
    // UI-only: Simulate withdrawal request
    const withdrawalAmount = "$10.00"; // Assuming this is the balance or a fixed amount
    toast({
      title: "Withdrawal Request Submitted",
      description: `Your request to withdraw ${withdrawalAmount} is pending admin approval.`,
      variant: "default",
    });
    
    // Simulate admin notification (for dev/demo purposes)
    toast({
        title: "Admin Notification (Simulated)",
        description: `Admin would be notified of a withdrawal request for ${withdrawalAmount}.`,
        variant: "default",
        duration: 5000, 
    });
    console.log(`SIMULATION: Admin notified for withdrawal of ${withdrawalAmount}. User: [Current User], Wallet Details: [Details from form]`);
  };


  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Referrals" value="3" icon={Users} description="Successful user sign-ups." />
        <StatCard title="Total Earnings" value="$10.00" icon={DollarSign} description="From completed referrals." />
        <StatCard title="Pending Earnings" value="$0.00" icon={Gift} description="Potential earnings from pending referrals." />
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Your Referral Link</CardTitle>
          <CardDescription>Share this link with your friends to earn rewards.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center space-x-3">
          <Input type="text" value={referralLink} readOnly className="bg-muted/50" />
          <Button onClick={copyToClipboard} variant="outline" size="icon">
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy Link</span>
          </Button>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          You earn $5.00 for each friend who signs up and completes their first task.
        </CardFooter>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Referral History</CardTitle>
          <CardDescription>Track your referrals and earnings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referred User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReferrals.map(ref => (
                <TableRow key={ref.id}>
                  <TableCell>{ref.referredUser}</TableCell>
                  <TableCell>{ref.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${ref.status === 'Completed' || ref.status === 'Earned' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {ref.status}
                    </span>
                  </TableCell>
                  <TableCell>{ref.earnings}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Add mobile money</CardTitle>
          <CardDescription>Set up your mobile wallet details to withdraw your earnings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="mobileMoneyPlatform">Mobile Money Platform</Label>
              <Select name="mobileMoneyPlatform">
                <SelectTrigger id="mobileMoneyPlatform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {mobileMoneyPlatforms.map(platform => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="mobileNumber">Mobile Money Number</Label>
                <Input id="mobileNumber" type="tel" placeholder="e.g., 08012345678" />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="walletName">Registered Name on Wallet</Label>
                <Input id="walletName" type="text" placeholder="e.g., John Doe" />
            </div>
            <p className="text-xs text-muted-foreground">
                Ensure your mobile number and name are correct to avoid withdrawal issues. Minimum withdrawal amount is $10.00.
            </p>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 justify-between"> {/* Added flex-wrap and gap */}
            <Button 
              onClick={handleSaveWalletDetails}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
                <Smartphone className="mr-2 h-4 w-4" /> Save Wallet Details
            </Button>
             <Button 
               onClick={handleWithdrawFunds}
               variant="outline"
             >
                <DollarSign className="mr-2 h-4 w-4" /> Withdraw Funds (Balance: $10.00)
            </Button>
        </CardFooter>
      </Card>

    </div>
  );
}
