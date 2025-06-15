
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CheckCircle, Clock, Eye, MessageSquare, MoreHorizontal, AlertCircle, Check, X, Upload, FileText } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type TaskStatusVA = "Pending Acceptance" | "In Progress" | "Submitted - Awaiting Review" | "Revision Requested" | "Completed" | "Cancelled";

interface AssignedTask {
  id: string;
  title: string;
  studentName: string;
  submittedDate: string; 
  assignedDate: string; 
  deadline: string; 
  status: TaskStatusVA;
  payoutAmount: string;
  brief: string;
  studentFeedback?: string; // For revision requests
  attachments?: { name: string, url: string }[]; // Student attachments
}

const mockAssignedTasksInitial: AssignedTask[] = [
  { id: "TSK123", title: "Advanced Calculus Problem Set", studentName: "John Student", submittedDate: "2024-07-20", assignedDate: "2024-07-21", deadline: "2024-07-25", status: "Pending Acceptance", payoutAmount: "₦75.00", brief: "Solve problems 1-10 from Chapter 5. Show all work. Ensure detailed explanations for each step." , attachments: [{name: "problem_set.pdf", url: "#"}]},
  { id: "TSK101", title: "Literature Review - Chapter 1", studentName: "Alice Scholar", submittedDate: "2024-07-10", assignedDate: "2024-07-12", deadline: "2024-07-18", status: "In Progress", payoutAmount: "₦50.00", brief: "Comprehensive literature review for renewable energy sources, focusing on solar and wind power. Minimum 15 sources, APA 7th edition.", attachments: [{name: "guidelines.docx", url: "#"}] },
  { id: "TSK088", title: "Marketing Presentation Q3", studentName: "Bob Marketer", submittedDate: "2024-07-08", assignedDate: "2024-07-09", deadline: "2024-07-15", status: "Submitted - Awaiting Review", payoutAmount: "₦120.00", brief: "20-slide presentation for Q3 marketing strategy. Include market analysis, competitor overview, proposed campaigns, and budget allocation." },
  { id: "TSK075", title: "Python API Integration", studentName: "Carol Coder", submittedDate: "2024-07-05", assignedDate: "2024-07-06", deadline: "2024-07-12", status: "Revision Requested", payoutAmount: "₦90.00", brief: "Integrate Stripe API into existing Django app. Student noted a bug in error handling when payment fails.", studentFeedback: "The error handling for failed payments isn't robust. Please ensure all edge cases are covered and provide a user-friendly error message." },
  { id: "TSK050", title: "History Essay - WW2 Impact", studentName: "David Historian", submittedDate: "2024-06-25", assignedDate: "2024-06-26", deadline: "2024-07-02", status: "Completed", payoutAmount: "₦60.00", brief: "Detailed essay on the socio-economic impact of WW2 in East Africa. 2000 words." },
];

const vaStatusColors: Record<TaskStatusVA, string> = {
  "Pending Acceptance": "bg-orange-100 text-orange-700 border-orange-300",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
  "Submitted - Awaiting Review": "bg-purple-100 text-purple-700 border-purple-300",
  "Revision Requested": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Completed": "bg-green-100 text-green-700 border-green-300",
  "Cancelled": "bg-red-100 text-red-700 border-red-300",
};

const vaStatusIcons: Record<TaskStatusVA, React.ElementType> = {
  "Pending Acceptance": AlertCircle,
  "In Progress": Clock,
  "Submitted - Awaiting Review": Eye,
  "Revision Requested": MessageSquare,
  "Completed": CheckCircle,
  "Cancelled": X,
};


