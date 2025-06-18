
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Signal, Eye, MoreHorizontal, Zap, MinusCircle, AlertTriangle } from "lucide-react";
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

// Re-use and adapt relevant parts from admin/tasks/page.tsx
type AdminTaskStatus =
  | "Pending Admin Review"
  | "Pending VA Assignment"
  | "Pending VA Acceptance"
  | "Rejected by VA"
  | "Awaiting Student Payment"
  | "In Progress with VA"
  | "Work Submitted by VA"
  | "Completed"
  | "Rejected by Admin"
  | "Cancelled"
  | "Revision Requested (to VA)";

interface AdminTask {
  id: string;
  title: string;
  studentName: string;
  studentId: string;
  submittedDate: string;
  type: string;
  pages: number;
  description: string;
  attachments: { name: string; url: string }[];
  status: AdminTaskStatus;
  adminSetPriceNGN: number | null;
  paymentStatus: "Unpaid" | "Paid by Student" | "VA Payout Pending" | "VA Paid" | "Refunded";
  assignedVaId: string | null;
  assignedVaName: string | null;
  adminNotes?: string;
  vaRejectionReason?: string;
  vaSubmissionDate?: string | null;
  vaSubmissionNotes?: string;
  vaSubmissionAttachments?: { name: string; url: string }[];
  deadline?: string;
  completionDate?: string;
}

// Mock data for live tasks (tasks pending VA assignment)
// This should ideally come from a shared state or service, but for UI, we'll use a filtered version
const mockAdminTasksInitial: AdminTask[] = [
  { id: "TSK101", title: "Market Analysis Report Q3", studentName: "John Doe", studentId: "STD001", submittedDate: "2024-07-25", type: "Report", pages: 20, description: "Detailed market analysis for tech sector, Q3 2024.", attachments: [], status: "Pending VA Assignment", adminSetPriceNGN: 200, paymentStatus: "Unpaid", assignedVaId: null, assignedVaName: null, deadline: "2024-08-10" },
  { id: "TSK102", title: "App UI Design - Fitness Tracker", studentName: "Alice Smith", studentId: "STD002", submittedDate: "2024-07-24", type: "Design", pages: 10, description: "Design 10 screens for a mobile fitness tracking app.", attachments: [], status: "Pending VA Assignment", adminSetPriceNGN: 150, paymentStatus: "Unpaid", assignedVaId: null, assignedVaName: null, deadline: "2024-08-05" },
  { id: "TSK103", title: "Thesis Chapter 3 - Methodology", studentName: "Bob Johnson", studentId: "STD003", submittedDate: "2024-07-22", type: "Research", pages: 30, description: "Write methodology chapter for PhD thesis.", attachments: [], status: "Awaiting Student Payment", adminSetPriceNGN: 250, paymentStatus: "Unpaid", assignedVaId: "VA001", assignedVaName: "Aisha Bello", deadline: "2024-08-20" }, // Not live
];


export default function AdminLiveTasksPage() {
  const [allTasks, setAllTasks] = useState<AdminTask[]>(mockAdminTasksInitial);
  const { toast } = useToast();
  const [taskToWithdraw, setTaskToWithdraw] = useState<AdminTask | null>(null);

  const liveTasks = useMemo(() => {
    return allTasks.filter(task => task.status === "Pending VA Assignment");
  }, [allTasks]);

  const handleWithdrawTask = () => {
    if (!taskToWithdraw) return;
    
    setAllTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskToWithdraw.id 
          ? { ...task, status: "Pending Admin Review" } // Example: return to admin review pool
          : task
      )
    );
    toast({
      title: "Task Withdrawn",
      description: `Task "${taskToWithdraw.title}" has been withdrawn from the live pool and returned to admin review.`,
    });
    setTaskToWithdraw(null);
  };

  const handleBoostVisibility = (task: AdminTask) => {
    toast({
      title: "Visibility Boosted (Simulated)",
      description: `Task "${task.title}" has been prioritized in the live pool.`,
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Live Platform Tasks"
        description="Monitor tasks currently open for VA assignment and manage their visibility."
        icon={Signal}
      />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Live Tasks ({liveTasks.length})</CardTitle>
          <CardDescription>These tasks are awaiting VA assignment from the general pool.</CardDescription>
        </CardHeader>
        <CardContent>
          {liveTasks.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Signal className="mx-auto h-12 w-12 mb-3" />
              <p>No tasks are currently live for VA assignment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Price (Set by Admin)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveTasks.map(task => (
                    <TableRow key={task.id}>
                      <TableCell className="font-mono text-xs">{task.id}</TableCell>
                      <TableCell className="font-medium max-w-xs truncate">{task.title}</TableCell>
                      <TableCell>{task.studentName} ({task.studentId})</TableCell>
                      <TableCell>{task.submittedDate}</TableCell>
                      <TableCell>{task.adminSetPriceNGN ? `₦${task.adminSetPriceNGN.toFixed(2)}` : "Not Set"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/tasks/${task.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> View Full Task
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBoostVisibility(task)}>
                              <Zap className="mr-2 h-4 w-4" /> Boost Visibility
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTaskToWithdraw(task)} className="text-orange-600 focus:text-orange-700 focus:bg-orange-50">
                              <MinusCircle className="mr-2 h-4 w-4" /> Withdraw from Live Pool
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!taskToWithdraw} onOpenChange={() => setTaskToWithdraw(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Withdraw Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw task: <strong>{taskToWithdraw?.title}</strong> (ID: {taskToWithdraw?.id}) from the live pool? 
              It will be returned to "Pending Admin Review" status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleWithdrawTask} className="bg-orange-600 hover:bg-orange-700 text-white">
              Yes, Withdraw Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
