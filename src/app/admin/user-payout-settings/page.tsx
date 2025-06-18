
"use client";

import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Banknote, Download, Search, Users2, Briefcase, Printer, Landmark, MoreHorizontal, Eye, Edit3 } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type UserPayoutRole = 'Student' | 'VA' | 'Print Center';
type PayoutMethod = 'Bank Transfer' | 'OPay' | 'PalmPay' | 'Moniepoint' | 'Paga' | 'Other Mobile Money';

interface UserPayoutDetail {
  id: string;
  userId: string;
  userName: string;
  userRole: UserPayoutRole;
  payoutMethod: PayoutMethod;
  bankNameOrProvider: string;
  accountNumberOrWalletId: string; // Full, unmasked number
  accountOrWalletName: string;
  dateDetailsLastUpdated: string;
}

const mockUserPayoutDetailsInitial: UserPayoutDetail[] = [
  { id: "UPD001", userId: "STD001", userName: "John Doe", userRole: "Student", payoutMethod: "OPay", bankNameOrProvider: "OPay Wallet", accountNumberOrWalletId: "08012345678", accountOrWalletName: "John Doe", dateDetailsLastUpdated: "2024-07-15" },
  { id: "UPD002", userId: "VA002", userName: "Chinedu Okoro", userRole: "VA", payoutMethod: "Bank Transfer", bankNameOrProvider: "Zenith Bank", accountNumberOrWalletId: "0123456789", accountOrWalletName: "Chinedu Okoro VA Services", dateDetailsLastUpdated: "2024-07-10" },
  { id: "UPD003", userId: "PC001", userName: "Speedy Prints", userRole: "Print Center", payoutMethod: "Bank Transfer", bankNameOrProvider: "Equity Bank", accountNumberOrWalletId: "9876543210", accountOrWalletName: "Speedy Prints CBD Ltd", dateDetailsLastUpdated: "2024-07-01" },
  { id: "UPD004", userId: "STD003", userName: "Bob Johnson", userRole: "Student", payoutMethod: "PalmPay", bankNameOrProvider: "PalmPay Wallet", accountNumberOrWalletId: "07098765432", accountOrWalletName: "Bob J.", dateDetailsLastUpdated: "2024-06-20" },
  { id: "UPD005", userId: "VA001", userName: "Aisha Bello", userRole: "VA", payoutMethod: "Bank Transfer", bankNameOrProvider: "GTBank", accountNumberOrWalletId: "1122334455", accountOrWalletName: "Aisha Bello", dateDetailsLastUpdated: "2024-05-15" },
];

const roleIcons: Record<UserPayoutRole, React.ElementType> = {
  "Student": Users2,
  "VA": Briefcase,
  "Print Center": Printer,
};

const payoutMethodOptions: PayoutMethod[] = ['Bank Transfer', 'OPay', 'PalmPay', 'Moniepoint', 'Paga', 'Other Mobile Money'];