export default function VaTasksPage() {
  const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>(mockAssignedTasksInitial);
  const [selectedTask, setSelectedTask] = useState<AssignedTask | null>(null);
  const [isDeclineSectionVisible, setIsDeclineSectionVisible] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const { toast } = useToast();

  const handleOpenDialog = (task: AssignedTask) => {
    setSelectedTask(task);
    setIsDeclineSectionVisible(false); // Reset decline section visibility
    setDeclineReason(""); // Reset decline reason
    setSubmissionNotes(""); // Reset submission notes
  };

  const handleAcceptTask = () => {
    if (!selectedTask) return;
    // Simulate backend update
    setAssignedTasks(prev => prev.map(t => t.id === selectedTask.id ? {...t, status: "In Progress"} : t));
    toast({ title: "Task Accepted", description: `You have accepted task: ${selectedTask.title}.` });
    setSelectedTask(null); // Close dialog
  };

  const handleConfirmDecline = () => {
    if (!selectedTask || !declineReason.trim()) {
      toast({ title: "Reason Required", description: "Please provide a reason for declining the task.", variant: "destructive"});
      return;
    }
    // Simulate backend update
    setAssignedTasks(prev => prev.map(t => t.id === selectedTask.id ? {...t, status: "Cancelled" /* Or a new 'Declined' status */} : t));
    toast({ title: "Task Declined", description: `Task ${selectedTask.title} declined. Reason: ${declineReason}` });
    setSelectedTask(null); // Close dialog
    setDeclineReason("");
    setIsDeclineSectionVisible(false);
  };
  
  const handleSubmitWork = () => {
    if(!selectedTask) return;
    // Simulate file upload and notes submission
    const newStatus: TaskStatusVA = selectedTask.status === "Revision Requested" ? "Submitted - Awaiting Review" : "Submitted - Awaiting Review";
     setAssignedTasks(prev => prev.map(t => t.id === selectedTask.id ? {...t, status: newStatus} : t));
    toast({
        title: selectedTask.status === "Revision Requested" ? "Revision Submitted" : "Work Submitted",
        description: `Your work for task '${selectedTask.title}' has been submitted with notes: "${submissionNotes || 'No notes'}".`
    });
    setSelectedTask(null);
    setSubmissionNotes("");
  };


  return (
    <div className="space-y-8">
      <PageHeader 
        title="My Assigned Tasks"
        description="Manage tasks assigned to you. Accept new tasks, submit completed work, and track progress."
        icon={Briefcase}
      />
      <Dialog open={!!selectedTask} onOpenChange={(isOpen) => !isOpen && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-lg">
            {selectedTask && (
            <>
                <DialogHeader>
                    <DialogTitle>{selectedTask.title} (ID: {selectedTask.id})</DialogTitle>
                    <DialogDescription>
                    Student: {selectedTask.studentName} | Deadline: {selectedTask.deadline} | Payout: {selectedTask.payoutAmount}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="space-y-1">
                        <Label className="font-semibold text-primary">Task Brief:</Label>
                        <p className="text-sm text-foreground/80 p-3 bg-muted/10 border rounded-md whitespace-pre-wrap">{selectedTask.brief}</p>
                    </div>

                    {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                        <div className="space-y-2">
                            <Label className="font-semibold text-primary">Student Attachments:</Label>
                            <ul className="space-y-1.5">
                            {selectedTask.attachments.map((att, index) => (
                                <li key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md text-sm">
                                <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-primary/70" />
                                    <span>{att.name}</span>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <a href={att.url} download>Download</a>
                                </Button>
                                </li>
                            ))}
                            </ul>
                        </div>
                    )}

                    {selectedTask.status === "Revision Requested" && selectedTask.studentFeedback && (
                        <div className="space-y-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <Label className="font-semibold text-yellow-700">Revision Notes from Student:</Label>
                            <p className="text-sm text-yellow-600 whitespace-pre-wrap">{selectedTask.studentFeedback}</p>
                        </div>
                    )}

                    {selectedTask.status === "Pending Acceptance" && isDeclineSectionVisible && (
                        <div className="space-y-2 pt-2 border-t mt-2">
                            <Label htmlFor="declineReason" className="font-semibold text-destructive">Reason for Declining:</Label>
                            <Textarea 
                                id="declineReason" 
                                value={declineReason}
                                onChange={(e) => setDeclineReason(e.target.value)}
                                placeholder="Please provide a brief reason for declining this task..." 
                                rows={3} 
                            />
                        </div>
                    )}

                    {(selectedTask.status === "In Progress" || selectedTask.status === "Revision Requested") && (
                    <>
                        <div className="space-y-2 pt-2 border-t mt-2">
                            <Label htmlFor="submissionNotes" className="font-semibold text-primary">Submission Notes (Optional):</Label>
                            <Textarea 
                                id="submissionNotes" 
                                value={submissionNotes}
                                onChange={(e) => setSubmissionNotes(e.target.value)}
                                placeholder="Any notes for the student or admin regarding your submission..." 
                                rows={3} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="attachments" className="font-semibold text-primary">Attach Completed Work:</Label>
                            <div className="flex items-center justify-center w-full">
                                <Label 
                                htmlFor="va-task-file-upload" 
                                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center pt-4 pb-5">
                                        <Upload className="w-7 h-7 mb-1 text-muted-foreground" />
                                        <p className="mb-1 text-xs text-muted-foreground">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">DOCX, PDF, ZIP, etc.</p>
                                    </div>
                                    <Input id="va-task-file-upload" type="file" className="hidden" multiple />
                                </Label>
                            </div>
                        </div>
                    </>
                    )}
                </div>
                <DialogFooter className="border-t pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Close</Button>
                    </DialogClose>

                    {selectedTask.status === "Pending Acceptance" && !isDeclineSectionVisible && (
                        <>
                        <Button onClick={() => setIsDeclineSectionVisible(true)} variant="destructive" className="bg-red-600 hover:bg-red-700">
                            <X className="mr-2 h-4 w-4" />Decline Task
                        </Button>
                        <Button onClick={handleAcceptTask} className="bg-green-600 hover:bg-green-700 text-white">
                            <Check className="mr-2 h-4 w-4" />Accept Task
                        </Button>
                        </>
                    )}
                    {selectedTask.status === "Pending Acceptance" && isDeclineSectionVisible && (
                         <Button onClick={handleConfirmDecline} variant="destructive" className="bg-red-600 hover:bg-red-700" disabled={!declineReason.trim()}>
                            Confirm Decline with Reason
                        </Button>
                    )}

                    {(selectedTask.status === "In Progress" || selectedTask.status === "Revision Requested") && (
                        <Button onClick={handleSubmitWork} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        {selectedTask.status === "Revision Requested" ? "Submit Revised Work" : "Submit Completed Work"}
                        </Button>
                    )}
                </DialogFooter>
            </>
            )}
        </DialogContent>
      </Dialog>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Task Queue ({assignedTasks.length})</CardTitle>
          <CardDescription>Overview of all tasks currently in your queue.</CardDescription>
        </CardHeader>
        <CardContent>
          {assignedTasks.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground">
                <Briefcase className="mx-auto h-16 w-16 mb-4" />
                <p className="text-xl font-semibold">No tasks assigned yet.</p>
                <p>Keep your profile updated and availability open to receive task assignments.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedTasks.map(task => {
                  const StatusIcon = vaStatusIcons[task.status];
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.id}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.studentName}</TableCell>
                      <TableCell>{task.deadline}</TableCell>
                      <TableCell className="font-semibold">{task.payoutAmount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${vaStatusColors[task.status]}`}>
                          <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
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
                                <DropdownMenuItem onClick={() => handleOpenDialog(task)}>
                                  <Eye className="mr-2 h-4 w-4" />View Details & Actions
                                </DropdownMenuItem>
                              {task.status === "Pending Acceptance" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-green-600 focus:text-green-700 focus:bg-green-50" onClick={() => {handleOpenDialog(task); handleAcceptTask() /* Quick accept may not be ideal, opens dialog then immediately acts */}}>
                                    <Check className="mr-2 h-4 w-4" />Quick Accept Task
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => {handleOpenDialog(task); setIsDeclineSectionVisible(true);}}>
                                    <X className="mr-2 h-4 w-4" />Decline Task
                                  </DropdownMenuItem>
                                </>
                              )}
                              {(task.status === "In Progress" || task.status === "Revision Requested") && (
                                <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-blue-600 focus:text-blue-700 focus:bg-blue-50" onClick={() => handleOpenDialog(task)}>
                                    <Upload className="mr-2 h-4 w-4" /> {task.status === "Revision Requested" ? "Submit Revision" : "Submit Work"}
                                </DropdownMenuItem>
                                </>
                              )}
                               <DropdownMenuSeparator />
                               <DropdownMenuItem disabled>
                                <MessageSquare className="mr-2 h-4 w-4" />Contact Student (Future)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

