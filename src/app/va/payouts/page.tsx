
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/shared/StatCard";
import { DollarSign, Download, Banknote, CalendarDays, CheckCircle, Send, ListChecks } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface PayoutHistoryItem {
  id: string;
  date: string;
  amount: string;
  status: "Processed" | "Pending" | "Failed";
  transactionId: string;
  bankName: string;
  accountLast4: string;
}

const mockPayoutHistoryInitial: PayoutHistoryItem[] = [
  { id: "PAY001", date: "2024-07-15", amount: "₦10,000.00", status: "Processed", transactionId: "TRX12345ABC", bankName: "Zenith Bank", accountLast4: "7890" },
  { id: "PAY002", date: "2024-06-28", amount: "₦8,500.00", status: "Processed", transactionId: "TRX67890DEF", bankName: "GTBank", accountLast4: "1234" },
  { id: "PAY003", date: "2024-06-10", amount: "₦12,200.00", status: "Processed", transactionId: "TRX24680GHI", bankName: "Zenith Bank", accountLast4: "7890" },
];

const mockVaBankDetails = {
    bankName: "Zenith Bank",
    accountNumber: "********7890", 
    accountName: "Aisha Bello VA"
};

const initialCurrentBalance = 15000.00; 
const initialTotalEarned = 55700.00; 
const initialLastPayoutAmount = 10000.00; 

export default function VaPayoutsPage() {
  const { toast } = useToast();
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [currentBalance, setCurrentBalance] = useState(initialCurrentBalance);
  const [lastPayoutAmount, setLastPayoutAmount] = useState(initialLastPayoutAmount);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistoryItem[]>(mockPayoutHistoryInitial);
  const totalEarned = initialTotalEarned; 


  const handleRequestWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount to withdraw.", variant: "destructive" });
      return;
    }
    if (amount > currentBalance) {
      toast({ title: "Insufficient Balance", description: `Cannot withdraw more than your current balance of ₦${currentBalance.toFixed(2)}.`, variant: "destructive" });
      return;
    }
    if (amount < 1000) { 
         toast({ title: "Minimum Withdrawal", description: `Minimum withdrawal amount is ₦1,000.00.`, variant: "destructive" });
        return;
    }

    const newBalance = currentBalance - amount;
    setCurrentBalance(newBalance);
    setLastPayoutAmount(amount);

    const newPayout: PayoutHistoryItem = {
        id: `PAY${String(Date.now()).slice(-3)}`,
        date: new Date().toISOString().split('T')[0], 
        amount: `₦${amount.toFixed(2)}`,
        status: "Pending", 
        transactionId: `TRX_PENDING_${String(Date.now()).slice(-4)}`,
        bankName: mockVaBankDetails.bankName,
        accountLast4: mockVaBankDetails.accountNumber.slice(-4),
    };
    setPayoutHistory(prevHistory => [newPayout, ...prevHistory]);


    toast({
      title: "Withdrawal Request Submitted",
      description: `Your request to withdraw ₦${amount.toFixed(2)} to ${mockVaBankDetails.bankName} (******${mockVaBankDetails.accountNumber.slice(-4)}) is pending admin approval. Your balance has been updated.`,
    });
     toast({
        title: "Admin Notification (Simulated)",
        description: `Admin to verify balance and process withdrawal for ₦${amount.toFixed(2)}. User: VA, Current Balance: ₦${newBalance.toFixed(2)}`,
        variant: "default",
        duration: 7000, 
    });
    setWithdrawalAmount(""); 
  };

  const handleDownloadCsv = () => {
    toast({
      title: "CSV Download Simulated",
      description: "Your payout history CSV download has started (simulation).",
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="My Payouts & Earnings"
        description="View your earnings, request withdrawals, and track your payout history."
        icon={DollarSign}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Current Withdrawable Balance" value={`₦${currentBalance.toFixed(2)}`} icon={Banknote} description="Funds available for withdrawal." />
        <StatCard title="Total Earned (All Time)" value={`₦${totalEarned.toFixed(2)}`} icon={ListChecks} description="Gross earnings on STIPS Lite." />
        <StatCard title="Last Payout Amount" value={`₦${lastPayoutAmount.toFixed(2)}`} icon={CheckCircle} description="Most recent successful payout." />
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Request Withdrawal</CardTitle>
          <CardDescription>Withdraw your earnings to your registered bank account. Minimum withdrawal: ₦1,000.00.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="font-medium text-sm mb-2">Payout Bank Details:</h4>
            <p className="text-sm"><span className="text-muted-foreground">Bank:</span> {mockVaBankDetails.bankName}</p>
            <p className="text-sm"><span className="text-muted-foreground">Account:</span> {mockVaBankDetails.accountNumber}</p>
            <p className="text-sm"><span className="text-muted-foreground">Name:</span> {mockVaBankDetails.accountName}</p>
            <p className="text-xs text-muted-foreground mt-2">To update these details, please go to your <a href="/va/profile" className="underline text-primary">VA Profile</a>.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="withdrawalAmount">Amount to Withdraw (NGN)</Label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground font-semibold text-lg">₦</span>
                <Input 
                    id="withdrawalAmount" 
                    type="number" 
                    placeholder="e.g., 5000.00" 
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="pl-8 text-lg h-12"
                    min="1000"
                    step="0.01"
                />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleRequestWithdrawal} 
            className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={currentBalance < 1000 || !withdrawalAmount}
          >
            <Send className="mr-2 h-4 w-4" /> Request Withdrawal
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-xl">Payout History</CardTitle>
            <CardDescription>Your record of all processed and pending payouts.</CardDescription>
          </div>
          <Button variant="outline" onClick={handleDownloadCsv}>
            <Download className="mr-2 h-4 w-4" /> Download CSV
          </Button>
        </CardHeader>
        <CardContent>
          {payoutHistory.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
                <CalendarDays className="mx-auto h-12 w-12 mb-3" />
                <p>No payout history available yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount (NGN)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Bank Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutHistory.map(payout => (
                    <TableRow key={payout.id}>
                      <TableCell>{payout.date}</TableCell>
                      <TableCell className="font-medium">{payout.amount}</TableCell>
                      <TableCell>
                        <Badge 
                            variant={payout.status === "Processed" ? "default" : payout.status === "Pending" ? "secondary" : "destructive"}
                            className={
                                payout.status === "Processed" ? "bg-green-500 text-white" :
                                payout.status === "Pending" ? "bg-yellow-500 text-white" : ""
                            }
                        >
                            {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payout.transactionId}</TableCell>
                      <TableCell className="text-xs">{payout.bankName} (...{payout.accountLast4})</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
