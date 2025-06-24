
"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Edit, MessageSquare, Paperclip, DollarSign, CheckCircle, Clock, AlertCircle, Check, X, Loader2, XCircle as XCircleIcon, Info } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { format } from "date-fns";

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
  submissionDate: string; 
  status: TaskStatusStudent;
  taskDescription: string;
  attachments?: { name: string; url: string; size?: string }[];
  estimatedCost?: string | null; 
  vaName?: string | null;
  deadline?: string | null; 
  studentComments?: { user: string; text: string; timestamp: string }[]; 
  paymentStatus?: "Unpaid" | "Paid by Student" | "VA Payout Pending" | "VA Paid" | "Refunded";
}

const mockTaskData: Record<string, TaskDetail> = {
    "TSK001": {
        id: "TSK001",
        title: "Literature Review on AI Ethics",
        taskType: "Research",
        pages: 15,
        submissionDate: "2024-07-25 10:00 AM",
        status: "Pending Approval",
        taskDescription: "A detailed literature review on the ethical implications of AI in modern society. Focus on bias in algorithms and data privacy.",
        attachments: [{ name: "guidelines.pdf", url: "#" }],
        paymentStatus: "Unpaid"
    },
    "TSK002": {
        id: "TSK002",
        title: "Business Plan for a Startup",
        taskType: "Business",
        pages: 30,
        submissionDate: "2024-07-24 11:30 AM",
        status: "Approved - Payment Due",
        taskDescription: "Develop a comprehensive business plan for a new tech startup in the fintech space.",
        estimatedCost: "₦250.00",
        paymentStatus: "Unpaid"
    }
};


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
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    setIsLoading(true);
    // TODO: Re-implement Firestore onSnapshot logic here
    setTimeout(() => {
      // @ts-ignore
      const fetchedTask = mockTaskData[taskId];
      if (fetchedTask) {
        setTask(fetchedTask);
      } else {
        setError("Task not found.");
      }
      setIsLoading(false);
    }, 500);
  }, [taskId]);

  const updateTaskStatus = (newStatus: TaskStatusStudent) => {
    if (!task) return;
    setIsUpdating(true);
    // TODO: Re-implement Firestore updateDoc logic here
    console.log(`Simulating update for task ${task.id}: new status is ${newStatus}`);
    setTimeout(() => {
      // @ts-ignore
      setTask(prev => prev ? {...prev, status: newStatus} : null);
      toast({
        title: "Task Updated (Simulated)",
        description: `Task status changed to "${newStatus}".`,
      });
      setIsUpdating(false);
    }, 1000);
  };

  const handleAcceptQuote = () => {
    updateTaskStatus("Approved - Payment Due");
  };
  
  const handleRejectQuote = () => {
    updateTaskStatus("Quote Rejected");
  };

  const handleProceedToPayment = () => {
    if (!task) return;
    setIsUpdating(true);
    toast({
      title: "Initiating Flutterwave Payment...",
      description: `Preparing payment for task: ${task.title} (Amount: ${task.estimatedCost}). Please wait.`,
    });

    setTimeout(() => {
      // Simulate successful payment
      updateTaskStatus("In Progress");
      // @ts-ignore
      setTask(prev => prev ? {...prev, paymentStatus: 'Paid by Student'} : null);
      toast({
        title: "Payment Successful (Simulated via Flutterwave)",
        description: `Payment for ${task.title} processed. Task is now In Progress.`,
      });
      setIsUpdating(false);
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

  const StatusIcon = studentStatusIcons[task.status] || Info;

  return (
    <div className="space-y-8">
      <PageHeader 
        title={`Task Details: ${task.title}`}
        description={`Viewing information for task ID: ${task.id}`}
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
                  Proceed to Payment via Flutterwave
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
