"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, DollarSign, Users, Gift, ExternalLink, Smartphone } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { useToast } from "@/hooks/use-toast";

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

export function ReferralDashboard() {
  const referralLink = "https://stips.lite/ref/YOUR_CODE_XYZ"; // Placeholder
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Referral Link Copied!", description: "Your referral link has been copied to the clipboard." });
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
          <CardTitle className="font-headline text-xl">Withdrawal Setup</CardTitle>
          <CardDescription>Set up your mobile wallet details to withdraw your earnings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-1.5">
                <Label htmlFor="mobileNumber">Mobile Number (M-Pesa, Airtel Money, etc.)</Label>
                <Input id="mobileNumber" type="tel" placeholder="e.g., 0712345678" />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="walletName">Registered Name on Wallet</Label>
                <Input id="walletName" type="text" placeholder="e.g., John Doe" />
            </div>
            <p className="text-xs text-muted-foreground">
                Ensure your mobile number and name are correct to avoid withdrawal issues. Minimum withdrawal amount is $10.00.
            </p>
        </CardContent>
        <CardFooter>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Smartphone className="mr-2 h-4 w-4" /> Save Wallet Details
            </Button>
             <Button variant="outline" className="ml-auto" disabled>
                Withdraw Funds (Balance: $10.00)
            </Button>
        </CardFooter>
      </Card>

    </div>
  );
}
