
"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, MessageSquare, Paperclip, DollarSign, CheckCircle, Clock, AlertCircle, Check, X } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast"; // Added for toast notifications
import { useState } from "react"; // Added for managing local state if needed for interactions

// Mock task data - in a real app, fetch this based on taskId
const initialMockTaskDetails = {
  TSK001: { 
    id: "TSK001", 
    title: "Literature Review - Chapter 1", 
    type: "Research", 
    pages: 15, 
    submittedDate: "2024-07-10", 
    // Status changed to reflect VA has quoted
    status: "VA Quote Received - Action Needed" as TaskStatusStudent, 
    description: "Conduct a comprehensive literature review for the first chapter of the research paper on renewable energy sources. Focus on studies published in the last 5 years. Include at least 20 relevant sources.",
    attachments: [{name: "guidelines.pdf", size: "1.2MB"}, {name: "initial_outline.docx", size:"300KB"}],
    // This is now the VA's quoted price
    estimatedCost: "₦65.00", 
    vaName: "Aisha Bello", // Name of VA who quoted
    deadline: "2024-07-25",
    comments: [
        {user: "Admin", text: "Task assigned to VA Aisha Bello. Awaiting their quote.", timestamp: "2024-07-10 10:00 AM"},
        {user: "VA Aisha Bello", text: "Quote submitted for your review.", timestamp: "2024-07-10 14:00PM"}
    ]
  },
  TSK002: { 
    id: "TSK002", 
    title: "Marketing Presentation Q3", 
    type: "Presentation", 
    pages: 20, 
    submittedDate: "2024-07-08", 
    status: "In Progress" as TaskStatusStudent,
    description: "Create a 20-slide presentation for the Q3 marketing strategy. Include market analysis, competitor overview, proposed campaigns, and budget allocation.",
    attachments: [],
    estimatedCost: "₦75.00",
    deadline: "2024-07-20",
    comments: []
  },
  TSK003: { 
    id: "TSK003", 
    title: "Calculus Problem Set", 
    type: "Assignment", 
    pages: 5, 
    submittedDate: "2024-07-05", 
    status: "Completed"  as TaskStatusStudent,
    description: "Solve problems 1-10 from Chapter 3 of the textbook.",
    attachments: [],
    estimatedCost: "₦30.00",
    deadline: "2024-07-10",
    comments: []
  },
};

type TaskStatusStudent = 
  | "Pending Approval" 
  | "VA Quote Received - Action Needed" // New status for student to see VA's quote
  | "Approved - Payment Due" 
  | "In Progress" 
  | "Completed" 
  | "Rejected"
  | "Quote Rejected"; // Student rejected VA's quote

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
  "VA Quote Received - Action Needed": Edit, // Using Edit icon to signify action needed on quote
  "Approved - Payment Due": DollarSign,
  "In Progress": Clock,
  "Completed": CheckCircle,
  "Rejected": AlertCircle,
  "Quote Rejected": X,
};


export default function TaskDetailPage() {
  const paramsFromHook = useParams();
  const params = { taskId: paramsFromHook.taskId as string };
  const taskId = params.taskId;
  const { toast } = useToast();

  // Use state to manage task details to allow for updates
  const [taskDetails, setTaskDetails] = useState(initialMockTaskDetails);
  // @ts-ignore
  const task = taskDetails[taskId];

  const handleAcceptQuote = () => {
    if (!task) return;
    // @ts-ignore
    setTaskDetails(prevDetails => ({
      ...prevDetails,
      [taskId]: { ...prevDetails[taskId], status: "Approved - Payment Due" }
    }));
    toast({
      title: "VA Quote Accepted!",
      description: `You have accepted the quote of ${task.estimatedCost}. Please proceed with payment to start the task. VA ${task.vaName} will be notified.`,
      variant: "default",
      duration: 7000,
    });
    // In a real app, this would trigger backend updates and notify the VA.
    // For simulation, the VA's task status on their /va/business-tasks page would eventually change.
  };

  const handleRejectQuote = () => {
    if (!task) return;
    // @ts-ignore
    setTaskDetails(prevDetails => ({
      ...prevDetails,
      [taskId]: { ...prevDetails[taskId], status: "Quote Rejected" }
    }));
    toast({
      title: "VA Quote Rejected",
      description: `You have rejected the quote from VA ${task.vaName}. The VA will be notified. You may need to discuss further or the task might be reassigned.`,
      variant: "destructive",
      duration: 7000,
    });
    // In a real app, notify VA. VA's task status on their end would change.
  };


  if (!task) {
    return (
      <div>
        <PageHeader title="Task Not Found" description="The requested task could not be found." />
        <Card>
          <CardContent className="pt-6">
            <p>Sorry, we couldn't find details for task ID: {taskId}. It might have been removed or the ID is incorrect.</p>
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

  const StatusIcon = studentStatusIcons[task.status as TaskStatusStudent];

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
                <span>Type: <Badge variant="secondary">{task.type}</Badge></span>
                <span>Pages/Slides: {task.pages}</span>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2 text-primary/90">Description:</h3>
              <p className="text-foreground/80 whitespace-pre-wrap">{task.description}</p>
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
                        <span className="text-xs text-muted-foreground ml-2">({att.size})</span>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
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
              <CardTitle className="font-headline text-lg">Task Status &amp; Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <StatusIcon className={`h-5 w-5 mr-2 ${studentStatusColors[task.status as TaskStatusStudent].split(' ')[1]}`} />
                <Badge variant="outline" className={`text-sm ${studentStatusColors[task.status as TaskStatusStudent]}`}>{task.status}</Badge>
              </div>
              <p className="text-sm"><span className="font-medium text-muted-foreground">Submitted:</span> {task.submittedDate}</p>
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
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-2">
                  <DollarSign className="mr-2 h-4 w-4" /> Proceed to Payment
                </Button>
              )}

              {task.status === "VA Quote Received - Action Needed" && (
                <div className="mt-3 space-y-2 border-t pt-3">
                    <h4 className="text-sm font-medium text-center mb-2">Respond to VA Quote:</h4>
                    <Button onClick={handleAcceptQuote} className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Check className="mr-2 h-4 w-4"/> Accept VA Quote ({task.estimatedCost})
                    </Button>
                    <Button onClick={handleRejectQuote} variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
                        <X className="mr-2 h-4 w-4"/> Reject VA Quote
                    </Button>
                </div>
              )}
               {task.status === "Quote Rejected" && (
                 <p className="text-sm text-pink-700 p-2 bg-pink-50 border border-pink-200 rounded-md">You have rejected the VA's quote. You may contact support or the VA if further discussion is needed.</p>
               )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Comments &amp; Updates</CardTitle>
            </CardHeader>
            <CardContent>
              {task.comments && task.comments.length > 0 ? (
                <ul className="space-y-3 text-sm">
                  {task.comments.map((comment, index) => (
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
                  <textarea className="w-full p-2 border rounded-md text-sm" rows={2} placeholder="Add a comment..."></textarea>
                  <Button size="sm" className="mt-2 w-full bg-accent hover:bg-accent/90 text-accent-foreground">
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

