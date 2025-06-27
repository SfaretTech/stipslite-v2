
"use client";

import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Banknote, CheckCircle, Clock, XCircle, MoreHorizontal, Users, Briefcase, Printer, Gift, Edit3, AlertTriangle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

type WithdrawalStatus = 'Pending' | 'Approved' | 'Paid' | 'Failed';
type UserRoleType = 'Student' | 'VA' | 'Print Center';
type PaymentType = 'Referral Earnings' | 'VA Payout' | 'Print Center Payout';

interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRoleType;
  amount: number;
  currency: 'NGN';
  requestedDate: string; // ISO Date string
  status: WithdrawalStatus;
  type: PaymentType;
  paymentDetails: {
    method: string; 
    identifier: string; 
    recipientName: string;
  };
  adminNotes?: string;
  processedDate?: string; 
  transactionId?: string;
}

// Helper component for client-side date and time formatting
const ClientSideTime: React.FC<{ date: Date | string | undefined }> = ({ date }) => {
  const [timeString, setTimeString] = useState<string | null>(null);

  useEffect(() => {
    if (date) {
      const d = typeof date === 'string' ? parseISO(date) : date;
      try {
        setTimeString(format(d, 'PPP p'));
      } catch (error) {
        console.error("Error formatting date in ClientSideTime:", error);
        setTimeString('Invalid Date');
      }
    } else {
      setTimeString('N/A');
    }
  }, [date]); // Rerun when date prop changes

  if (timeString === null) {
    // Initial render (SSR and first client render before useEffect completes)
    return <>N/A</>; // Placeholder if no date

  return <>{timeString}</>; // Render full date and time string after client-side effect
};


const initialWithdrawalRequests: WithdrawalRequest[] = [
  { id: "WDR001", userId: "STD001", userName: "John Doe", userRole: "Student", amount: 1500, currency: "NGN", requestedDate: "2024-07-25T10:00:00Z", status: "Pending", type: "Referral Earnings", paymentDetails: { method: "OPay", identifier: "08012345678", recipientName: "John Doe" } },
  { id: "WDR002", userId: "VA002", userName: "Chinedu Okoro", userRole: "VA", amount: 12500, currency: "NGN", requestedDate: "2024-07-24T14:30:00Z", status: "Approved", type: "VA Payout", paymentDetails: { method: "Zenith Bank", identifier: "******7890", recipientName: "Chinedu Okoro VA Services" } },
  { id: "WDR003", userId: "PC001", userName: "Speedy Prints", userRole: "Print Center", amount: 22000, currency: "NGN", requestedDate: "2024-07-23T09:15:00Z", status: "Paid", type: "Print Center Payout", paymentDetails: { method: "Equity Bank", identifier: "******0123", recipientName: "Speedy Prints CBD Ltd" }, processedDate: "2024-07-24T17:00:00Z", transactionId: "PAY_XYZ123" },
  { id: "WDR004", userId: "STD003", userName: "Bob Johnson", userRole: "Student", amount: 500, currency: "NGN", requestedDate: "2024-07-22T11:00:00Z", status: "Failed", type: "Referral Earnings", paymentDetails: { method: "PalmPay", identifier: "07098765432", recipientName: "Bob J." }, adminNotes: "Invalid wallet details provided." },
  { id: "WDR005", userId: "VA001", userName: "Aisha Bello", userRole: "VA", amount: 8000, currency: "NGN", requestedDate: "2024-07-26T08:00:00Z", status: "Pending", type: "VA Payout", paymentDetails: { method: "GTBank", identifier: "******1234", recipientName: "Aisha Bello" } },
];

const statusColors: Record<WithdrawalStatus, string> = {
  "Pending": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Approved": "bg-blue-100 text-blue-700 border-blue-300",
  "Paid": "bg-green-100 text-green-700 border-green-300",
  "Failed": "bg-red-100 text-red-700 border-red-300",
};

const userRoleIcons: Record<UserRoleType, React.ElementType> = {
  "Student": Users,
  "VA": Briefcase,
  "Print Center": Printer,
};

export default function AdminPaymentManagementPage() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>(initialWithdrawalRequests);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<"approve" | "mark_paid" | "reject" | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [transactionIdInput, setTransactionIdInput] = useState("");

  const { toast } = useToast();

  const openActionDialog = (request: WithdrawalRequest, action: "approve" | "mark_paid" | "reject" | null) => {
    setSelectedRequest(request);
    setCurrentAction(action);
    setAdminNotesInput(request.adminNotes || "");
    setTransactionIdInput(request.transactionId || "");
    setIsActionDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedRequest || !currentAction) return;

    let newStatus: WithdrawalStatus = selectedRequest.status;
    let toastTitle = "";
    let toastDescription = "";

    if (currentAction === "approve") {
      newStatus = "Approved";
      toastTitle = "Withdrawal Approved";
      toastDescription = `Request ${selectedRequest.id} for ${selectedRequest.userName} has been approved. Ready for payment processing.`;
    } else if (currentAction === "mark_paid") {
      if (!transactionIdInput.trim() && selectedRequest.type !== 'Referral Earnings') { // Transaction ID might be optional for internal referral payouts
        toast({ title: "Transaction ID Required", description: "Please enter a transaction ID for service payouts.", variant: "destructive" });
        return;
      }
      newStatus = "Paid";
      toastTitle = "Withdrawal Marked as Paid";
      toastDescription = `Request ${selectedRequest.id} for ${selectedRequest.userName} marked as paid. Transaction ID: ${transactionIdInput || 'N/A'}.`;
    } else if (currentAction === "reject") {
      if (!adminNotesInput.trim()) {
        toast({ title: "Rejection Reason Required", description: "Please provide a reason/note for rejection.", variant: "destructive" });
        return;
      }
      newStatus = "Failed";
      toastTitle = "Withdrawal Rejected/Failed";
      toastDescription = `Request ${selectedRequest.id} for ${selectedRequest.userName} has been marked as failed. Reason: ${adminNotesInput}.`;
    }

    setRequests(prevReqs =>
      prevReqs.map(req =>
        req.id === selectedRequest.id
          ? { 
              ...req, 
              status: newStatus, 
              adminNotes: currentAction === "reject" ? adminNotesInput : req.adminNotes, 
              transactionId: currentAction === "mark_paid" ? transactionIdInput : req.transactionId,
              processedDate: (currentAction === "mark_paid" || currentAction === "reject") ? new Date().toISOString() : req.processedDate
            }
          : req
      )
    );

    toast({ title: toastTitle, description: toastDescription, variant: newStatus === "Failed" ? "destructive" : "default" });
    setIsActionDialogOpen(false);
    setSelectedRequest(null);
    setCurrentAction(null);
  };
  
  const handleDownloadCsv = (dataType: string) => {
    toast({
      title: "CSV Download Simulated",
      description: `${dataType} CSV download has started (simulated).`,
    });
  };

  const referralWithdrawals = useMemo(() => requests.filter(r => r.type === "Referral Earnings"), [requests]);
  const servicePayouts = useMemo(() => requests.filter(r => r.type === "VA Payout" || r.type === "Print Center Payout"), [requests]);

  const renderTable = (data: WithdrawalRequest[], tableTitle: string, dataTypeForCsv: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{tableTitle} ({data.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
                <Banknote className="mx-auto h-12 w-12 mb-3"/>
                <p>No {tableTitle.toLowerCase()} at this time.</p>
            </div>
        ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Req. ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount (NGN)</TableHead>
                <TableHead>Requested On</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(req => {
                const UserIcon = userRoleIcons[req.userRole];
                return (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs">{req.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <span className="font-medium">{req.userName}</span>
                            <span className="block text-xs text-muted-foreground">({req.userRole} - {req.userId})</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">₦{req.amount.toFixed(2)}</TableCell>
                    <TableCell><ClientSideTime date={req.requestedDate} /></TableCell>
                    <TableCell>
                        {req.paymentDetails.method}
                        <span className="block text-xs text-muted-foreground">({req.paymentDetails.identifier})</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[req.status]}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {req.status === "Pending" && (
                            <DropdownMenuItem onClick={() => openActionDialog(req, "approve")}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Approve Withdrawal
                            </DropdownMenuItem>
                          )}
                          {req.status === "Approved" && (
                            <DropdownMenuItem onClick={() => openActionDialog(req, "mark_paid")}>
                              <Banknote className="mr-2 h-4 w-4 text-blue-600" /> Mark as Paid
                            </DropdownMenuItem>
                          )}
                          {(req.status === "Pending" || req.status === "Approved") && (
                            <DropdownMenuItem onClick={() => openActionDialog(req, "reject")} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                              <XCircle className="mr-2 h-4 w-4" /> Reject / Mark Failed
                            </DropdownMenuItem>
                          )}
                           <DropdownMenuItem onClick={() => {setSelectedRequest(req); setIsActionDialogOpen(true); setCurrentAction(null);}}>
                                <Edit3 className="mr-2 h-4 w-4"/> View Details / Notes
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
          <Button onClick={() => handleDownloadCsv(dataTypeForCsv)} variant="outline">
              <Download className="mr-2 h-4 w-4"/> Download as CSV
          </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payment & Withdrawal Management"
        description="Oversee and process payout requests from users for referral earnings and service completions."
        icon={Banknote}
      />

      <Tabs defaultValue="referrals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="referrals"><Gift className="mr-2 h-4 w-4"/>Referral Withdrawals</TabsTrigger>
          <TabsTrigger value="service_payouts"><Briefcase className="mr-2 h-4 w-4"/>Service Payouts (VAs/PCs)</TabsTrigger>
        </TabsList>
        <TabsContent value="referrals">
          {renderTable(referralWithdrawals, "Referral Withdrawal Requests", "Referral Withdrawals")}
        </TabsContent>
        <TabsContent value="service_payouts">
          {renderTable(servicePayouts, "VA & Print Center Payout Requests", "Service Payouts")}
        </TabsContent>
      </Tabs>

      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {currentAction === "approve" && "Approve Withdrawal Request"}
                  {currentAction === "mark_paid" && "Mark Withdrawal as Paid"}
                  {currentAction === "reject" && "Reject/Fail Withdrawal Request"}
                  {!currentAction && "View Withdrawal Details"}
                </DialogTitle>
                <DialogDescription>
                  Request ID: {selectedRequest.id} | User: {selectedRequest.userName} ({selectedRequest.userRole}) | Amount: ₦{selectedRequest.amount.toFixed(2)}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="text-sm space-y-1 p-3 bg-muted/50 rounded-md">
                    <p><strong>User:</strong> {selectedRequest.userName} ({selectedRequest.userId} - {selectedRequest.userRole})</p>
                    <p><strong>Amount:</strong> ₦{selectedRequest.amount.toFixed(2)} ({selectedRequest.type})</p>
                    <div><strong>Requested:</strong> <ClientSideTime date={selectedRequest.requestedDate} /></div>
                    <p><strong>Method:</strong> {selectedRequest.paymentDetails.method} ({selectedRequest.paymentDetails.identifier})</p>
                    <p><strong>Recipient:</strong> {selectedRequest.paymentDetails.recipientName}</p>
                    <div><strong>Current Status:</strong> <Badge variant="outline" className={statusColors[selectedRequest.status]}>{selectedRequest.status}</Badge></div>
                    {selectedRequest.transactionId && <p><strong>Transaction ID:</strong> {selectedRequest.transactionId}</p>}
                    {selectedRequest.processedDate && <div><strong>Processed/Updated:</strong> <ClientSideTime date={selectedRequest.processedDate} /></div>}
                </div>
                {(currentAction === "mark_paid" || currentAction === "reject" || (!currentAction && selectedRequest?.adminNotes)) && (
                  <div className="space-y-1.5">
                    <Label htmlFor="adminNotes">
                        {currentAction === "mark_paid" && "Payment Transaction ID"}
                        {currentAction === "reject" && "Reason for Rejection/Failure"}
                        {!currentAction && selectedRequest?.adminNotes && "Admin Notes"}
                    </Label>
                    {currentAction === "mark_paid" ? (
                        <Input 
                            id="transactionId" 
                            placeholder="Enter payment transaction ID" 
                            value={transactionIdInput}
                            onChange={(e) => setTransactionIdInput(e.target.value)}
                            disabled={!currentAction} 
                        />
                    ) : (
                        <Textarea
                            id="adminNotes"
                            placeholder={currentAction === "reject" ? "Provide a clear reason..." : "Internal notes..."}
                            value={adminNotesInput}
                            onChange={(e) => setAdminNotesInput(e.target.value)}
                            rows={3}
                            disabled={!currentAction && !selectedRequest?.adminNotes}
                            readOnly={!currentAction && !!selectedRequest?.adminNotes}
                        />
                    )}
                  </div>
                )}
                {currentAction === 'approve' && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0"/>
                        <p className="text-sm">Approving this request will make it eligible for payment processing. Ensure details are correct.</p>
                    </div>
                )}
                {currentAction === 'mark_paid' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0"/>
                        <p className="text-sm">Marking as paid finalizes this transaction. Ensure payment has been successfully disbursed.</p>
                    </div>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                {currentAction && (
                  <Button onClick={handleConfirmAction}>
                    {currentAction === "approve" && "Confirm Approval"}
                    {currentAction === "mark_paid" && "Confirm Payment Sent"}
                    {currentAction === "reject" && "Confirm Rejection/Failure"}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
