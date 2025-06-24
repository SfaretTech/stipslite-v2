
"use client";

import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
} from "@/components/ui/dialog"; // Removed DialogClose
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Check, X, Eye, DollarSign, UserCheck, FileText, MoreHorizontal, Search, Paperclip, MessageSquare, AlertTriangle, Send, UserX, RefreshCw, Loader2, Info } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

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
  deadline?: string | null; 
  completionDate?: string | null; 
}

const initialMockTasks: AdminTask[] = [
    { id: "TSK001", title: "Literature Review on AI Ethics", studentName: "John Doe", studentId: "STD001", submittedDate: "2024-07-25", type: "Research", pages: 15, description: "A detailed literature review on the ethical implications of AI in modern society.", attachments: [{name: "guidelines.pdf", url: "#"}], status: "Pending Admin Review", adminSetPriceNGN: null, paymentStatus: "Unpaid", assignedVaId: null, assignedVaName: null, deadline: "2024-08-10" },
    { id: "TSK002", title: "Business Plan for a Startup", studentName: "Alice Smith", studentId: "STD002", submittedDate: "2024-07-24", type: "Business", pages: 30, description: "Develop a comprehensive business plan for a new tech startup.", attachments: [], status: "Pending VA Assignment", adminSetPriceNGN: 250, paymentStatus: "Paid by Student", assignedVaId: null, assignedVaName: null, deadline: "2024-08-15" },
    { id: "TSK003", title: "Data Analysis Project", studentName: "Bob Johnson", studentId: "STD003", submittedDate: "2024-07-23", type: "Data Analysis", pages: 10, description: "Analyze the provided dataset using Python and generate a report.", attachments: [{name:"dataset.csv", url:"#"}], status: "In Progress with VA", adminSetPriceNGN: 150, paymentStatus: "Paid by Student", assignedVaId: "VA001", assignedVaName: "Aisha Bello", deadline: "2024-08-05" },
    { id: "TSK004", title: "Presentation Slides Design", studentName: "Emily White", studentId: "STD004", submittedDate: "2024-07-22", type: "Design", pages: 20, description: "Create 20 visually appealing slides for a marketing presentation.", attachments: [], status: "Completed", adminSetPriceNGN: 100, paymentStatus: "VA Paid", assignedVaId: "VA002", assignedVaName: "Chinedu Okoro", completionDate: "2024-07-25" },
];


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

const mockVAs = [ 
    { id: "VA001", name: "Aisha Bello (Academic Writing)" },
    { id: "VA002", name: "Chinedu Okoro (Technical & STEM)" },
    { id: "VA003", name: "Fatima Diallo (Business & Presentations)" },
    { id: "VA004", name: "David Adebayo (General Support)" },
];


