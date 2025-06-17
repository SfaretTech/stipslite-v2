
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, DollarSign, Users, Gift, Smartphone, Send, Users2, Building, Briefcase } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react"; 
import { Badge } from "@/components/ui/badge";

interface Referral {
  id: string;
  referredEntityName: string; 
  referredEntityType: "Student" | "Print Center" | "Virtual Assistant";
  date: string;
  status: string; 
  earnings: string;
}

const mockReferrals: Referral[] = [
  { id: "REF001", referredEntityName: "Alice W.", referredEntityType: "Student", date: "2024-07-01", status: "Student Signed Up - Reward Earned", earnings: "₦100.00" },
  { id: "REF002", referredEntityName: "Speedy Prints", referredEntityType: "Print Center", date: "2024-07-03", status: "Print Center Registered - Reward Pending", earnings: "₦0.00" },
  { id: "REF003", referredEntityName: "Bob The Builder", referredEntityType: "Student", date: "2024-07-05", status: "Student Subscribed Yearly - Reward Earned", earnings: "₦1000.00" },
  { id: "REF004", referredEntityName: "Charlie Brown", referredEntityType: "Student", date: "2024-07-10", status: "Student Signed Up - Awaiting Activity", earnings: "₦0.00" },
  { id: "REF005", referredEntityName: "Quick Copy Ltd", referredEntityType: "Print Center", date: "2024-07-12", status: "Print Center Active - Reward Earned", earnings: "₦500.00" },
  { id: "REF006", referredEntityName: "Diana Prince", referredEntityType: "Student", date: "2024-07-15", status: "Student Pending First Task", earnings: "₦0.00" },
  { id: "REF007", referredEntityName: "Eva Express VA", referredEntityType: "Virtual Assistant", date: "2024-07-18", status: "VA Registered - Reward Pending", earnings: "₦0.00"},
  { id: "REF008", referredEntityName: "David Direct VA", referredEntityType: "Virtual Assistant", date: "2024-07-20", status: "VA Completed First Task - Reward Earned", earnings: "₦300.00"},
];

const mobileMoneyPlatforms = [
  { value: "opay", label: "OPay" },
  { value: "moniepoint", label: "Moniepoint" },
  { value: "paga", label: "Paga" },
  { value: "palmpay", label: "PalmPay" },
];

interface ReferralDashboardProps {
  userRole: 'student' | 'va' | 'print-center';
}

export function ReferralDashboard({ userRole }: ReferralDashboardProps) {
  const referralLinkBase = "https://stips.lite/ref/";
  const userSpecificCode = userRole === 'student' ? "STUDENT_XYZ" : userRole === 'va' ? "VA_ABC" : "PC_123";
  
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
      if (ref.status.includes("Pending") || ref.status.includes("Awaiting")) {
        if (ref.referredEntityType === "Student") return acc + 100; 
        if (ref.referredEntityType === "Print Center") return acc + 250;
        if (ref.referredEntityType === "Virtual Assistant") return acc + 150; // Example pending VA reward
      }
      return acc;
    }, 0);
  }
  const pendingBalance = calculatePendingEarnings();


  const copyToClipboard = (linkToCopy: string, linkType: string) => {
    navigator.clipboard.writeText(linkToCopy);
    toast({ title: `${linkType} Referral Link Copied!`, description: `Your ${linkType.toLowerCase()} referral link has been copied.` });
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
        description: `Admin would be notified of a withdrawal request for ₦${amountToWithdraw.toFixed(2)}. User: [Current User - ${userRole}], Wallet Details: [Details from form]`,
        variant: "default",
        duration: 5000, 
    });
    console.log(`SIMULATION: Admin notified for withdrawal of ₦${amountToWithdraw.toFixed(2)}. User: [Current User - ${userRole}], Wallet Details: [Details from form]`);
    setWithdrawalAmount(""); 
  };


  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Successful Referrals" value={mockReferrals.filter(r => r.status.includes("Earned")).length.toString()} icon={Users} description="Successful student, VA & print center referrals." />
        <StatCard title="Total Referral Earnings" value={`₦${currentBalance.toFixed(2)}`} icon={DollarSign} description="From completed referral actions." />
        <StatCard title="Potential Pending Earnings" value={`₦${pendingBalance.toFixed(2)}`} icon={Gift} description="From referrals in progress." />
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Your Referral Links</CardTitle>
          <CardDescription>Share these links to earn rewards. Reward amounts are set by Admin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="studentReferralLink" className="font-medium flex items-center mb-1">
                    <Users2 className="h-5 w-5 mr-2 text-primary"/> Refer a New Student
                </Label>
                <div className="flex items-center space-x-3">
                    <Input id="studentReferralLink" type="text" value={`${referralLinkBase}${userSpecificCode}&type=student`} readOnly className="bg-muted/50" />
                    <Button onClick={() => copyToClipboard(`${referralLinkBase}${userSpecificCode}&type=student`, "Student")} variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy Student Referral Link</span>
                    </Button>
                </div>
            </div>
            {userRole !== 'va' && (
              <div>
                  <Label htmlFor="pcReferralLink" className="font-medium flex items-center mb-1">
                      <Building className="h-5 w-5 mr-2 text-primary"/> Refer a New Print Center
                  </Label>
                  <div className="flex items-center space-x-3">
                      <Input id="pcReferralLink" type="text" value={`${referralLinkBase}${userSpecificCode}&type=printcenter`} readOnly className="bg-muted/50" />
                      <Button onClick={() => copyToClipboard(`${referralLinkBase}${userSpecificCode}&type=printcenter`, "Print Center")} variant="outline" size="icon">
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy Print Center Referral Link</span>
                      </Button>
                  </div>
              </div>
            )}
            {userRole === 'va' && (
              <div>
                  <Label htmlFor="vaReferralLink" className="font-medium flex items-center mb-1">
                      <Briefcase className="h-5 w-5 mr-2 text-primary"/> Refer a New VA
                  </Label>
                  <div className="flex items-center space-x-3">
                      <Input id="vaReferralLink" type="text" value={`${referralLinkBase}${userSpecificCode}&type=va`} readOnly className="bg-muted/50" />
                      <Button onClick={() => copyToClipboard(`${referralLinkBase}${userSpecificCode}&type=va`, "VA")} variant="outline" size="icon">
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy VA Referral Link</span>
                      </Button>
                  </div>
              </div>
            )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Referral rewards vary for different entity types. Check with admin for current program details.
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
                <TableHead>Referred Entity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReferrals.map(ref => (
                <TableRow key={ref.id}>
                  <TableCell>{ref.referredEntityName}</TableCell>
                  <TableCell>
                     <Badge 
                        variant={
                            ref.referredEntityType === "Student" ? "secondary" 
                            : ref.referredEntityType === "Print Center" ? "outline" 
                            : "default" 
                        } 
                        className={
                            ref.referredEntityType === "Print Center" ? "border-primary text-primary" 
                            : ref.referredEntityType === "Virtual Assistant" ? "border-purple-500 text-purple-600 bg-purple-50" 
                            : ""
                        }
                      >
                        {ref.referredEntityType}
                     </Badge>
                  </TableCell>
                  <TableCell>{ref.date}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${ref.status.includes('Earned') ? 'bg-green-100 text-green-700' : 
                        ref.status.includes('Subscribed') || ref.status.includes('Active') ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'}`}>
                      {ref.status}
                    </span>
                  </TableCell>
                  <TableCell>{ref.earnings}</TableCell>
                </TableRow>
              ))}
               {mockReferrals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
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
          <CardTitle className="font-headline text-xl">Add Mobile Money for Payouts</CardTitle>
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
