
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Signal, Eye, MoreHorizontal, Zap, MinusCircle, AlertTriangle, Paperclip } from "lucide-react";
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
import { cn } from "@/lib/utils";

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

const mockAdminTasksInitial: AdminTask[] = [
  { id: "TSK101", title: "Market Analysis Report Q3", studentName: "John Doe", studentId: "STD001", submittedDate: "2024-07-25", type: "Report", pages: 20, description: "Detailed market analysis for tech sector, Q3 2024.", attachments: [{name:"brief.pdf", url:"#"}], status: "Pending VA Assignment", adminSetPriceNGN: 200, paymentStatus: "Unpaid", assignedVaId: null, assignedVaName: null, deadline: "2024-08-10" },
  { id: "TSK102", title: "App UI Design - Fitness Tracker", studentName: "Alice Smith", studentId: "STD002", submittedDate: "2024-07-24", type: "Design", pages: 10, description: "Design 10 screens for a mobile fitness tracking app.", attachments: [{name:"wireframes.fig", url:"#"}], status: "Pending VA Assignment", adminSetPriceNGN: 150, paymentStatus: "Unpaid", assignedVaId: null, assignedVaName: null, deadline: "2024-08-05" },
  { id: "TSK103", title: "Thesis Chapter 3 - Methodology", studentName: "Bob Johnson", studentId: "STD003", submittedDate: "2024-07-22", type: "Research", pages: 30, description: "Write methodology chapter for PhD thesis.", attachments: [], status: "Awaiting Student Payment", adminSetPriceNGN: 250, paymentStatus: "Unpaid", assignedVaId: "VA001", assignedVaName: "Aisha Bello", deadline: "2024-08-20" }, // Not live
];

// Copied from admin/tasks/page.tsx for consistent dialog styling
const adminTaskStatusColors: Record<AdminTaskStatus, string> = {
  "Pending Admin Review": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Pending VA Assignment": "bg-orange-100 text-orange-700 border-orange-300",
  "Pending VA Acceptance": "bg-cyan-100 text-cyan-700 border-cyan-300",
  "Rejected by VA": "bg-pink-100 text-pink-700 border-pink-300",
  "Awaiting Student Payment": "bg-blue-100 text-blue-700 border-blue-300",
  "In Progress with VA": "bg-indigo-100 text-indigo-700 border-indigo-300",
  "Work Submitted by VA": "bg-purple-100 text-purple-700 border-purple-300",
  "Revision Requested (to VA)": "bg-pink-100 text-pink-700 border-pink-300",
  "Completed": "bg-green-100 text-green-700 border-green-300",
  "Rejected by Admin": "bg-red-100 text-red-700 border-red-300",
  "Cancelled": "bg-gray-100 text-gray-700 border-gray-300",
};


