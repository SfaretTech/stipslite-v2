
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle, Clock, Eye, MessageSquare, MoreHorizontal, AlertCircle, Check, X, Upload, FileText, Sparkles } from "lucide-react";
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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type TaskStatusVA = "Pending Acceptance" | "In Progress" | "Submitted - Awaiting Review" | "Revision Requested" | "Completed" | "Cancelled By VA" | "Cancelled By Student";

interface BusinessServiceTask {
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
  vaAvailabilityAtAssignment?: boolean; // For simulation
}

const mockBusinessServiceTasksInitial: BusinessServiceTask[] = [
  { id: "BST001", title: "Dissertation Chapter 3 Methodology", studentName: "Sarah Researcher", submittedDate: "2024-07-20", assignedDate: "2024-07-21", deadline: "2024-07-28", status: "Pending Acceptance", payoutAmount: "₦150.00", brief: "Develop the methodology chapter for a PhD dissertation on climate change impact on agriculture in Sub-Saharan Africa. Must include quantitative and qualitative research design.", attachments: [{name: "research_proposal.pdf", url: "#"}, {name: "data_collection_plan.docx", url: "#"}], vaAvailabilityAtAssignment: true },
  { id: "BST002", title: "Advanced Financial Modeling", studentName: "Mike Finance", submittedDate: "2024-07-18", assignedDate: "2024-07-19", deadline: "2024-07-25", status: "In Progress", payoutAmount: "₦200.00", brief: "Create a 5-year financial projection model for a tech startup. Include sensitivity analysis and valuation.", attachments: [{name: "company_deck.pptx", url: "#"}], vaAvailabilityAtAssignment: true },
  { id: "BST003", title: "Legal Case Brief - Contract Law", studentName: "Laura Lawyer", submittedDate: "2024-07-15", assignedDate: "2024-07-16", deadline: "2024-07-20", status: "Submitted - Awaiting Review", payoutAmount: "₦100.00", brief: "Prepare a detailed case brief for Smith v. Jones (2022), focusing on breach of contract elements.", vaAvailabilityAtAssignment: true },
  { id: "BST004", title: "Statistical Analysis for Thesis", studentName: "Ken Stats", submittedDate: "2024-07-12", assignedDate: "2024-07-13", deadline: "2024-07-19", status: "Revision Requested", payoutAmount: "₦180.00", brief: "Perform ANOVA and regression analysis on the provided dataset. Student requires clarification on the interpretation of p-values.", studentFeedback: "Please elaborate on the significance of the p-values for each variable and provide a clearer interpretation in the context of the research questions.", attachments: [{name: "dataset.xlsx", url: "#"}], vaAvailabilityAtAssignment: true },
  { id: "BST005", title: "Machine Learning Model Development", studentName: "Alex AI", submittedDate: "2024-07-22", assignedDate: "2024-07-23", deadline: "2024-08-05", status: "Pending Acceptance", payoutAmount: "₦250.00", brief: "Develop a sentiment analysis model using Python and TensorFlow/Keras for customer reviews. Dataset provided.", attachments: [{name: "review_dataset.csv", url: "#"}, {name: "project_requirements.pdf", url: "#"}], vaAvailabilityAtAssignment: false }, // Example of task assigned when VA was "offline"
];

const vaStatusColors: Record<TaskStatusVA, string> = {
  "Pending Acceptance": "bg-orange-100 text-orange-700 border-orange-300",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
  "Submitted - Awaiting Review": "bg-purple-100 text-purple-700 border-purple-300",
  "Revision Requested": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Completed": "bg-green-100 text-green-700 border-green-300",
  "Cancelled By VA": "bg-red-100 text-red-700 border-red-300",
  "Cancelled By Student": "bg-gray-100 text-gray-700 border-gray-300",
};

const vaStatusIcons: Record<TaskStatusVA, React.ElementType> = {
  "Pending Acceptance": AlertCircle,
  "In Progress": Clock,
  "Submitted - Awaiting Review": Eye,
  "Revision Requested": MessageSquare,
  "Completed": CheckCircle,
  "Cancelled By VA": X,
  "Cancelled By Student": X,
};


