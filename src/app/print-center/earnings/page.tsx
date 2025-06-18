
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

const mockShopPayoutHistoryInitial: PayoutHistoryItem[] = [
  { id: "SPAY001", date: "2024-07-20", amount: "₦15,500.00", status: "Processed", transactionId: "STRX98765", bankName: "Equity Bank", accountLast4: "0123" },
  { id: "SPAY002", date: "2024-07-05", amount: "₦12,000.00", status: "Processed", transactionId: "STRX54321", bankName: "Equity Bank", accountLast4: "0123" },
];

const mockShopBankDetails = {
    bankName: "Equity Bank",
    accountNumber: "********0123", 
    accountName: "Speedy Prints CBD Ltd"
};

const initialCurrentBalanceShop = 23500.00; 
const initialTotalEarnedShop = 150750.00; 
const initialLastPayoutAmountShop = 15500.00; 

export default function PrintCenterEarningsPage() {
  const { toast } = useToast();
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [currentBalance, setCurrentBalance] = useState(initialCurrentBalanceShop);
  const [lastPayoutAmount, setLastPayoutAmount] = useState(initialLastPayoutAmountShop);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistoryItem[]>(mockShopPayoutHistoryInitial);
  const totalEarned = initialTotalEarnedShop; 

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
        id: `SPAY${String(Date.now()).slice(-3)}`,
        date: new Date().toISOString().split('T')[0],
        amount: `₦${amount.toFixed(2)}`,
        status: "Pending",
        transactionId: `STRX_PENDING_${String(Date.now()).slice(-4)}`,
        bankName: mockShopBankDetails.bankName,
        accountLast4: mockShopBankDetails.accountNumber.slice(-4),
    };
    setPayoutHistory(prevHistory => [newPayout, ...prevHistory]);

    toast({
      title: "Withdrawal Request Submitted",
      description: `Your request to withdraw ₦${amount.toFixed(2)} to ${mockShopBankDetails.bankName} (******${mockShopBankDetails.accountNumber.slice(-4)}) is pending admin approval. Your balance has been updated.`,
    });
     toast({
        title: "Admin Notification (Simulated)",
        description: `Admin to verify balance and process withdrawal for ₦${amount.toFixed(2)}. User: Print Center, Current Balance: ₦${newBalance.toFixed(2)}`,
        variant: "default",
        duration: 7000, 
    });
    setWithdrawalAmount(""); 
  };

  const handleDownloadCsv = () => {
    toast({
      title: "CSV Download Simulated",
      description: "Your shop payout history CSV download has started (simulation).",
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Shop Earnings & Payouts"
        description="View your shop's earnings, request withdrawals, and track payout history."
        icon={Banknote}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Current Withdrawable Balance" value={`₦${currentBalance.toFixed(2)}`} icon={Banknote} description="Funds available for withdrawal." />
        <StatCard title="Total Earned (All Time)" value={`₦${totalEarned.toFixed(2)}`} icon={ListChecks} description="Gross earnings for your shop." />
        <StatCard title="Last Payout Amount" value={`₦${lastPayoutAmount.toFixed(2)}`} icon={CheckCircle} description="Most recent successful payout." />
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Request Withdrawal</CardTitle>
          <CardDescription>Withdraw your shop's earnings to its registered bank account. Minimum withdrawal: ₦1,000.00.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="font-medium text-sm mb-2">Payout Bank Details:</h4>
            <p className="text-sm"><span className="text-muted-foreground">Bank:</span> {mockShopBankDetails.bankName}</p>
            <p className="text-sm"><span className="text-muted-foreground">Account:</span> {mockShopBankDetails.accountNumber}</p>
            <p className="text-sm"><span className="text-muted-foreground">Name:</span> {mockShopBankDetails.accountName}</p>
            <p className="text-xs text-muted-foreground mt-2">To update these details, please go to your <a href="/print-center/profile" className="underline text-primary">Shop Profile</a>.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="withdrawalAmountShop">Amount to Withdraw (NGN)</Label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground font-semibold text-lg">₦</span>
                <Input 
                    id="withdrawalAmountShop" 
                    type="number" 
                    placeholder="e.g., 10000.00" 
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
            <CardTitle className="font-headline text-xl">Shop Payout History</CardTitle>
            <CardDescription>Record of all processed and pending payouts for your shop.</CardDescription>
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