export default function AdminLiveTasksPage() {
  const [allTasks, setAllTasks] = useState<AdminTask[]>(mockAdminTasksInitial);
  const { toast } = useToast();
  const [taskToWithdraw, setTaskToWithdraw] = useState<AdminTask | null>(null);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [selectedTaskToView, setSelectedTaskToView] = useState<AdminTask | null>(null);

  const liveTasks = useMemo(() => {
    return allTasks.filter(task => task.status === "Pending VA Assignment");
  }, [allTasks]);

  const openViewDialog = (task: AdminTask) => {
    setSelectedTaskToView(task);
    setIsViewDetailsDialogOpen(true);
  };

  const handleWithdrawTask = () => {
    if (!taskToWithdraw) return;
    
    setAllTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskToWithdraw.id 
          ? { ...task, status: "Pending Admin Review" } 
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
                      <TableCell>{task.submittedDate ? format(new Date(task.submittedDate), "PPP") : 'N/A'}</TableCell>
                      <TableCell>{task.adminSetPriceNGN ? `₦${task.adminSetPriceNGN.toFixed(2)}` : "Not Set"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openViewDialog(task)}>
                              <Eye className="mr-2 h-4 w-4" /> View Full Task
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

      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Task Details: {selectedTaskToView?.title} (ID: {selectedTaskToView?.id})</DialogTitle>
            <DialogDescription>Comprehensive overview of the task.</DialogDescription>
          </DialogHeader>
          {selectedTaskToView && (
            <ScrollArea className="max-h-[70vh] pr-3">
              <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                      <h4 className="font-semibold text-primary">Task Information</h4>
                      <div><strong className="text-muted-foreground">Student:</strong> {selectedTaskToView.studentName} ({selectedTaskToView.studentId})</div>
                      <div><strong className="text-muted-foreground">Submitted:</strong> {selectedTaskToView.submittedDate ? format(new Date(selectedTaskToView.submittedDate), "PPP") : 'N/A'}</div>
                      <div><strong className="text-muted-foreground">Type:</strong> {selectedTaskToView.type}</div>
                      <div><strong className="text-muted-foreground">Pages/Units:</strong> {selectedTaskToView.pages}</div>
                      <div><strong className="text-muted-foreground">Deadline:</strong> {selectedTaskToView.deadline ? format(new Date(selectedTaskToView.deadline), "PPP") : "Not set"}</div>
                      <div><strong className="text-muted-foreground">Description:</strong></div>
                      <div className="text-sm bg-muted/30 p-2 rounded whitespace-pre-wrap">{selectedTaskToView.description}</div>
                      {selectedTaskToView.attachments && selectedTaskToView.attachments.length > 0 && (
                          <div>
                          <strong className="text-muted-foreground">Attachments:</strong>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                              {selectedTaskToView.attachments.map(att => (
                                <li key={att.name}>
                                  <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center">
                                    <Paperclip className="h-4 w-4 mr-1.5 shrink-0"/> {att.name}
                                  </a>
                                </li>
                              ))}
                          </ul>
                          </div>
                      )}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                      <h4 className="font-semibold text-primary">Pricing & Payment</h4>
                      <div><strong className="text-muted-foreground">Admin Set Price:</strong> {selectedTaskToView.adminSetPriceNGN ? `₦${selectedTaskToView.adminSetPriceNGN.toFixed(2)}` : "Not Set"}</div>
                      <div><strong className="text-muted-foreground">Payment Status:</strong> <Badge variant={selectedTaskToView.paymentStatus === "Paid by Student" || selectedTaskToView.paymentStatus === "VA Paid" ? "default" : "outline"} className={cn(selectedTaskToView.paymentStatus === "Paid by Student" || selectedTaskToView.paymentStatus === "VA Paid" ? "bg-green-500 text-white" : "")}>{selectedTaskToView.paymentStatus}</Badge></div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                      <h4 className="font-semibold text-primary">Assignment & Progress</h4>
                      <div>
                        <strong className="text-muted-foreground">Current Status:</strong> 
                        <Badge variant="outline" className={`text-xs ml-1 ${adminTaskStatusColors[selectedTaskToView.status]}`}>
                          {selectedTaskToView.status}
                        </Badge>
                      </div>
                      <div><strong className="text-muted-foreground">Assigned VA:</strong> {selectedTaskToView.assignedVaName || "Not Assigned"} (ID: {selectedTaskToView.assignedVaId || "N/A"})</div>
                      {selectedTaskToView.status === "Rejected by VA" && selectedTaskToView.vaRejectionReason && (
                          <div><strong className="text-muted-foreground">VA Rejection Reason:</strong> <span className="text-pink-700">{selectedTaskToView.vaRejectionReason}</span></div>
                      )}
                      {selectedTaskToView.vaSubmissionDate && (
                          <>
                              <div><strong className="text-muted-foreground">VA Submission Date:</strong> {format(new Date(selectedTaskToView.vaSubmissionDate), "PPP")}</div>
                              <div><strong className="text-muted-foreground">VA Submission Notes:</strong></div>
                              <div className="text-sm bg-muted/30 p-2 rounded whitespace-pre-wrap">{selectedTaskToView.vaSubmissionNotes || "No notes from VA."}</div>
                              {selectedTaskToView.vaSubmissionAttachments && selectedTaskToView.vaSubmissionAttachments.length > 0 && (
                                  <div>
                                  <strong className="text-muted-foreground">VA Attachments:</strong>
                                  <ul className="list-disc pl-5 text-sm space-y-1">
                                      {selectedTaskToView.vaSubmissionAttachments.map(att => (
                                        <li key={att.name}>
                                          <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center">
                                            <Paperclip className="h-4 w-4 mr-1.5 shrink-0"/> {att.name}
                                          </a>
                                        </li>
                                      ))}
                                  </ul>
                                  </div>
                              )}
                          </>
                      )}
                      {selectedTaskToView.completionDate && <div><strong className="text-muted-foreground">Completion Date:</strong> {format(new Date(selectedTaskToView.completionDate), "PPP")}</div>}
                  </div>
                  {selectedTaskToView.adminNotes && (
                      <>
                          <Separator />
                          <div className="space-y-2">
                              <h4 className="font-semibold text-primary">Admin Notes</h4>
                              <div className="text-sm bg-muted/30 p-2 rounded whitespace-pre-wrap">{selectedTaskToView.adminNotes}</div>
                          </div>
                      </>
                  )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
