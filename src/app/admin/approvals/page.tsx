import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, Check, X } from "lucide-react";

const pendingApprovals = [
  { id: "USR001", name: "John Doe", email: "john.doe@example.com", dateRegistered: "2024-07-15" },
  { id: "USR002", name: "Alice Smith", email: "alice.smith@example.com", dateRegistered: "2024-07-14" },
  { id: "USR003", name: "Bob Johnson", email: "bob.johnson@example.com", dateRegistered: "2024-07-13" },
];

export default function AdminApprovalsPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Account Approvals"
        description="Review and approve or reject new user registrations."
        icon={ShieldCheck}
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Pending User Accounts</CardTitle>
          <CardDescription>There are {pendingApprovals.length} accounts awaiting approval.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date Registered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingApprovals.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.dateRegistered}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
                      <Check className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
                      <X className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
               {pendingApprovals.length === 0 && (
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
