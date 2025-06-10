
"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, MessageSquare, Paperclip, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

// Mock task data - in a real app, fetch this based on taskId
const mockTaskDetails = {
  TSK001: { 
    id: "TSK001", 
    title: "Literature Review - Chapter 1", 
    type: "Research", 
    pages: 15, 
    submittedDate: "2024-07-10", 
    status: "Approved - Payment Due", 
    description: "Conduct a comprehensive literature review for the first chapter of the research paper on renewable energy sources. Focus on studies published in the last 5 years. Include at least 20 relevant sources.",
    attachments: [{name: "guidelines.pdf", size: "1.2MB"}, {name: "initial_outline.docx", size:"300KB"}],
    estimatedCost: "$50.00",
    deadline: "2024-07-25",
    comments: [
        {user: "Admin", text: "Task approved. Please proceed with payment to start processing.", timestamp: "2024-07-11 09:00 AM"},
        {user: "Student", text: "Payment made. Looking forward to the draft.", timestamp: "2024-07-11 11:30 AM"}
    ]
  },
  TSK002: { 
    id: "TSK002", 
    title: "Marketing Presentation Q3", 
    type: "Presentation", 
    pages: 20, 
    submittedDate: "2024-07-08", 
    status: "In Progress",
    description: "Create a 20-slide presentation for the Q3 marketing strategy. Include market analysis, competitor overview, proposed campaigns, and budget allocation.",
    attachments: [],
    estimatedCost: "$75.00",
    deadline: "2024-07-20",
    comments: []
  },
  // Add other mock tasks if needed for testing different links
};

type TaskStatus = "Pending Approval" | "Approved - Payment Due" | "In Progress" | "Completed" | "Rejected";

const statusColors: Record<TaskStatus, string> = {
  "Pending Approval": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Approved - Payment Due": "bg-blue-100 text-blue-700 border-blue-300",
  "In Progress": "bg-indigo-100 text-indigo-700 border-indigo-300",
  "Completed": "bg-green-100 text-green-700 border-green-300",
  "Rejected": "bg-red-100 text-red-700 border-red-300",
};

const statusIcons: Record<TaskStatus, React.ElementType> = {
  "Pending Approval": Clock,
  "Approved - Payment Due": DollarSign,
  "In Progress": Clock,
  "Completed": CheckCircle,
  "Rejected": AlertCircle,
};


export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.taskId as string;
  
  // @ts-ignore
  const task = mockTaskDetails[taskId];

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

  const StatusIcon = statusIcons[task.status as TaskStatus];

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
              <CardTitle className="font-headline text-lg">Task Status & Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <StatusIcon className={`h-5 w-5 mr-2 ${statusColors[task.status as TaskStatus].split(' ')[1]}`} />
                <Badge variant="outline" className={`text-sm ${statusColors[task.status as TaskStatus]}`}>{task.status}</Badge>
              </div>
              <p className="text-sm"><span className="font-medium text-muted-foreground">Submitted:</span> {task.submittedDate}</p>
              {task.deadline && <p className="text-sm"><span className="font-medium text-muted-foreground">Deadline:</span> {task.deadline}</p>}
              {task.estimatedCost && <p className="text-sm"><span className="font-medium text-muted-foreground">Est. Cost:</span> <span className="font-semibold text-primary">{task.estimatedCost}</span></p>}
            
             {task.status === "Approved - Payment Due" && (
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-2">
                  <DollarSign className="mr-2 h-4 w-4" /> Proceed to Payment
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Comments & Updates</CardTitle>
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
                  {/* Placeholder for adding a new comment */}
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