export default function AdminUserPayoutSettingsPage() {
  const [payoutDetails, setPayoutDetails] = useState<UserPayoutDetail[]>(mockUserPayoutDetailsInitial);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserPayoutRole | "all">("all");
  
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserPayoutDetail | null>(null);

  // State for edit form
  const [editingMethod, setEditingMethod] = useState<PayoutMethod>("Bank Transfer");
  const [editingBankProvider, setEditingBankProvider] = useState("");
  const [editingAccountNumber, setEditingAccountNumber] = useState("");
  const [editingAccountName, setEditingAccountName] = useState("");
  
  const { toast } = useToast();

  const filteredDetails = useMemo(() => {
    return payoutDetails.filter(detail => {
      const matchesSearch = 
        detail.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.accountOrWalletName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.accountNumberOrWalletId.toLowerCase().includes(searchTerm.toLowerCase()); // Search full number
      const matchesRole = roleFilter === "all" || detail.userRole === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [payoutDetails, searchTerm, roleFilter]);

  const maskAccountNumber = (account: string, method: PayoutMethod) => {
    if (!account) return "N/A";
    if (method === "Bank Transfer" && account.length > 4) {
      return `******${account.slice(-4)}`;
    }
    if (account.length > 7 && (method === "OPay" || method === "PalmPay" || method === "Moniepoint" || method === "Paga" || method === "Other Mobile Money")) {
        return `${account.substring(0,4)}****${account.slice(-3)}`;
    }
    return account.length > 4 ? `******${account.slice(-4)}` : account; // Generic fallback
  }

  const openViewDialog = (user: UserPayoutDetail) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (user: UserPayoutDetail) => {
    setSelectedUser(user);
    setEditingMethod(user.payoutMethod);
    setEditingBankProvider(user.bankNameOrProvider);
    setEditingAccountNumber(user.accountNumberOrWalletId);
    setEditingAccountName(user.accountOrWalletName);
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedUser) return;

    if (!editingMethod || !editingBankProvider.trim() || !editingAccountNumber.trim() || !editingAccountName.trim()) {
        toast({title: "Missing Fields", description: "Please fill all required payout details.", variant: "destructive"});
        return;
    }

    setPayoutDetails(prevDetails =>
      prevDetails.map(detail =>
        detail.id === selectedUser.id
          ? {
              ...detail,
              payoutMethod: editingMethod,
              bankNameOrProvider: editingBankProvider,
              accountNumberOrWalletId: editingAccountNumber,
              accountOrWalletName: editingAccountName,
              dateDetailsLastUpdated: new Date().toISOString().split("T")[0],
            }
          : detail
      )
    );
    toast({
      title: "Payout Details Updated",
      description: `Details for ${selectedUser.userName} have been updated successfully.`,
    });
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };


  const handleDownloadCsv = () => {
    toast({
      title: "CSV Download Simulated",
      description: "User payout details CSV download has started (simulated).",
    });
  };
  

  return (
    <div className="space-y-8">
      <PageHeader 
        title="User Payout Account Details"
        description="View and manage the bank or mobile money account details users have saved for withdrawals."
        icon={Landmark}
      />
      <Card className="shadow-xl">
        <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <CardTitle className="font-headline">Registered Payout Accounts ({filteredDetails.length})</CardTitle>
                    <CardDescription>Search or filter by user role to find specific payout details.</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by User ID, Name, Account..." 
                            className="pl-8 w-full sm:w-64" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserPayoutRole | "all")}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            {Object.keys(roleIcons).map(role => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          {filteredDetails.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">
                <Banknote className="mx-auto h-12 w-12 mb-3"/>
                <p>No user payout details match your current filters or no details saved by users yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Payout Method</TableHead>
                    <TableHead>Bank/Provider</TableHead>
                    <TableHead>Account/Wallet No. (Masked)</TableHead>
                    <TableHead>Account/Wallet Name</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredDetails.map(detail => {
                    const RoleIcon = roleIcons[detail.userRole];
                    return (
                        <TableRow key={detail.id}>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <RoleIcon className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <span className="font-medium">{detail.userName}</span>
                                    <span className="block text-xs text-muted-foreground">({detail.userRole} - {detail.userId})</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{detail.payoutMethod}</Badge></TableCell>
                        <TableCell>{detail.bankNameOrProvider}</TableCell>
                        <TableCell className="font-mono text-xs">{maskAccountNumber(detail.accountNumberOrWalletId, detail.payoutMethod)}</TableCell>
                        <TableCell>{detail.accountOrWalletName}</TableCell>
                        <TableCell>{detail.dateDetailsLastUpdated}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openViewDialog(detail)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(detail)}>
                                <Edit3 className="mr-2 h-4 w-4" /> Edit Details
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
            <Button onClick={handleDownloadCsv} variant="outline">
                <Download className="mr-2 h-4 w-4"/> Download Filtered as CSV
            </Button>
        </CardFooter>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>View Payout Details: {selectedUser?.userName}</DialogTitle>
            <DialogDescription>
              User ID: {selectedUser?.userId} | Role: {selectedUser?.userRole}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-3 py-4 text-sm">
              <div><strong>Payout Method:</strong> {selectedUser.payoutMethod}</div>
              <div><strong>Bank/Provider:</strong> {selectedUser.bankNameOrProvider}</div>
              <div><strong>Account/Wallet Number:</strong> <span className="font-mono bg-muted px-1 rounded">{selectedUser.accountNumberOrWalletId}</span></div>
              <div><strong>Account/Wallet Name:</strong> {selectedUser.accountOrWalletName}</div>
              <div><strong>Last Updated:</strong> {selectedUser.dateDetailsLastUpdated}</div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Details Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Payout Details: {selectedUser?.userName}</DialogTitle>
            <DialogDescription>
              Modify the payout information for User ID: {selectedUser?.userId}.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="editPayoutMethod">Payout Method</Label>
                <Select value={editingMethod} onValueChange={(value) => setEditingMethod(value as PayoutMethod)}>
                  <SelectTrigger id="editPayoutMethod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {payoutMethodOptions.map(method => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editBankProvider">Bank Name / Provider</Label>
                <Input id="editBankProvider" value={editingBankProvider} onChange={(e) => setEditingBankProvider(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editAccountNumber">Account Number / Wallet ID</Label>
                <Input id="editAccountNumber" value={editingAccountNumber} onChange={(e) => setEditingAccountNumber(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editAccountName">Account/Wallet Name</Label>
                <Input id="editAccountName" value={editingAccountName} onChange={(e) => setEditingAccountName(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
