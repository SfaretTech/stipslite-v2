
"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Banknote, Download, Search, Users2, Briefcase, Printer, Landmark } from "lucide-react"; // Added Users2, Briefcase, Printer for role icons
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
  accountNumberOrWalletId: string; // Masked for display
  accountOrWalletName: string;
  dateDetailsLastUpdated: string;
}

const mockUserPayoutDetailsInitial: UserPayoutDetail[] = [
  { id: "UPD001", userId: "STD001", userName: "John Doe", userRole: "Student", payoutMethod: "OPay", bankNameOrProvider: "OPay Wallet", accountNumberOrWalletId: "0801****678", accountOrWalletName: "John Doe", dateDetailsLastUpdated: "2024-07-15" },
  { id: "UPD002", userId: "VA002", userName: "Chinedu Okoro", userRole: "VA", payoutMethod: "Bank Transfer", bankNameOrProvider: "Zenith Bank", accountNumberOrWalletId: "******7890", accountOrWalletName: "Chinedu Okoro VA Services", dateDetailsLastUpdated: "2024-07-10" },
  { id: "UPD003", userId: "PC001", userName: "Speedy Prints", userRole: "Print Center", payoutMethod: "Bank Transfer", bankNameOrProvider: "Equity Bank", accountNumberOrWalletId: "******0123", accountOrWalletName: "Speedy Prints CBD Ltd", dateDetailsLastUpdated: "2024-07-01" },
  { id: "UPD004", userId: "STD003", userName: "Bob Johnson", userRole: "Student", payoutMethod: "PalmPay", bankNameOrProvider: "PalmPay Wallet", accountNumberOrWalletId: "0709****432", accountOrWalletName: "Bob J.", dateDetailsLastUpdated: "2024-06-20" },
  { id: "UPD005", userId: "VA001", userName: "Aisha Bello", userRole: "VA", payoutMethod: "Bank Transfer", bankNameOrProvider: "GTBank", accountNumberOrWalletId: "******1234", accountOrWalletName: "Aisha Bello", dateDetailsLastUpdated: "2024-05-15" },
];

const roleIcons: Record<UserPayoutRole, React.ElementType> = {
  "Student": Users2,
  "VA": Briefcase,
  "Print Center": Printer,
};

const roleColors: Record<UserPayoutRole, string> = {
  "Student": "bg-blue-100 text-blue-700 border-blue-300",
  "VA": "bg-purple-100 text-purple-700 border-purple-300",
  "Print Center": "bg-teal-100 text-teal-700 border-teal-300",
};


export default function AdminUserPayoutSettingsPage() {
  const [payoutDetails, setPayoutDetails] = useState<UserPayoutDetail[]>(mockUserPayoutDetailsInitial);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserPayoutRole | "all">("all");
  const { toast } = useToast();

  const filteredDetails = useMemo(() => {
    return payoutDetails.filter(detail => {
      const matchesSearch = 
        detail.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.accountOrWalletName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.accountNumberOrWalletId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || detail.userRole === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [payoutDetails, searchTerm, roleFilter]);

  const handleDownloadCsv = () => {
    // In a real app, this would generate and download a CSV file of `filteredDetails`
    toast({
      title: "CSV Download Simulated",
      description: "User payout details CSV download has started (simulated).",
    });
  };
  
  const maskAccountNumber = (account: string, method: PayoutMethod) => {
    if (method === "Bank Transfer" && account.length > 4) {
      return `******${account.slice(-4)}`;
    }
    if (account.length > 7 && (method === "OPay" || method === "PalmPay" || method === "Moniepoint" || method === "Paga" || method === "Other Mobile Money")) {
        return `${account.substring(0,4)}****${account.slice(-3)}`;
    }
    return account;
  }

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
                    <TableHead>Account/Wallet No.</TableHead>
                    <TableHead>Account/Wallet Name</TableHead>
                    <TableHead>Last Updated</TableHead>
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
    </div>
  );
}
