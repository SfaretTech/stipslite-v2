
"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  DialogClose,
} from "@/components/ui/dialog";
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
import { ClipboardList, Check, X, Eye, DollarSign, UserCheck, FileText, MoreHorizontal, Search, Paperclip, MessageSquare, AlertTriangle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type AdminTaskStatus =
  | "Pending Admin Review"
  | "Pending VA Assignment"
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
  vaSubmissionDate?: string | null;
  vaSubmissionNotes?: string;
  vaSubmissionAttachments?: { name: string; url: string }[];
  deadline?: string;
  completionDate?: string;
}

const mockAdminTasksInitial: AdminTask[] = [
  { id: "TSK101", title: "Market Analysis Report Q3", studentName: "John Doe", studentId: "STD001", submittedDate: "2024-07-25", type: "Report", pages: 20, description: "Detailed market analysis for tech sector, Q3 2024. Include competitor overview, SWOT, and growth projections.", attachments: [{name:"brief.pdf", url:"#"}], status: "Pending Admin Review", adminSetPriceNGN: null, paymentStatus: "Unpaid", assignedVaId: null, assignedVaName: null, deadline: "2024-08-10" },
  { id: "TSK102", title: "App UI Design - Fitness Tracker", studentName: "Alice Smith", studentId: "STD002", submittedDate: "2024-07-24", type: "Design", pages: 10, description: "Design 10 screens for a mobile fitness tracking app. Focus on user experience and modern aesthetics.", attachments: [{name:"wireframes.fig", url:"#"}], status: "Pending VA Assignment", adminSetPriceNGN: 150, paymentStatus: "Unpaid", assignedVaId: null, assignedVaName: null, deadline: "2024-08-05" },
  { id: "TSK103", title: "Thesis Chapter 3 - Methodology", studentName: "Bob Johnson", studentId: "STD003", submittedDate: "2024-07-22", type: "Research", pages: 30, description: "Write methodology chapter for PhD thesis on renewable energy policies. Must include quantitative and qualitative approaches.", attachments: [], status: "Awaiting Student Payment", adminSetPriceNGN: 250, paymentStatus: "Unpaid", assignedVaId: "VA001", assignedVaName: "Aisha Bello", deadline: "2024-08-20" },
  { id: "TSK104", title: "Calculus Problem Set Advanced", studentName: "Eva Green", studentId: "STD004", submittedDate: "2024-07-20", type: "Assignment", pages: 5, description: "Solve advanced calculus problems, focusing on integration and differentiation.", attachments: [{name: "problems.pdf", url:"#"}], status: "In Progress with VA", adminSetPriceNGN: 75, paymentStatus: "Paid by Student", assignedVaId: "VA002", assignedVaName: "Chinedu Okoro", deadline: "2024-07-28" },
  { id: "TSK105", title: "History Essay: Cold War Impact", studentName: "Mike Brown", studentId: "STD005", submittedDate: "2024-07-18", type: "Essay", pages: 8, description: "Analyze the long-term impact of the Cold War on global politics. 8 pages, APA format.", attachments: [], status: "Work Submitted by VA", adminSetPriceNGN: 100, paymentStatus: "Paid by Student", assignedVaId: "VA001", assignedVaName: "Aisha Bello", vaSubmissionDate: "2024-07-26", vaSubmissionNotes: "Essay completed. All sources cited.", vaSubmissionAttachments: [{name: "cold_war_essay_final.docx", url:"#"}]},
  { id: "TSK106", title: "Business Plan - Coffee Shop", studentName: "Sarah Lee", studentId: "STD006", submittedDate: "2024-07-15", type: "Business Plan", pages: 25, description: "Develop a comprehensive business plan for a new specialty coffee shop.", attachments: [], status: "Completed", adminSetPriceNGN: 300, paymentStatus: "VA Paid", assignedVaId: "VA003", assignedVaName: "Fatima Diallo", deadline: "2024-08-01", completionDate: "2024-07-23"},
  { id: "TSK107", title: "Internship Report - Marketing", studentName: "David Kim", studentId: "STD007", submittedDate: "2024-07-10", type: "Report", pages: 15, description: "Summer internship report for marketing department.", attachments: [], status: "Rejected by Admin", adminSetPriceNGN: null, paymentStatus: "Unpaid", assignedVaId: null, assignedVaName: null, adminNotes: "Description too vague. Please provide specific deliverables and learning outcomes."},
];

