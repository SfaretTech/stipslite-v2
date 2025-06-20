
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
import { getDbInstance } from "@/lib/firebase"; // Import getter
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
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
  createdAt?: Timestamp; 
  updatedAt?: Timestamp; 
}

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
  const [allTasks, setAllTasks] = useState<AdminTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);
    const db = getDbInstance();
    if (!db) {
        setFetchError("Database service is not available.");
        toast({ title: "Error", description: "Database service not available.", variant: "destructive" });
        setIsLoading(false);
        return;
    }
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTasks: AdminTask[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let formattedSubmittedDate = 'N/A';
        if (data.submissionDate) {
             try {
                formattedSubmittedDate = format(new Date(data.submissionDate), "yyyy-MM-dd HH:mm");
            } catch (e) {
                 formattedSubmittedDate = typeof data.submissionDate === 'string' ? data.submissionDate : 'Invalid Date';
            }
        } else if (data.createdAt && data.createdAt.toDate) {
            try {
                formattedSubmittedDate = format(data.createdAt.toDate(), "yyyy-MM-dd HH:mm");
            } catch (e) {}
        }
        
        fetchedTasks.push({
          id: doc.id,
          title: data.taskTitle,
          studentName: data.studentName,
          studentId: data.studentUid,
          submittedDate: formattedSubmittedDate,
          type: data.taskType,
          pages: data.pages,
          description: data.taskDescription,
          attachments: data.attachments || [],
          status: data.status as AdminTaskStatus,
          adminSetPriceNGN: data.adminSetPriceNGN || null,
          paymentStatus: data.paymentStatus,
          assignedVaId: data.assignedVaId || null,
          assignedVaName: data.assignedVaName || null,
          adminNotes: data.adminNotes,
          vaRejectionReason: data.vaRejectionReason,
          vaSubmissionDate: data.vaSubmissionDate ? format(new Date(data.vaSubmissionDate), "yyyy-MM-dd HH:mm") : null,
          vaSubmissionNotes: data.vaSubmissionNotes,
          vaSubmissionAttachments: data.vaSubmissionAttachments || [],
          deadline: data.deadline ? format(new Date(data.deadline), "yyyy-MM-dd") : null,
          completionDate: data.completionDate ? format(new Date(data.completionDate), "yyyy-MM-dd") : null,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });
      setAllTasks(fetchedTasks);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching tasks:", error);
      setFetchError("Failed to load tasks. Please check your connection or try again later.");
      toast({ title: "Error", description: "Could not fetch tasks.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);


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

  const updateTaskInFirestore = async (taskId: string, updates: Partial<AdminTask>): Promise<boolean> => { 
    const db = getDbInstance();
    if (!db) {
      toast({ title: "Database Error", description: "Firestore service is not available for update.", variant: "destructive" });
      return false;
    }
    const taskRef = doc(db, "tasks", taskId);
    setIsSubmittingAction(true);
    try {
      await updateDoc(taskRef, { ...updates, updatedAt: serverTimestamp() });
      setIsSubmittingAction(false);
      return true;
    } catch (error) {
      console.error("Error updating task in Firestore:", error);
      toast({ title: "Update Failed", description: "Could not update task in Firestore.", variant: "destructive"});
      setIsSubmittingAction(false);
      return false;
    }
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
    const success = await updateTaskInFirestore(selectedTask.id, { status: "Pending VA Assignment", adminSetPriceNGN: price, adminNotes: adminNotesInput });
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
    const success = await updateTaskInFirestore(selectedTask.id, { status: "Rejected by Admin", adminNotes: adminNotesInput });
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
    const success = await updateTaskInFirestore(selectedTask.id, { status: "Pending VA Acceptance", assignedVaId: va?.id || null, assignedVaName: va?.name || null });
    if (success) {
        toast({ title: "VA Assigned", description: `${va?.name} assigned to ${selectedTask.title}. Task is now Pending VA Acceptance.` });
        setIsAssignVaOpen(false);
        setSelectedVaForAssignment(undefined);
    }
  };
  
  const handleConfirmPayment = async () => {
    if (!selectedTask) return;
    const success = await updateTaskInFirestore(selectedTask.id, { status: "In Progress with VA", paymentStatus: "Paid by Student" });
    if (success) {
        toast({ title: "Payment Confirmed", description: `Payment for ${selectedTask.title} confirmed. VA can start work.` });
        setIsConfirmPaymentOpen(false);
    }
  };

  const handleApproveVaWork = async () => {
    if (!selectedTask) return;
    const success = await updateTaskInFirestore(selectedTask.id, { status: "Completed", paymentStatus: "VA Payout Pending", adminNotes: adminReviewNotesInput, completionDate: new Date().toISOString() });
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
    const success = await updateTaskInFirestore(selectedTask.id, { status: "Revision Requested (to VA)", adminNotes: adminReviewNotesInput });
    if (success) {
        toast({ title: "Revision Requested", description: `Revision requested from VA for ${selectedTask.title}. Notes: ${adminReviewNotesInput}` });
        setIsReviewVaWorkOpen(false);
    }
  };
  
  const handleCancelTask = async () => {
      if(!selectedTask) return;
      const success = await updateTaskInFirestore(selectedTask.id, { status: "Cancelled" });
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

      <Dialog open={isReviewPriceOpen} onOpenChange={setIsReviewPriceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review & Price Task: {selectedTask?.title}</DialogTitle>
            <DialogDescription>Set the price for this task and approve or reject it.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="text-sm"><strong className="text-muted-foreground">Student:</strong> {selectedTask?.studentName}</div>
            <div className="text-sm"><strong className="text-muted-foreground">Description:</strong> {selectedTask?.description}</div>
            <div className="space-y-1.5">
              <Label htmlFor="adminPrice">Set Price (NGN)</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                <Input id="adminPrice" type="number" placeholder="e.g., 100.00" value={adminPriceInput} onChange={(e) => setAdminPriceInput(e.target.value)} className="pl-8" disabled={isSubmittingAction}/>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adminNotesPricing">Admin Notes (Optional for approval, Required for rejection)</Label>
              <Textarea id="adminNotesPricing" placeholder="Notes for VA or internal records..." value={adminNotesInput} onChange={(e) => setAdminNotesInput(e.target.value)} rows={2} disabled={isSubmittingAction}/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleRejectTask} disabled={(!adminNotesInput.trim() && selectedTask?.status === "Pending Admin Review") || isSubmittingAction}>
              {isSubmittingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Reject Task
            </Button>
            <Button onClick={handleApproveTask} className="bg-green-600 hover:bg-green-700 text-white" disabled={!adminPriceInput.trim() || isSubmittingAction}>
              {isSubmittingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Approve & Set Price
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       <Dialog open={isAssignVaOpen} onOpenChange={setIsAssignVaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
                {selectedTask?.status === "Rejected by VA" ? "Re-assign VA to Task: " : "Assign VA to Task: "} 
                {selectedTask?.title}
            </DialogTitle>
            <DialogDescription>
                Select a Virtual Assistant for this task. 
                {selectedTask?.status === "Rejected by VA" && ` Previous VA: ${selectedTask.assignedVaName} rejected (Reason: ${selectedTask.vaRejectionReason || 'N/A'}).`}
                Price set: ₦{selectedTask?.adminSetPriceNGN?.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="assignVaSelect">Select VA</Label>
              <Select onValueChange={setSelectedVaForAssignment} value={selectedVaForAssignment} disabled={isSubmittingAction}>
                <SelectTrigger id="assignVaSelect">
                  <SelectValue placeholder="Choose a VA" />
                </SelectTrigger>
                <SelectContent>
                  {mockVAs.map(va => (
                    <SelectItem key={va.id} value={va.id} disabled={va.id === selectedTask?.assignedVaId && selectedTask?.status === "Rejected by VA"}>
                        {va.name} {va.id === selectedTask?.assignedVaId && selectedTask?.status === "Rejected by VA" && "(Previously Rejected)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignVaOpen(false)} disabled={isSubmittingAction}>Cancel</Button>
            <Button onClick={handleAssignVa} disabled={!selectedVaForAssignment || isSubmittingAction}>
                {isSubmittingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (selectedTask?.status === "Rejected by VA" ? <RefreshCw className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />)}
                {selectedTask?.status === "Rejected by VA" ? "Re-assign Selected VA" : "Assign Selected VA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmPaymentOpen} onOpenChange={setIsConfirmPaymentOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Student Payment for {selectedTask?.title}</DialogTitle>
                    <DialogDescription>
                        Task ID: {selectedTask?.id} | Price: ₦{selectedTask?.adminSetPriceNGN?.toFixed(2)} | Assigned VA: {selectedTask?.assignedVaName}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="text-sm text-muted-foreground">
                        Has the student successfully paid the amount of ₦{selectedTask?.adminSetPriceNGN?.toFixed(2)} for this task?
                        Confirming payment will change the task status to "In Progress with VA" and notify the VA.
                    </div>
                     <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700 flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
                        Ensure payment is verified before confirming. This action is usually irreversible.
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsConfirmPaymentOpen(false)} disabled={isSubmittingAction}>Cancel</Button>
                    <Button onClick={handleConfirmPayment} className="bg-green-600 hover:bg-green-700 text-white" disabled={isSubmittingAction}>
                       {isSubmittingAction ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Check className="mr-2 h-4 w-4"/>} Yes, Payment Confirmed
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


      <Dialog open={isReviewVaWorkOpen} onOpenChange={setIsReviewVaWorkOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review VA Submission for: {selectedTask?.title}</DialogTitle>
            <DialogDescription>VA: {selectedTask?.assignedVaName} | Submitted: {selectedTask?.vaSubmissionDate}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-1.5">
              <Label className="font-medium">VA Submission Notes:</Label>
              <div className="text-sm bg-muted/30 p-2 rounded">{selectedTask?.vaSubmissionNotes || "No notes provided by VA."}</div>
            </div>
             {selectedTask?.vaSubmissionAttachments && selectedTask.vaSubmissionAttachments.length > 0 && (
                <div className="space-y-1.5">
                <Label className="font-medium">VA Attachments:</Label>
                <ul className="list-disc pl-5 text-sm space-y-1">
                    {selectedTask.vaSubmissionAttachments.map(att => (
                    <li key={att.name}>
                        <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center">
                         <Paperclip className="h-4 w-4 mr-1.5 shrink-0"/>{att.name}
                        </a>
                    </li>
                    ))}
                </ul>
                </div>
            )}
            <div className="space-y-1.5 pt-3 border-t">
              <Label htmlFor="adminReviewNotes">Admin Review Notes / Feedback (Required for Revision)</Label>
              <Textarea id="adminReviewNotes" placeholder="Notes for student or internal record..." value={adminReviewNotesInput} onChange={(e) => setAdminReviewNotesInput(e.target.value)} rows={3} disabled={isSubmittingAction}/>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleRequestRevisionFromVA} disabled={!adminReviewNotesInput.trim() || isSubmittingAction}>
              {isSubmittingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Request Revision from VA
            </Button>
            <Button onClick={handleApproveVaWork} className="bg-green-600 hover:bg-green-700 text-white" disabled={isSubmittingAction}>
              {isSubmittingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Approve & Complete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isCancelTaskOpen} onOpenChange={setIsCancelTaskOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Cancel Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel task: <strong>{selectedTask?.title}</strong> (ID: {selectedTask?.id})?
              This action may notify the student and VA (if assigned). It might not be reversible depending on the task stage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsCancelTaskOpen(false)} disabled={isSubmittingAction}>Keep Task</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelTask} className="bg-destructive hover:bg-destructive/90" disabled={isSubmittingAction}>
                {isSubmittingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Proceed to Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
