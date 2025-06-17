
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Check, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PendingApprovalUser {
  id: string;
  name: string;
  email: string;
  dateRegistered: string;
  type: 'Student' | 'VA' | 'Print Center';
}

const initialPendingApprovals: PendingApprovalUser[] = [
  { id: "USR001", name: "John Doe", email: "john.doe@example.com", dateRegistered: "2024-07-15", type: "Student" },
  { id: "USR002", name: "Alice Smith", email: "alice.smith@example.com", dateRegistered: "2024-07-14", type: "Student" },
  { id: "USR003", name: "Bob Johnson", email: "bob.johnson@example.com", dateRegistered: "2024-07-13", type: "Student" },
  { id: "VA005", name: "Virtual Pro Services", email: "va.pro@example.com", dateRegistered: "2024-07-12", type: "VA" },
  { id: "PC004", name: "Alpha Prints", email: "alpha.prints@example.com", dateRegistered: "2024-07-11", type: "Print Center" },
  { id: "USR006", name: "Eva Green", email: "eva.green@example.com", dateRegistered: "2024-07-16", type: "Student" },
];

export default function AdminApprovalsPage() {
  const [approvals, setApprovals] = useState<PendingApprovalUser[]>(initialPendingApprovals);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const { toast } = useToast();

  const handleToggleSelectUser = (userId: string) => {
    setSelectedUserIds(prevSelected =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedUserIds.length === approvals.length && approvals.length > 0) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(approvals.map(user => user.id));
    }
  };

  const handleApprove = (userId: string, userName: string) => {
    setApprovals(prevApprovals => prevApprovals.filter(user => user.id !== userId));
    setSelectedUserIds(prevSelected => prevSelected.filter(id => id !== userId));
    toast({
      title: "Account Approved",
      description: `User ${userName} has been approved successfully.`,
    });
  };

  const handleReject = (userId: string, userName: string) => {
    setApprovals(prevApprovals => prevApprovals.filter(user => user.id !== userId));
    setSelectedUserIds(prevSelected => prevSelected.filter(id => id !== userId));
    toast({
      title: "Account Rejected",
      description: `User ${userName} has been rejected.`,
      variant: "destructive", 
    });
  };

  const handleApproveSelected = () => {
    if (selectedUserIds.length === 0) {
      toast({ title: "No users selected", description: "Please select users to approve.", variant: "destructive" });
      return;
    }
    setApprovals(prevApprovals =>
      prevApprovals.filter(user => !selectedUserIds.includes(user.id))
    );
    toast({
      title: "Selected Accounts Approved",
      description: `${selectedUserIds.length} account(s) have been approved.`,
    });
    setSelectedUserIds([]);
  };

  const handleRejectSelected = () => {
    if (selectedUserIds.length === 0) {
      toast({ title: "No users selected", description: "Please select users to reject.", variant: "destructive" });
      return;
    }
    setApprovals(prevApprovals =>
      prevApprovals.filter(user => !selectedUserIds.includes(user.id))
    );
    toast({
      title: "Selected Accounts Rejected",
      description: `${selectedUserIds.length} account(s) have been rejected.`,
      variant: "destructive",
    });
    setSelectedUserIds([]);
  };

  const isAllSelected = approvals.length > 0 && selectedUserIds.length === approvals.length;
  const isSomeSelected = selectedUserIds.length > 0 && selectedUserIds.length < approvals.length;


  return (
    <div className="space-y-8">
      <PageHeader 
        title="Account Approvals"
        description="Review and approve or reject new user, VA, and Print Center registrations."
        icon={ShieldCheck}
      />
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="font-headline">Pending Registrations</CardTitle>
              <CardDescription>
                {approvals.length} account{approvals.length === 1 ? "" : "s"} awaiting approval.
                {selectedUserIds.length > 0 && ` (${selectedUserIds.length} selected)`}
              </CardDescription>
            </div>
            {selectedUserIds.length > 0 && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleApproveSelected}
                  className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                >
                  <Check className="mr-2 h-4 w-4" /> Approve Selected ({selectedUserIds.length})
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleRejectSelected}
                  className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="mr-2 h-4 w-4" /> Reject Selected ({selectedUserIds.length})
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleToggleSelectAll}
                    aria-label="Select all rows"
                    disabled={approvals.length === 0}
                    data-state={isSomeSelected ? 'indeterminate' : (isAllSelected ? 'checked' : 'unchecked')}
                  />
                </TableHead>
                <TableHead>Applicant ID</TableHead>
                <TableHead>Name / Entity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date Registered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map(user => (
                <TableRow key={user.id} data-state={selectedUserIds.includes(user.id) ? "selected" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUserIds.includes(user.id)}
                      onCheckedChange={() => handleToggleSelectUser(user.id)}
                      aria-label={`Select row for ${user.name}`}
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.dateRegistered}</TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                      onClick={() => handleApprove(user.id, user.name)}
                    >
                      <Check className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleReject(user.id, user.name)}
                    >
                      <X className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {approvals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No pending account approvals.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