const adminTaskStatusColors: Record<AdminTaskStatus, string> = {
  "Pending Admin Review": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Pending VA Assignment": "bg-orange-100 text-orange-700 border-orange-300",
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
  const [tasks, setTasks] = useState<AdminTask[]>(mockAdminTasksInitial);
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


  const { toast } = useToast();

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = 
        task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.assignedVaName && task.assignedVaName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

  const openDialog = (dialogSetter: React.Dispatch<React.SetStateAction<boolean>>, task: AdminTask) => {
    setSelectedTask(task);
    setAdminPriceInput(task.adminSetPriceNGN?.toString() || "");
    setAdminNotesInput(task.adminNotes || "");
    setAdminReviewNotesInput(""); 
    dialogSetter(true);
  };

  const handleApproveTask = () => {
    if (!selectedTask || !adminPriceInput) {
      toast({ title: "Price Required", description: "Please set a price before approving.", variant: "destructive" });
      return;
    }
    const price = parseFloat(adminPriceInput);
    if (isNaN(price) || price <= 0) {
       toast({ title: "Invalid Price", description: "Please enter a valid positive price.", variant: "destructive" });
       return;
    }
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: "Pending VA Assignment", adminSetPriceNGN: price, adminNotes: adminNotesInput } : t));
    toast({ title: "Task Approved", description: `${selectedTask.title} approved with price ₦${price}. Ready for VA assignment.` });
    setIsReviewPriceOpen(false);
  };

  const handleRejectTask = () => {
    if (!selectedTask) return;
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: "Rejected by Admin", adminNotes: adminNotesInput || "Rejected by admin." } : t));
    toast({ title: "Task Rejected", description: `${selectedTask.title} has been rejected.`, variant: "destructive" });
    setIsReviewPriceOpen(false);
  };

  const handleAssignVa = () => {
    if (!selectedTask || !selectedVaForAssignment) {
      toast({ title: "VA Selection Required", description: "Please select a VA to assign.", variant: "destructive" });
      return;
    }
    const va = mockVAs.find(v => v.id === selectedVaForAssignment);
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: "Awaiting Student Payment", assignedVaId: va?.id || null, assignedVaName: va?.name || null } : t));
    toast({ title: "VA Assigned", description: `${va?.name} assigned to ${selectedTask.title}. Awaiting student payment.` });
    setIsAssignVaOpen(false);
    setSelectedVaForAssignment(undefined);
  };
  
  const handleConfirmPayment = () => {
    if (!selectedTask) return;
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: "In Progress with VA", paymentStatus: "Paid by Student" } : t));
    toast({ title: "Payment Confirmed", description: `Payment for ${selectedTask.title} confirmed. VA can start work.` });
    setIsConfirmPaymentOpen(false);
  };

  const handleApproveVaWork = () => {
    if (!selectedTask) return;
     setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: "Completed", paymentStatus: "VA Payout Pending", adminNotes: adminReviewNotesInput, completionDate: new Date().toISOString().split('T')[0] } : t));
    toast({ title: "VA Work Approved", description: `${selectedTask.title} marked as completed. VA payout is now pending.` });
    setIsReviewVaWorkOpen(false);
  };

  const handleRequestRevisionFromVA = () => {
    if (!selectedTask || !adminReviewNotesInput.trim()) {
        toast({title: "Revision Notes Required", description: "Please provide notes for the VA revision.", variant: "destructive"});
        return;
    }
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: "Revision Requested (to VA)", adminNotes: adminReviewNotesInput } : t));
    toast({ title: "Revision Requested", description: `Revision requested from VA for ${selectedTask.title}. Notes: ${adminReviewNotesInput}` });
    setIsReviewVaWorkOpen(false);
  };
  
  const handleCancelTask = () => {
      if(!selectedTask) return;
      setTasks(prev => prev.map(t => t.id === selectedTask.id ? {...t, status: "Cancelled"} : t));
      toast({title: "Task Cancelled", description: `Task ${selectedTask.title} has been cancelled.`, variant: "destructive"});
      setIsCancelTaskOpen(false);
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
                <CardTitle className="font-headline">Tasks Overview ({filteredTasks.length})</CardTitle>
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
          {filteredTasks.length === 0 ? (
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
                {filteredTasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell className="font-mono text-xs">{task.id}</TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{task.title}</TableCell>
                    <TableCell>{task.studentName} ({task.studentId})</TableCell>
                    <TableCell>{task.assignedVaName || "N/A"}</TableCell>
                    <TableCell>{task.adminSetPriceNGN ? `₦${task.adminSetPriceNGN.toFixed(2)}` : "Not Set"}</TableCell>
                    <TableCell>
                        <Badge variant={task.paymentStatus === "Paid by Student" || task.paymentStatus === "VA Paid" ? "default" : "outline"}
                               className={task.paymentStatus === "Paid by Student" || task.paymentStatus === "VA Paid" ? "bg-green-500 text-white" : ""}>
                            {task.paymentStatus}
                        </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs whitespace-nowrap ${adminTaskStatusColors[task.status]}`}>{task.status}</Badge>
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
                          {task.status === "Pending VA Assignment" && (
                            <DropdownMenuItem onClick={() => openDialog(setIsAssignVaOpen, task)}>
                              <UserCheck className="mr-2 h-4 w-4" /> Assign VA
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
                ))}
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
          <ScrollArea className="max-h-[70vh] pr-3">
            <div className="grid gap-6 py-4">
                <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Task Information</h4>
                    <div><strong className="text-muted-foreground">Student:</strong> {selectedTask?.studentName} ({selectedTask?.studentId})</div>
                    <div><strong className="text-muted-foreground">Submitted:</strong> {selectedTask?.submittedDate}</div>
                    <div><strong className="text-muted-foreground">Type:</strong> {selectedTask?.type}</div>
                    <div><strong className="text-muted-foreground">Pages/Units:</strong> {selectedTask?.pages}</div>
                    <div><strong className="text-muted-foreground">Deadline:</strong> {selectedTask?.deadline || "Not set"}</div>
                    <div><strong className="text-muted-foreground">Description:</strong></div>
                    <div className="text-sm bg-muted/30 p-2 rounded whitespace-pre-wrap">{selectedTask?.description}</div>
                    {selectedTask?.attachments && selectedTask.attachments.length > 0 && (
                        <div>
                        <strong className="text-muted-foreground">Attachments:</strong>
                        <ul className="list-disc pl-5 text-sm">
                            {selectedTask.attachments.map(att => <li key={att.name}><a href={att.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{att.name}</a></li>)}
                        </ul>
                        </div>
                    )}
                </div>
                <Separator />
                 <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Pricing & Payment</h4>
                    <div><strong className="text-muted-foreground">Admin Set Price:</strong> {selectedTask?.adminSetPriceNGN ? `₦${selectedTask.adminSetPriceNGN.toFixed(2)}` : "Not Set"}</div>
                    <div><strong className="text-muted-foreground">Payment Status:</strong> <Badge variant={selectedTask?.paymentStatus === "Paid by Student" || selectedTask?.paymentStatus === "VA Paid" ? "default" : "outline"} className={selectedTask?.paymentStatus === "Paid by Student" || selectedTask?.paymentStatus === "VA Paid" ? "bg-green-500 text-white" : ""}>{selectedTask?.paymentStatus}</Badge></div>
                </div>
                <Separator />
                <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Assignment & Progress</h4>
                    <div><strong className="text-muted-foreground">Current Status:</strong> <Badge variant="outline" className={`text-xs ${adminTaskStatusColors[selectedTask?.status || "Cancelled"]}`}>{selectedTask?.status}</Badge></div>
                    <div><strong className="text-muted-foreground">Assigned VA:</strong> {selectedTask?.assignedVaName || "Not Assigned"} (ID: {selectedTask?.assignedVaId || "N/A"})</div>
                    {selectedTask?.vaSubmissionDate && (
                        <>
                            <div><strong className="text-muted-foreground">VA Submission Date:</strong> {selectedTask.vaSubmissionDate}</div>
                            <div><strong className="text-muted-foreground">VA Submission Notes:</strong></div>
                            <div className="text-sm bg-muted/30 p-2 rounded whitespace-pre-wrap">{selectedTask.vaSubmissionNotes || "No notes from VA."}</div>
                            {selectedTask.vaSubmissionAttachments && selectedTask.vaSubmissionAttachments.length > 0 && (
                                <div>
                                <strong className="text-muted-foreground">VA Attachments:</strong>
                                <ul className="list-disc pl-5 text-sm">
                                    {selectedTask.vaSubmissionAttachments.map(att => <li key={att.name}><a href={att.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{att.name}</a></li>)}
                                </ul>
                                </div>
                            )}
                        </>
                    )}
                    {selectedTask?.completionDate && <div><strong className="text-muted-foreground">Completion Date:</strong> {selectedTask.completionDate}</div>}
                </div>
                {selectedTask?.adminNotes && (
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
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
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
                <Input id="adminPrice" type="number" placeholder="e.g., 100.00" value={adminPriceInput} onChange={(e) => setAdminPriceInput(e.target.value)} className="pl-8" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adminNotesPricing">Admin Notes (Optional)</Label>
              <Textarea id="adminNotesPricing" placeholder="Notes for VA or internal records..." value={adminNotesInput} onChange={(e) => setAdminNotesInput(e.target.value)} rows={2}/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={handleRejectTask}>Reject Task</Button>
            <Button onClick={handleApproveTask} className="bg-green-600 hover:bg-green-700 text-white">Approve & Set Price</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       <Dialog open={isAssignVaOpen} onOpenChange={setIsAssignVaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign VA to Task: {selectedTask?.title}</DialogTitle>
            <DialogDescription>Select a Virtual Assistant for this task. Price set: ₦{selectedTask?.adminSetPriceNGN?.toFixed(2)}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="assignVaSelect">Select VA</Label>
              <Select onValueChange={setSelectedVaForAssignment} value={selectedVaForAssignment}>
                <SelectTrigger id="assignVaSelect">
                  <SelectValue placeholder="Choose a VA" />
                </SelectTrigger>
                <SelectContent>
                  {mockVAs.map(va => (
                    <SelectItem key={va.id} value={va.id}>{va.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleAssignVa}>Assign Selected VA</Button>
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
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleConfirmPayment} className="bg-green-600 hover:bg-green-700 text-white">
                       <Check className="mr-2 h-4 w-4"/> Yes, Payment Confirmed
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
              <Label htmlFor="adminReviewNotes">Admin Review Notes / Feedback (Optional)</Label>
              <Textarea id="adminReviewNotes" placeholder="Notes for student or internal record..." value={adminReviewNotesInput} onChange={(e) => setAdminReviewNotesInput(e.target.value)} rows={3}/>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleRequestRevisionFromVA} disabled={!adminReviewNotesInput.trim()}>Request Revision from VA</Button>
            <Button onClick={handleApproveVaWork} className="bg-green-600 hover:bg-green-700 text-white">Approve & Complete Task</Button>
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
            <AlertDialogCancel onClick={() => setIsCancelTaskOpen(false)}>Keep Task</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelTask} className="bg-destructive hover:bg-destructive/90">Proceed to Cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
