
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PendingApprovalUser {
  id: string;
  name: string;
  email: string;
  dateRegistered: string;
}

const initialPendingApprovals: PendingApprovalUser[] = [
  { id: "USR001", name: "John Doe", email: "john.doe@example.com", dateRegistered: "2024-07-15" },
  { id: "USR002", name: "Alice Smith", email: "alice.smith@example.com", dateRegistered: "2024-07-14" },
  { id: "USR003", name: "Bob Johnson", email: "bob.johnson@example.com", dateRegistered: "2024-07-13" },
  { id: "VA005", name: "Virtual Pro Services (VA Applicant)", email: "va.pro@example.com", dateRegistered: "2024-07-12" },
  { id: "PC004", name: "Alpha Prints (Print Center Applicant)", email: "alpha.prints@example.com", dateRegistered: "2024-07-11" },
];

export default function AdminApprovalsPage() {
  const [approvals, setApprovals] = useState<PendingApprovalUser[]>(initialPendingApprovals);
  const { toast } = useToast();

  const handleApprove = (userId: string) => {
    const userToApprove = approvals.find(user => user.id === userId);
    if (!userToApprove) return;

    setApprovals(prevApprovals => prevApprovals.filter(user => user.id !== userId));
    toast({
      title: "Account Approved",
      description: `User ${userToApprove.name} has been approved successfully.`,
    });
  };

  const handleReject = (userId: string) => {
    const userToReject = approvals.find(user => user.id === userId);
    if (!userToReject) return;

    setApprovals(prevApprovals => prevApprovals.filter(user => user.id !== userId));
    toast({
      title: "Account Rejected",
      description: `User ${userToReject.name} has been rejected.`,
      variant: "destructive", 
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Account Approvals"
        description="Review and approve or reject new user, VA, and Print Center registrations."
        icon={ShieldCheck}
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Pending Registrations</CardTitle>
          <CardDescription>There are {approvals.length} account{approvals.length === 1 ? "" : "s"} awaiting approval.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant ID</TableHead>
                <TableHead>Name / Entity</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date Registered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.dateRegistered}</TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                      onClick={() => handleApprove(user.id)}
                    >
                      <Check className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleReject(user.id)}
                    >
                      <X className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {approvals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
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
