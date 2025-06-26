
"use client";

import { Suspense, useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, ShieldCheck, Users, Briefcase, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";


type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
type ApprovalRole = 'Student' | 'VA' | 'Print Center';

interface ApprovalRequest {
  id: string;
  name: string;
  email: string;
  role: ApprovalRole;
  dateApplied: string;
  status: ApprovalStatus;
}

const initialApprovalRequests: ApprovalRequest[] = [
  { id: "APP001", name: "Eva Williams", email: "eva.williams@example.com", role: "Student", dateApplied: "2024-07-26", status: "Pending" },
  { id: "APP002", name: "David Lee", email: "david.lee.va@example.com", role: "VA", dateApplied: "2024-07-25", status: "Pending" },
  { id: "APP003", name: "Inkwell Stationers", email: "info@inkwell.com", role: "Print Center", dateApplied: "2024-07-25", status: "Pending" },
  { id: "APP004", name: "Michael Chen", email: "michael.c@example.com", role: "Student", dateApplied: "2024-07-24", status: "Pending" },
];

const roleIcons: Record<ApprovalRole, React.ElementType> = {
  'Student': Users,
  'VA': Briefcase,
  'Print Center': Printer
};

const roleColors: Record<ApprovalRole, string> = {
  "Student": "bg-blue-100 text-blue-700 border-blue-300",
  "VA": "bg-purple-100 text-purple-700 border-purple-300",
  "Print Center": "bg-teal-100 text-teal-700 border-teal-300",
};


function AdminApprovalsPageComponent() {
  const [requests, setRequests] = useState<ApprovalRequest[]>(initialApprovalRequests);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const { toast } = useToast();

  const pendingRequests = useMemo(() => requests.filter(r => r.status === 'Pending'), [requests]);
  const processedRequests = useMemo(() => requests.filter(r => r.status !== 'Pending'), [requests]);
  
  const handleActionClick = (request: ApprovalRequest, type: "approve" | "reject") => {
    setSelectedRequest(request);
    setAction(type);
  };
  
  const handleConfirmAction = () => {
    if (!selectedRequest || !action) return;
    
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? {...r, status: action === 'approve' ? 'Approved' : 'Rejected'} : r));
    
    toast({
      title: `Account ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `The application for ${selectedRequest.name} has been ${action}.`,
      variant: action === 'reject' ? 'destructive' : 'default',
    });
    
    setSelectedRequest(null);
    setAction(null);
  };


  const renderTable = (data: ApprovalRequest[], title: string, description: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{title} ({data.length})</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No requests in this category.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead>Status / Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(req => {
                const RoleIcon = roleIcons[req.role];
                return (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.name}</TableCell>
                    <TableCell>{req.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleColors[req.role]}>
                        <RoleIcon className="mr-1.5 h-3.5 w-3.5"/>
                        {req.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(req.dateApplied), "PPP")}</TableCell>
                    <TableCell>
                      {req.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => handleActionClick(req, 'approve')}>
                            <Check className="h-4 w-4 mr-1"/> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleActionClick(req, 'reject')}>
                            <X className="h-4 w-4 mr-1"/> Reject
                          </Button>
                        </div>
                      ) : (
                        <Badge variant={req.status === 'Approved' ? 'default' : 'destructive'} className={req.status === 'Approved' ? 'bg-green-500' : ''}>{req.status}</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Account Approvals"
        description="Review and approve new Students, VAs, and Print Centers."
        icon={ShieldCheck}
      />

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
            <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="processed">Processed ({processedRequests.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
            {renderTable(pendingRequests, "Pending Applications", "These applications are awaiting your review.")}
        </TabsContent>
         <TabsContent value="processed">
            {renderTable(processedRequests, "Processed Applications", "These applications have already been approved or rejected.")}
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={!!(selectedRequest && action)} onOpenChange={() => {setSelectedRequest(null); setAction(null)}}>
        <AlertDialogContent>
          {selectedRequest && action && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm {action === 'approve' ? 'Approval' : 'Rejection'}</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to {action} the application for <strong>{selectedRequest.name}</strong> ({selectedRequest.role})? This action will notify the user.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmAction} className={action === 'reject' ? 'bg-destructive hover:bg-destructive/90' : ''}>
                  Yes, {action}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ApprovalsPage() {
  return (
    <AdminApprovalsPageComponent />
  );
}
