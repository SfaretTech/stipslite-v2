
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ListChecks, CheckCircle, Clock, Eye, MessageSquare, MoreHorizontal, AlertCircle, Check, X, Upload, FileText, Sparkles, Info } from "lucide-react";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type MyTaskStatusVA = "Pending Review" | "In Progress" | "Submitted - Awaiting Review" | "Revision Requested" | "Completed" | "Declined By VA";

interface MyTaskItem {
  id: string; // Could be same as Live Task ID initially
  title: string;
  studentId: string;
  deadline: string;
  payoutEstimate: string;
  brief: string;
  category: string;
  pagesOrDuration: string;
  attachments?: { name: string, url: string }[];
  status: MyTaskStatusVA;
  studentFeedback?: string; // For revision requests from student after submission
  declineReason?: string; // If VA declines it from "My Tasks"
}

// Tasks here are those the VA expressed interest in from Live Tasks
const mockMyTasksInitial: MyTaskItem[] = [
  { id: "LT001", title: "Urgent Proofreading - English Essay", studentId: "SID789", deadline: "2024-07-25", payoutEstimate: "₦20.00 - ₦30.00", brief: "Proofread a 5-page English literature essay for grammar, spelling, and punctuation errors. APA 7th edition.", category: "Proofreading", pagesOrDuration: "5 pages", attachments: [{name: "essay_draft.docx", url: "#"}], status: "Pending Review" },
  // Add more tasks if one was "taken" from Live Tasks for demo
];

const myTaskStatusColors: Record<MyTaskStatusVA, string> = {
  "Pending Review": "bg-orange-100 text-orange-700 border-orange-300",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
  "Submitted - Awaiting Review": "bg-purple-100 text-purple-700 border-purple-300",
  "Revision Requested": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Completed": "bg-green-100 text-green-700 border-green-300",
  "Declined By VA": "bg-red-100 text-red-700 border-red-300",
};

const myTaskStatusIcons: Record<MyTaskStatusVA, React.ElementType> = {
  "Pending Review": AlertCircle,
  "In Progress": Clock,
  "Submitted - Awaiting Review": Eye,
  "Revision Requested": MessageSquare,
  "Completed": CheckCircle,
  "Declined By VA": X,
};


