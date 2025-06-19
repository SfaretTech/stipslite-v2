
"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert
import { ArrowLeft, Edit, MessageSquare, Paperclip, DollarSign, CheckCircle, Clock, AlertCircle, Check, X, Loader2, XCircle as XCircleIcon, Info } from "lucide-react"; // Renamed XCircle
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { format } from "date-fns";

// Task status as defined for student view / interactions
type TaskStatusStudent = 
  | "Pending Approval" 
  | "VA Quote Received - Action Needed" 
  | "Approved - Payment Due" 
  | "In Progress" 
  | "Completed" 
  | "Rejected"
  | "Quote Rejected"; 

interface TaskDetail {
  id: string;
  title: string;
  taskType: string;
  pages: number;
  submissionDate: string; // Formatted date string
  status: TaskStatusStudent;
  taskDescription: string;
  attachments?: { name: string; url: string; size?: string }[];
  estimatedCost?: string | null; 
  vaName?: string | null;
  deadline?: string | null; // Formatted date string
  studentComments?: { user: string; text: string; timestamp: string }[]; 
  paymentStatus?: "Unpaid" | "Paid by Student" | "VA Payout Pending" | "VA Paid" | "Refunded";
}


const studentStatusColors: Record<TaskStatusStudent, string> = {
  "Pending Approval": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "VA Quote Received - Action Needed": "bg-orange-100 text-orange-700 border-orange-300",
  "Approved - Payment Due": "bg-blue-100 text-blue-700 border-blue-300",
  "In Progress": "bg-indigo-100 text-indigo-700 border-indigo-300",
  "Completed": "bg-green-100 text-green-700 border-green-300",
  "Rejected": "bg-red-100 text-red-700 border-red-300",
  "Quote Rejected": "bg-pink-100 text-pink-700 border-pink-300",
};

const studentStatusIcons: Record<TaskStatusStudent, React.ElementType> = {
  "Pending Approval": Clock,
  "VA Quote Received - Action Needed": AlertCircle,
  "Approved - Payment Due": DollarSign,
  "In Progress": Clock,
  "Completed": CheckCircle,
  "Rejected": AlertCircle,
  "Quote Rejected": XCircleIcon,
};