export default function VaBusinessTasksPage() {
  const [tasks, setTasks] = useState<BusinessServiceTask[]>(mockBusinessServiceTasksInitial);
  const [selectedTask, setSelectedTask] = useState<BusinessServiceTask | null>(null);
  const [isDeclineSectionVisible, setIsDeclineSectionVisible] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleOpenDialog = (task: BusinessServiceTask) => {
    setSelectedTask(task);
    setIsDeclineSectionVisible(false); 
    setDeclineReason(""); 
    setSubmissionNotes(""); 
  };

  const handleAcceptTask = () => {
    if (!selectedTask) return;
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? {...t, status: "In Progress"} : t));
    toast({ title: "Task Accepted", description: `You have accepted business task: ${selectedTask.title}. It is now 'In Progress'.` });
    setSelectedTask(null); 
  };

  const handleConfirmDecline = () => {
    if (!selectedTask || !declineReason.trim()) {
      toast({ title: "Reason Required", description: "Please provide a reason for declining the task.", variant: "destructive"});
      return;
    }
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? {...t, status: "Cancelled By VA" } : t)); // Changed to Cancelled By VA
    toast({ title: "Task Declined", description: `Business task ${selectedTask.title} declined. Reason: ${declineReason}` });
    setSelectedTask(null); 
    setDeclineReason("");
    setIsDeclineSectionVisible(false);
  };
  
  const handleSubmitWork = () => {
    if(!selectedTask) return;
    const newStatus: TaskStatusVA = selectedTask.status === "Revision Requested" ? "Submitted - Awaiting Review" : "Submitted - Awaiting Review";
     setTasks(prev => prev.map(t => t.id === selectedTask.id ? {...t, status: newStatus} : t));
    toast({
        title: selectedTask.status === "Revision Requested" ? "Revision Submitted" : "Work Submitted",
        description: `Your work for task '${selectedTask.title}' has been submitted with notes: "${submissionNotes || 'No notes'}". Student will be notified.`
    });
    setSelectedTask(null);
    setSubmissionNotes("");
  };

  const handleContactStudent = (task: BusinessServiceTask) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('stipsLiteContactStudentTaskId', task.id);
        localStorage.setItem('stipsLiteContactStudentName', task.studentName);
    }
    router.push('/va/support');
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Business Service Tasks"
        description="Manage tasks directly assigned to you by students. These are typically for VAs with an active 'Professional Business VA' subscription and 'Available for Direct Assignment' status."
        icon={Target}
      />
      <Dialog open={!!selectedTask} onOpenChange={(isOpen) => !isOpen && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-lg">
            {selectedTask && (
            <>
                <DialogHeader>
                    <DialogTitle className="flex items-center"><Sparkles className="h-5 w-5 mr-2 text-primary" />{selectedTask.title} (ID: {selectedTask.id})</DialogTitle>
                    <DialogDescription>
                    Student: {selectedTask.studentName} | Deadline: {selectedTask.deadline} | Payout: {selectedTask.payoutAmount}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    {selectedTask.status === "Pending Acceptance" && selectedTask.vaAvailabilityAtAssignment === false && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 flex items-start">
                            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 shrink-0"/>
                            <p className="text-sm">
                                Note: This task was assigned while your "Available for Direct Assignment" status was OFF. You can still choose to accept it.
                            </p>
                        </div>
                    )}
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
                                htmlFor="va-bstask-file-upload" 
                                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center pt-4 pb-5">
                                        <Upload className="w-7 h-7 mb-1 text-muted-foreground" />
                                        <p className="mb-1 text-xs text-muted-foreground">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">DOCX, PDF, ZIP, etc.</p>
                                    </div>
                                    <Input id="va-bstask-file-upload" type="file" className="hidden" multiple />
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
          <CardTitle className="font-headline">Assigned Business Tasks ({tasks.length})</CardTitle>
          <CardDescription>Overview of all tasks specifically assigned to you.</CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground">
                <Target className="mx-auto h-16 w-16 mb-4" />
                <p className="text-xl font-semibold">No business service tasks assigned yet.</p>
                <p>Ensure your profile is up to date and you are "Available for Direct Assignments". Students with Expert VA plans may assign tasks to you directly.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                {tasks.map(task => {
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
                                  <DropdownMenuItem className="text-green-600 focus:text-green-700 focus:bg-green-50" onClick={() => {setSelectedTask(task); handleAcceptTask();}}>
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
                               <DropdownMenuItem onClick={() => handleContactStudent(task)}> 
                                <MessageSquare className="mr-2 h-4 w-4" />Contact Student
                              </DropdownMenuItem>
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
    </div>
  );
}