export default function VaMyTasksPage() {
  const [myTasks, setMyTasks] = useState<MyTaskItem[]>(mockMyTasksInitial);
  const [selectedTask, setSelectedTask] = useState<MyTaskItem | null>(null);
  const [isDeclineSectionVisible, setIsDeclineSectionVisible] = useState(false);
  const [declineReasonInput, setDeclineReasonInput] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleOpenDialog = (task: MyTaskItem) => {
    setSelectedTask(task);
    setIsDeclineSectionVisible(false); 
    setDeclineReasonInput(""); 
    setSubmissionNotes(""); 
  };

  const handleAcceptWork = () => {
    if (!selectedTask) return;
    setMyTasks(prev => prev.map(t => t.id === selectedTask.id ? {...t, status: "In Progress"} : t));
    toast({ title: "Task Accepted & In Progress", description: `You have formally accepted task: ${selectedTask.title}.` });
    setSelectedTask(null); 
  };

  const handleConfirmDecline = () => {
    if (!selectedTask || !declineReasonInput.trim()) {
      toast({ title: "Reason Required", description: "Please provide a reason for declining this task from your queue.", variant: "destructive"});
      return;
    }
    setMyTasks(prev => prev.map(t => t.id === selectedTask.id ? {...t, status: "Declined By VA", declineReason: declineReasonInput } : t));
    toast({ title: "Task Declined from Queue", description: `Task ${selectedTask.title} declined. Reason: ${declineReasonInput}. It will be returned to the Live Tasks pool (simulated).` });
    setSelectedTask(null); 
    setDeclineReasonInput("");
    setIsDeclineSectionVisible(false);
  };
  
  const handleSubmitWork = () => {
    if(!selectedTask) return;
    const newStatus: MyTaskStatusVA = selectedTask.status === "Revision Requested" ? "Submitted - Awaiting Review" : "Submitted - Awaiting Review";
     setMyTasks(prev => prev.map(t => t.id === selectedTask.id ? {...t, status: newStatus} : t));
    toast({
        title: selectedTask.status === "Revision Requested" ? "Revision Submitted" : "Work Submitted",
        description: `Your work for task '${selectedTask.title}' has been submitted with notes: "${submissionNotes || 'No notes'}". Student will be notified.`
    });
    setSelectedTask(null);
    setSubmissionNotes("");
  };

  const handleContactStudent = (task: MyTaskItem) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('stipsLiteContactStudentTaskId', task.id);
        localStorage.setItem('stipsLiteContactStudentName', task.studentId); // Using studentId as name placeholder
    }
    router.push('/va/support');
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="My Tasks Queue"
        description="Tasks you've expressed interest in from 'Live Tasks'. Review details and formally accept or decline."
        icon={ListChecks}
      />
      <Dialog open={!!selectedTask} onOpenChange={(isOpen) => !isOpen && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-lg">
            {selectedTask && (
            <>
                <DialogHeader>
                    <DialogTitle className="flex items-center"><Sparkles className="h-5 w-5 mr-2 text-primary" />{selectedTask.title} (ID: {selectedTask.id})</DialogTitle>
                    <DialogDescription>
                    Student: {selectedTask.studentId} | Deadline: {selectedTask.deadline} | Payout Estimate: {selectedTask.payoutEstimate}
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

                    {selectedTask.status === "Pending Review" && isDeclineSectionVisible && (
                        <div className="space-y-2 pt-2 border-t mt-2">
                            <Label htmlFor="declineReasonMyTask" className="font-semibold text-destructive">Reason for Declining:</Label>
                            <Textarea 
                                id="declineReasonMyTask" 
                                value={declineReasonInput}
                                onChange={(e) => setDeclineReasonInput(e.target.value)}
                                placeholder="Provide a brief reason if you are no longer interested..." 
                                rows={3} 
                            />
                        </div>
                    )}

                    {(selectedTask.status === "In Progress" || selectedTask.status === "Revision Requested") && (
                    <>
                        <div className="space-y-2 pt-2 border-t mt-2">
                            <Label htmlFor="submissionNotesMyTask" className="font-semibold text-primary">Submission Notes (Optional):</Label>
                            <Textarea 
                                id="submissionNotesMyTask" 
                                value={submissionNotes}
                                onChange={(e) => setSubmissionNotes(e.target.value)}
                                placeholder="Any notes for the student or admin regarding your submission..." 
                                rows={3} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="attachmentsMyTask" className="font-semibold text-primary">Attach Completed Work:</Label>
                            <div className="flex items-center justify-center w-full">
                                <Label 
                                htmlFor="va-mytask-file-upload" 
                                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center pt-4 pb-5">
                                        <Upload className="w-7 h-7 mb-1 text-muted-foreground" />
                                        <p className="mb-1 text-xs text-muted-foreground">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">DOCX, PDF, ZIP, etc.</p>
                                    </div>
                                    <Input id="va-mytask-file-upload" type="file" className="hidden" multiple />
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

                    {selectedTask.status === "Pending Review" && !isDeclineSectionVisible && (
                        <>
                        <Button onClick={() => setIsDeclineSectionVisible(true)} variant="destructive" className="bg-red-600 hover:bg-red-700">
                            <X className="mr-2 h-4 w-4" />Decline Task
                        </Button>
                        <Button onClick={handleAcceptWork} className="bg-green-600 hover:bg-green-700 text-white">
                            <Check className="mr-2 h-4 w-4" />Accept & Start Work
                        </Button>
                        </>
                    )}
                    {selectedTask.status === "Pending Review" && isDeclineSectionVisible && (
                         <Button onClick={handleConfirmDecline} variant="destructive" className="bg-red-600 hover:bg-red-700" disabled={!declineReasonInput.trim()}>
                            Confirm Decline from My Queue
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
          <CardTitle className="font-headline">Tasks in My Queue ({myTasks.length})</CardTitle>
          <CardDescription>Tasks you've shown interest in. Formally accept them to start working, or decline if you're no longer available.</CardDescription>
        </CardHeader>
        <CardContent>
          {myTasks.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground">
                <ListChecks className="mx-auto h-16 w-16 mb-4" />
                <p className="text-xl font-semibold">Your 'My Tasks' queue is empty.</p>
                <p>Browse 'Live Tasks' to find work that interests you.</p>
                <Button asChild className="mt-4">
                    <Link href="/va/live-tasks">Browse Live Tasks</Link>
                </Button>
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
                  <TableHead>Est. Payout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myTasks.map(task => {
                  const StatusIcon = myTaskStatusIcons[task.status];
                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.id}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.studentId}</TableCell>
                      <TableCell>{task.deadline}</TableCell>
                      <TableCell className="font-semibold">{task.payoutEstimate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${myTaskStatusColors[task.status]}`}>
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
                              {task.status === "Pending Review" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-green-600 focus:text-green-700 focus:bg-green-50" onClick={() => {setSelectedTask(task); handleAcceptWork();}}>
                                    <Check className="mr-2 h-4 w-4" />Accept & Start Work
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
         <CardFooter className="border-t pt-4">
            <div className="flex items-start text-sm text-muted-foreground p-2 bg-blue-50 border border-blue-200 rounded-md">
                <Info className="h-5 w-5 mr-2 mt-0.5 text-blue-600 shrink-0"/>
                <div>
                    This page lists tasks you've shown interest in from 'Live Tasks'.
                    Here you can formally commit by clicking 'Accept & Start Work' or decline them.
                    Declined tasks will be removed from your queue (simulated return to Live Tasks).
                </div>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}