export default function AdminTasksPage() {
  const [allTasks, setAllTasks] = useState<AdminTask[]>(initialMockTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminTaskStatus | "all">("all");
  const [selectedTask, setSelectedTask] = useState<AdminTask | null>(null);
  
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isReviewPriceOpen, setIsReviewPriceOpen] = useState(false);
  const [isAssignVaOpen, setIsAssignVaOpen] = useState(false);
  const [isConfirmPaymentOpen, setIsConfirmPaymentOpen] = useState(false);
  const [isReviewVaWorkOpen, setIsReviewVaWorkOpen] = useState(false);
  const [isCancelTaskOpen, setIsCancelTaskOpen] = useState(false);

  const [adminPriceInput, setAdminPriceInput] = useState("");
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [selectedVaForAssignment, setSelectedVaForAssignment] = useState<string | undefined>();
  const [adminReviewNotesInput, setAdminReviewNotesInput] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false); 

  const { toast } = useToast();

  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      const matchesSearch = 
        task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.assignedVaName && task.assignedVaName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allTasks, searchTerm, statusFilter]);

  const openDialog = (dialogSetter: React.Dispatch<React.SetStateAction<boolean>>, task: AdminTask) => {
    setSelectedTask(task);
    setAdminPriceInput(task.adminSetPriceNGN?.toString() || "");
    setAdminNotesInput(task.adminNotes || "");
    setAdminReviewNotesInput(""); 
    setSelectedVaForAssignment(task.assignedVaId || undefined);
    dialogSetter(true);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<AdminTask>) => {
    // TODO: Re-implement Firestore update logic here
    console.log(`Simulating update for task ${taskId} with:`, updates);
    setAllTasks(prev => prev.map(task => task.id === taskId ? { ...task, ...updates } : task));
    return true;
  };

  const handleApproveTask = async () => {
    if (!selectedTask || !adminPriceInput) {
      toast({ title: "Price Required", description: "Please set a price before approving.", variant: "destructive" });
      return;
    }
    const price = parseFloat(adminPriceInput);
    if (isNaN(price) || price <= 0) {
       toast({ title: "Invalid Price", description: "Please enter a valid positive price.", variant: "destructive" });
       return;
    }
    const success = handleUpdateTask(selectedTask.id, { status: "Pending VA Assignment", adminSetPriceNGN: price, adminNotes: adminNotesInput });
    if (success) {
        toast({ title: "Task Approved", description: `${selectedTask.title} approved with price ₦${price}. Ready for VA assignment.` });
        setIsReviewPriceOpen(false);
    }
  };

  const handleRejectTask = async () => {
    if (!selectedTask) return;
    if (!adminNotesInput.trim()) {
        toast({ title: "Rejection Note Required", description: "Please provide a reason/note for rejecting the task.", variant: "destructive" });
        return;
    }
    const success = handleUpdateTask(selectedTask.id, { status: "Rejected by Admin", adminNotes: adminNotesInput });
    if (success) {
        toast({ title: "Task Rejected", description: `${selectedTask.title} has been rejected.`, variant: "destructive" });
        setIsReviewPriceOpen(false);
    }
  };

  const handleAssignVa = async () => {
    if (!selectedTask || !selectedVaForAssignment) {
      toast({ title: "VA Selection Required", description: "Please select a VA to assign.", variant: "destructive" });
      return;
    }
    const va = mockVAs.find(v => v.id === selectedVaForAssignment);
    const success = handleUpdateTask(selectedTask.id, { status: "Pending VA Acceptance", assignedVaId: va?.id || null, assignedVaName: va?.name || null });
    if (success) {
        toast({ title: "VA Assigned", description: `${va?.name} assigned to ${selectedTask.title}. Task is now Pending VA Acceptance.` });
        setIsAssignVaOpen(false);
        setSelectedVaForAssignment(undefined);
    }
  };
  
  const handleConfirmPayment = async () => {
    if (!selectedTask) return;
    const success = handleUpdateTask(selectedTask.id, { status: "In Progress with VA", paymentStatus: "Paid by Student" });
    if (success) {
        toast({ title: "Payment Confirmed", description: `Payment for ${selectedTask.title} confirmed. VA can start work.` });
        setIsConfirmPaymentOpen(false);
    }
  };

  const handleApproveVaWork = async () => {
    if (!selectedTask) return;
    const success = handleUpdateTask(selectedTask.id, { status: "Completed", paymentStatus: "VA Payout Pending", adminNotes: adminReviewNotesInput, completionDate: new Date().toISOString() });
    if (success) {
        toast({ title: "VA Work Approved", description: `${selectedTask.title} marked as completed. VA payout is now pending.` });
        setIsReviewVaWorkOpen(false);
    }
  };

  const handleRequestRevisionFromVA = async () => {
    if (!selectedTask || !adminReviewNotesInput.trim()) {
        toast({title: "Revision Notes Required", description: "Please provide notes for the VA revision.", variant: "destructive"});
        return;
    }
    const success = handleUpdateTask(selectedTask.id, { status: "Revision Requested (to VA)", adminNotes: adminReviewNotesInput });
    if (success) {
        toast({ title: "Revision Requested", description: `Revision requested from VA for ${selectedTask.title}. Notes: ${adminReviewNotesInput}` });
        setIsReviewVaWorkOpen(false);
    }
  };
  
  const handleCancelTask = async () => {
      if(!selectedTask) return;
      const success = handleUpdateTask(selectedTask.id, { status: "Cancelled" });
      if (success) {
        toast({title: "Task Cancelled", description: `Task ${selectedTask.title} has been cancelled.`, variant: "destructive"});
        setIsCancelTaskOpen(false);
      }
  };


  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage All Tasks"
        description="Oversee, approve, assign, and track progress of all student-submitted tasks."
        icon={ClipboardList}
      />
      <Card className="shadow-xl">
        <CardHeader>
           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle className="font-headline">Tasks Overview ({isLoading ? "..." : filteredTasks.length})</CardTitle>
                <CardDescription>Filter tasks or search by ID, title, student, or VA.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Input 
                    placeholder="Search tasks..." 
                    className="w-full md:w-64" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AdminTaskStatus | "all")}>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {Object.keys(adminTaskStatusColors).map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading tasks...</p>
            </div>
          ) : fetchError ? (
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Loading Tasks</AlertTitle>
                <AlertDescription>{fetchError}</AlertDescription>
             </Alert>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
                <ClipboardList className="mx-auto h-12 w-12 mb-3" />
                <p>No tasks match your current filters or no tasks submitted yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>VA Assigned</TableHead>
                  <TableHead>Price (₦)</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map(task => {
                  const StatusIcon = (adminTaskStatusColors[task.status] && Info); 
                  return (
                  <TableRow key={task.id}>
                    <TableCell className="font-mono text-xs">{task.id.substring(0,8)}...</TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{task.title}</TableCell>
                    <TableCell>{task.studentName} ({task.studentId ? task.studentId.substring(0,6) + '...' : 'N/A'})</TableCell>
                    <TableCell>{task.assignedVaName || "N/A"}</TableCell>
                    <TableCell>{task.adminSetPriceNGN ? `₦${task.adminSetPriceNGN.toFixed(2)}` : "Not Set"}</TableCell>
                    <TableCell>
                        <Badge variant={task.paymentStatus === "Paid by Student" || task.paymentStatus === "VA Paid" ? "default" : "outline"}
                               className={task.paymentStatus === "Paid by Student" || task.paymentStatus === "VA Paid" ? "bg-green-500 text-white" : ""}>
                            {task.paymentStatus}
                        </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs whitespace-nowrap ${adminTaskStatusColors[task.status] || 'bg-gray-100 text-gray-700'}`}>
                        {task.status}
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
                          <DropdownMenuItem onClick={() => openDialog(setIsViewDetailsOpen, task)}>
                            <Eye className="mr-2 h-4 w-4" /> View Full Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {task.status === "Pending Admin Review" && (
                            <DropdownMenuItem onClick={() => openDialog(setIsReviewPriceOpen, task)}>
                              <DollarSign className="mr-2 h-4 w-4" /> Review & Price
                            </DropdownMenuItem>
                          )}
                          {(task.status === "Pending VA Assignment" || task.status === "Rejected by VA") && (
                            <DropdownMenuItem onClick={() => openDialog(setIsAssignVaOpen, task)}>
                              <UserCheck className="mr-2 h-4 w-4" /> {task.status === "Rejected by VA" ? "Re-assign VA" : "Assign VA"}
                            </DropdownMenuItem>
                          )}
                           {task.status === "Rejected by VA" && (
                             <DropdownMenuItem onClick={() => {setSelectedTask(task); setAdminNotesInput(task.adminNotes || `Task previously rejected by VA ${task.assignedVaName}. Reason: ${task.vaRejectionReason || 'Not specified'}. Review and re-price or reject.`); setIsReviewPriceOpen(true);}} className="text-red-600 focus:bg-red-50 focus:text-red-700">
                              <UserX className="mr-2 h-4 w-4" /> Reject Task for Student
                            </DropdownMenuItem>
                           )}
                          {task.status === "Awaiting Student Payment" && task.paymentStatus === "Unpaid" && (
                            <DropdownMenuItem onClick={() => openDialog(setIsConfirmPaymentOpen, task)}>
                              <Check className="mr-2 h-4 w-4 text-green-600" /> Confirm Student Payment
                            </DropdownMenuItem>
                          )}
                          {task.status === "Work Submitted by VA" && (
                            <DropdownMenuItem onClick={() => openDialog(setIsReviewVaWorkOpen, task)}>
                              <FileText className="mr-2 h-4 w-4" /> Review VA Submission
                            </DropdownMenuItem>
                          )}
                           {task.status !== "Completed" && task.status !== "Rejected by Admin" && task.status !== "Cancelled" && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openDialog(setIsCancelTaskOpen, task)} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                                    <X className="mr-2 h-4 w-4" /> Cancel Task
                                </DropdownMenuItem>
                            </>
                           )}
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
      </Card>

      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Task Details: {selectedTask?.title} (ID: {selectedTask?.id})</DialogTitle>
            <DialogDescription>Comprehensive overview of the task.</DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <ScrollArea className="max-h-[70vh] pr-3">
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-primary">Task Information</h4>
                        <div><strong className="text-muted-foreground">Student:</strong> {selectedTask.studentName} ({selectedTask.studentId ? selectedTask.studentId.substring(0,8) + '...' : 'N/A'})</div>
                        <div><strong className="text-muted-foreground">Submitted:</strong> {selectedTask.submittedDate}</div>
                        <div><strong className="text-muted-foreground">Type:</strong> {selectedTask.type}</div>
                        <div><strong className="text-muted-foreground">Pages/Units:</strong> {selectedTask.pages}</div>
                        <div><strong className="text-muted-foreground">Deadline:</strong> {selectedTask.deadline || "Not set"}</div>
                        <div><strong className="text-muted-foreground">Description:</strong></div>
                        <div className="text-sm bg-muted/30 p-2 rounded whitespace-pre-wrap">{selectedTask.description}</div>
                        {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                            <div>
                            <strong className="text-muted-foreground">Attachments:</strong>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {selectedTask.attachments.map(att => (
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
                        <div><strong className="text-muted-foreground">Admin Set Price:</strong> {selectedTask.adminSetPriceNGN ? `₦${selectedTask.adminSetPriceNGN.toFixed(2)}` : "Not Set"}</div>
                        <div><strong className="text-muted-foreground">Payment Status:</strong> <Badge variant={selectedTask.paymentStatus === "Paid by Student" || selectedTask.paymentStatus === "VA Paid" ? "default" : "outline"} className={cn(selectedTask.paymentStatus === "Paid by Student" || selectedTask.paymentStatus === "VA Paid" ? "bg-green-500 text-white" : "")}>{selectedTask.paymentStatus}</Badge></div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <h4 className="font-semibold text-primary">Assignment & Progress</h4>
                        <div>
                          <strong className="text-muted-foreground">Current Status:</strong> 
                          <Badge variant="outline" className={`text-xs ml-1 ${adminTaskStatusColors[selectedTask.status] || 'bg-gray-100 text-gray-700'}`}>
                            {selectedTask.status}
                          </Badge>
                        </div>
                        <div><strong className="text-muted-foreground">Assigned VA:</strong> {selectedTask.assignedVaName || "Not Assigned"} (ID: {selectedTask.assignedVaId || "N/A"})</div>
                        {selectedTask.status === "Rejected by VA" && selectedTask.vaRejectionReason && (
                            <div><strong className="text-muted-foreground">VA Rejection Reason:</strong> <span className="text-pink-700">{selectedTask.vaRejectionReason}</span></div>
                        )}
                        {selectedTask.vaSubmissionDate && (
                            <>
                                <div><strong className="text-muted-foreground">VA Submission Date:</strong> {selectedTask.vaSubmissionDate}</div>
                                <div><strong className="text-muted-foreground">VA Submission Notes:</strong></div>
                                <div className="text-sm bg-muted/30 p-2 rounded whitespace-pre-wrap">{selectedTask.vaSubmissionNotes || "No notes from VA."}</div>
                                {selectedTask.vaSubmissionAttachments && selectedTask.vaSubmissionAttachments.length > 0 && (
                                    <div>
                                    <strong className="text-muted-foreground">VA Attachments:</strong>
                                    <ul className="list-disc pl-5 text-sm space-y-1">
                                        {selectedTask.vaSubmissionAttachments.map(att => (
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
                        {selectedTask.completionDate && <div><strong className="text-muted-foreground">Completion Date:</strong> {selectedTask.completionDate}</div>}
                    </div>
                    {selectedTask.adminNotes && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <h4 className="font-semibold text-primary">Admin Notes</h4>
                                <div className="text-sm bg-muted/30 p-2 rounded whitespace-pre-wrap">{selectedTask.adminNotes}</div>
                            </div>
                        </>
                    )}
                </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsViewDetailsOpen(false)} disabled={isSubmittingAction}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