export default function TaskDetailPage() {
  const paramsFromHook = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const taskId = paramsFromHook.taskId as string;

  const [task, setTask] = useState<TaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null); // Added error state

  useEffect(() => {
    if (!taskId) {
      setIsLoading(false);
      setError("Task ID is missing.");
      toast({ title: "Error", description: "Task ID is missing.", variant: "destructive" });
      // No router.push here, let error display handle it.
      return;
    }

    setIsLoading(true);
    setError(null);
    const taskRef = doc(db, "tasks", taskId);
    const unsubscribe = onSnapshot(taskRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        let formattedSubmissionDate = 'N/A';
        if (data.submissionDate) {
            try {
                formattedSubmissionDate = format(new Date(data.submissionDate), "PPP p");
            } catch (e) {
                 formattedSubmissionDate = typeof data.submissionDate === 'string' ? data.submissionDate : 'Invalid Date';
            }
        } else if (data.createdAt && data.createdAt.toDate) {
             try {
                formattedSubmissionDate = format(data.createdAt.toDate(), "PPP p");
            } catch (e) {}
        }
        setTask({
          id: docSnap.id,
          title: data.taskTitle,
          taskType: data.taskType,
          pages: data.pages,
          submissionDate: formattedSubmissionDate,
          status: data.status as TaskStatusStudent,
          taskDescription: data.taskDescription,
          attachments: data.attachments || [],
          estimatedCost: data.estimatedCost || (data.adminSetPriceNGN ? `₦${parseFloat(data.adminSetPriceNGN).toFixed(2)}` : null),
          vaName: data.assignedVaName || null,
          deadline: data.deadline ? format(new Date(data.deadline), "PPP") : null,
          studentComments: data.studentComments || [], 
          paymentStatus: data.paymentStatus,
        });
      } else {
        setError("Task not found.");
        toast({ title: "Not Found", description: "Task not found.", variant: "destructive" });
        setTask(null);
      }
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching task details:", err);
      setError("Could not fetch task details. Please try again later.");
      toast({ title: "Error", description: "Could not fetch task details.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [taskId, toast, router]);

  const updateTaskStatusInFirestore = async (newStatus: TaskStatusStudent, updates: Record<string, any> = {}) => {
    if (!task) return;
    setIsUpdating(true);
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        status: newStatus,
        ...updates,
        updatedAt: serverTimestamp(),
      });
      toast({
        title: "Task Updated",
        description: `Task status changed to "${newStatus}".`,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({ title: "Update Failed", description: "Could not update task status.", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAcceptQuote = () => {
    if (!task || task.status !== "VA Quote Received - Action Needed") return;
    updateTaskStatusInFirestore("Approved - Payment Due");
    toast({
      title: "VA Quote Accepted!",
      description: `You have accepted the quote of ${task.estimatedCost}. Please proceed with payment. VA ${task.vaName} will be notified.`,
      duration: 7000,
    });
  };

  const handleRejectQuote = () => {
    if (!task || task.status !== "VA Quote Received - Action Needed") return;
    updateTaskStatusInFirestore("Quote Rejected");
    toast({
      title: "VA Quote Rejected",
      description: `You have rejected the quote from VA ${task.vaName}. The VA will be notified. You may need to discuss further or the task might be reassigned.`,
      variant: "destructive",
      duration: 7000,
    });
  };

  const handleProceedToPayment = () => {
    if (!task || task.status !== "Approved - Payment Due") return;
    setIsUpdating(true); // Keep this to disable button immediately
    toast({
      title: "Initiating Flutterwave Payment...",
      description: `Preparing payment for task: ${task.title} (Amount: ${task.estimatedCost}). Please wait.`,
    });
    setTimeout(async () => { // Make async to await Firestore update
      await updateTaskStatusInFirestore("In Progress", { paymentStatus: "Paid by Student" }); // This will set isUpdating to false
      toast({
        title: "Payment Successful (Simulated)",
        description: `Payment for ${task.title} processed. Task is now In Progress.`,
      });
      // No router.push here, onSnapshot will update the task state.
    }, 2500);
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading task details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Error" description="Could not load task details." icon={AlertCircle}/>
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Failed to Load Task</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/dashboard/tasks">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Task List
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div>
        <PageHeader title="Task Not Found" description="The requested task could not be found or does not exist." icon={AlertCircle}/>
        <Card>
          <CardContent className="pt-6">
            <p>Sorry, we couldn't find details for this task. It might have been removed or the ID is incorrect.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/dashboard/tasks">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Task List
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = studentStatusIcons[task.status] || Info; // Fallback icon

  return (
    <div className="space-y-8">
      <PageHeader 
        title={`Task Details: ${task.title}`}
        description={`Viewing information for task ID: ${task.id.substring(0,8)}...`}
        icon={Edit}
        actions={
            <Button asChild variant="outline">
              <Link href="/dashboard/tasks">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Task List
              </Link>
            </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">{task.title}</CardTitle>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Type: <Badge variant="secondary">{task.taskType}</Badge></span>
                <span>Pages/Units: {task.pages}</span>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2 text-primary/90">Description:</h3>
              <p className="text-foreground/80 whitespace-pre-wrap">{task.taskDescription}</p>
            </CardContent>
          </Card>

          {task.attachments && task.attachments.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-lg">Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {task.attachments.map((att, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center">
                        <Paperclip className="h-4 w-4 mr-2 text-primary" />
                        <span>{att.name}</span>
                        {att.size && <span className="text-xs text-muted-foreground ml-2">({att.size})</span>}
                      </div>
                      <Button variant="outline" size="sm" asChild><a href={att.url} download target="_blank" rel="noopener noreferrer">Download</a></Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Task Status & Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <StatusIcon className={`h-5 w-5 mr-2 ${studentStatusColors[task.status]?.split(' ')[1] || 'text-gray-700'}`} />
                <Badge variant="outline" className={`text-sm ${studentStatusColors[task.status] || "bg-gray-100 text-gray-700 border-gray-300"}`}>{task.status}</Badge>
              </div>
              <p className="text-sm"><span className="font-medium text-muted-foreground">Submitted:</span> {task.submissionDate}</p>
              {task.deadline && <p className="text-sm"><span className="font-medium text-muted-foreground">Deadline:</span> {task.deadline}</p>}
              
              {task.status === "VA Quote Received - Action Needed" && task.estimatedCost && task.vaName && (
                <div className="p-3 my-2 bg-orange-50 border border-orange-200 rounded-md">
                    <p className="text-sm font-semibold text-orange-700">
                        VA <span className="text-orange-800">{task.vaName}</span> has quoted: <span className="text-lg">{task.estimatedCost}</span>
                    </p>
                    <p className="text-xs text-orange-600 mt-1">Please review and accept or reject the quote below.</p>
                </div>
              )}

              {task.status !== "VA Quote Received - Action Needed" && task.estimatedCost && (
                 <p className="text-sm"><span className="font-medium text-muted-foreground">Est. Cost:</span> <span className="font-semibold text-primary">{task.estimatedCost}</span></p>
              )}
            
             {task.status === "Approved - Payment Due" && (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
                  onClick={handleProceedToPayment}
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />} 
                  Proceed to Payment
                </Button>
              )}

              {task.status === "VA Quote Received - Action Needed" && (
                <div className="mt-3 space-y-2 border-t pt-3">
                    <h4 className="text-sm font-medium text-center mb-2">Respond to VA Quote:</h4>
                    <Button onClick={handleAcceptQuote} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4"/>} 
                        Accept VA Quote ({task.estimatedCost})
                    </Button>
                    <Button onClick={handleRejectQuote} variant="destructive" className="w-full bg-red-600 hover:bg-red-700" disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4"/>} 
                        Reject VA Quote
                    </Button>
                </div>
              )}
               {task.status === "Quote Rejected" && (
                 <p className="text-sm text-pink-700 p-2 bg-pink-50 border border-pink-200 rounded-md">You have rejected the VA's quote. You may contact support or the VA if further discussion is needed.</p>
               )}
                {task.paymentStatus && <p className="text-sm"><span className="font-medium text-muted-foreground">Payment:</span> {task.paymentStatus}</p>}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Comments & Updates</CardTitle>
            </CardHeader>
            <CardContent>
              {task.studentComments && task.studentComments.length > 0 ? (
                <ul className="space-y-3 text-sm">
                  {task.studentComments.map((comment, index) => (
                    <li key={index} className="p-2 bg-muted/30 rounded-md">
                      <p className="font-semibold">{comment.user}: <span className="font-normal">{comment.text}</span></p>
                      <p className="text-xs text-muted-foreground text-right">{comment.timestamp}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              )}
               <div className="mt-4">
                  <textarea className="w-full p-2 border rounded-md text-sm" rows={2} placeholder="Add a comment... (UI Only)" disabled={isUpdating}></textarea>
                  <Button size="sm" className="mt-2 w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isUpdating}>
                    <MessageSquare className="mr-2 h-4 w-4"/> Post Comment
                  </Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
