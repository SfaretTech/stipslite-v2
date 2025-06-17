
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, DollarSign, Users, Gift, Smartphone, Send } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react"; 

interface Referral {
  id: string;
  referredUser: string;
  date: string;
  status: "Signup Reward Earned" | "Subscribed (Yearly) - Reward Earned" | "Signed Up, Awaiting Activity" | "Pending First Task";
  eventType: "signup" | "yearly_subscription" | "pending_activity";
  earnings: string;
}

const mockReferrals: Referral[] = [
  { id: "REF001", referredUser: "Alice Wonderland", date: "2024-07-01", eventType: "signup", status: "Signup Reward Earned", earnings: "₦100.00" },
  { id: "REF002", referredUser: "Bob The Builder", date: "2024-07-05", eventType: "yearly_subscription", status: "Subscribed (Yearly) - Reward Earned", earnings: "₦1000.00" },
  { id: "REF003", referredUser: "Charlie Brown", date: "2024-07-10", eventType: "signup", status: "Signed Up, Awaiting Activity", earnings: "₦0.00" },
  { id: "REF004", referredUser: "Diana Prince", date: "2024-07-12", eventType: "pending_activity", status: "Pending First Task", earnings: "₦0.00" },
  { id: "REF005", referredUser: "Edward Scissorhands", date: "2024-07-15", eventType: "signup", status: "Signup Reward Earned", earnings: "₦100.00" },
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
  const [withdrawalAmount, setWithdrawalAmount] = useState(""); 
  
  const initialBalance = mockReferrals.reduce((acc, ref) => {
      if (ref.status.includes("Earned")) {
        return acc + parseFloat(ref.earnings.replace('₦', ''));
      }
      return acc;
    }, 0);
  const [currentBalance, setCurrentBalance] = useState(initialBalance);


  const calculatePendingEarnings = () => {
    return mockReferrals.reduce((acc, ref) => {
      if (ref.status === "Signed Up, Awaiting Activity") { 
        return acc + 100 + 1000; 
      }
      if (ref.status === "Pending First Task") { 
          return acc + 100;
      }
      return acc;
    }, 0);
  }
  const pendingBalance = calculatePendingEarnings();


  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Referral Link Copied!", description: "Your referral link has been copied to the clipboard." });
  };

  const handleSaveWalletDetails = () => {
    toast({
      title: "Wallet Details Saved!",
      description: "Your mobile money wallet information has been updated (simulation).",
    });
  };

  const handleWithdrawFunds = () => {
    const amountToWithdraw = parseFloat(withdrawalAmount);
    if (isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
        toast({
            title: "Invalid Amount",
            description: "Please enter a valid amount to withdraw.",
            variant: "destructive",
        });
        return;
    }
    if (amountToWithdraw > currentBalance) {
        toast({
            title: "Insufficient Balance",
            description: `You cannot withdraw more than your current balance of ₦${currentBalance.toFixed(2)}.`,
            variant: "destructive",
        });
        return;
    }
     if (amountToWithdraw < 100) { 
        toast({ title: "Minimum Withdrawal", description: `Minimum withdrawal amount is ₦100.00.`, variant: "destructive" });
        return;
    }

    setCurrentBalance(prevBalance => prevBalance - amountToWithdraw);

    toast({
      title: "Withdrawal Request Submitted",
      description: `Your request to withdraw ₦${amountToWithdraw.toFixed(2)} is pending admin approval.`,
      variant: "default",
    });
    
    toast({
        title: "Admin Notification (Simulated)",
        description: `Admin would be notified of a withdrawal request for ₦${amountToWithdraw.toFixed(2)}. User: [Current User], Wallet Details: [Details from form]`,
        variant: "default",
        duration: 5000, 
    });
    console.log(`SIMULATION: Admin notified for withdrawal of ₦${amountToWithdraw.toFixed(2)}. User: [Current User], Wallet Details: [Details from form]`);
    setWithdrawalAmount(""); 
  };


  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Referrals" value={mockReferrals.filter(r => r.eventType === "signup" || r.eventType === "yearly_subscription").length.toString()} icon={Users} description="Friends who joined or subscribed." />
        <StatCard title="Total Earnings" value={`₦${currentBalance.toFixed(2)}`} icon={DollarSign} description="From completed referral actions." />
        <StatCard title="Pending Earnings" value={`₦${pendingBalance.toFixed(2)}`} icon={Gift} description="Potential earnings from referrals." />
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
          You earn ₦100 for each friend who signs up. Earn an additional ₦1000 if they subscribe to a yearly plan!
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
                      ${ref.status.includes('Earned') ? 'bg-green-100 text-green-700' : 
                        ref.status.includes('Subscribed') ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'}`}>
                      {ref.status}
                    </span>
                  </TableCell>
                  <TableCell>{ref.earnings}</TableCell>
                </TableRow>
              ))}
               {mockReferrals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No referral history yet.
                  </TableCell>
                </TableRow>
              )}
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
             <Button 
              onClick={handleSaveWalletDetails}
              className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto"
            >
                <Smartphone className="mr-2 h-4 w-4" /> Save Wallet Details
            </Button>
            <p className="text-xs text-muted-foreground pt-2">
                Ensure your mobile number and name are correct to avoid withdrawal issues. Minimum withdrawal amount is ₦100.00.
            </p>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
            <CardTitle className="font-headline text-xl">Withdraw Earnings</CardTitle>
            <CardDescription>
                Your current withdrawable balance is <span className="font-semibold text-primary">₦{currentBalance.toFixed(2)}</span>.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-1.5">
                <Label htmlFor="withdrawalAmount">Amount to Withdraw (NGN)</Label>
                <div className="relative">
                    <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                    <Input 
                        id="withdrawalAmount" 
                        type="number" 
                        placeholder="e.g., 100.00" 
                        className="pl-8"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        min="0.01"
                        step="0.01"
                    />
                </div>
            </div>
        </CardContent>
        <CardFooter>
             <Button 
               onClick={handleWithdrawFunds}
               variant="outline"
               className="w-full"
               disabled={currentBalance < 100 || !withdrawalAmount} 
             >
                <Send className="mr-2 h-4 w-4" /> Request Withdrawal
            </Button>
        </CardFooter>
      </Card>

    </div>
  );
}
