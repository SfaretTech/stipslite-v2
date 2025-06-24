
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { ArrowRight, MoreHorizontal, CheckCircle, Clock, AlertCircle, DollarSign, ClipboardList, Loader2, XCircle as XCircleIcon, Info } from "lucide-react"; 
import Link from "next/link";
import { useToast } from "@/hooks/use-toast"; 
import { useRouter } from "next/navigation"; 
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

type StudentTaskStatus = 
  | "Pending Approval" 
  | "VA Quote Received - Action Needed" 
  | "Approved - Payment Due" 
  | "In Progress" 
  | "Completed" 
  | "Rejected"
  | "Quote Rejected"; 

interface TaskListItem {
  id: string; 
  title: string;
  type: string; 
  pages: number;
  submittedDate: string; 
  status: StudentTaskStatus;
  estimatedCost?: string;
  deadline?: string; 
}

const mockTasks: TaskListItem[] = [
    { id: "TSK001", title: "Literature Review on AI Ethics", type: "Research", pages: 15, submittedDate: "2024-07-25", status: "Pending Approval", deadline: "2024-08-10" },
    { id: "TSK002", title: "Business Plan for a Startup", type: "Business", pages: 30, submittedDate: "2024-07-24", status: "Approved - Payment Due", estimatedCost: "₦250.00", deadline: "2024-08-15" },
    { id: "TSK003", title: "Data Analysis Project", type: "Data Analysis", pages: 10, submittedDate: "2024-07-23", status: "In Progress", estimatedCost: "₦150.00", deadline: "2024-08-05" },
    { id: "TSK004", title: "Presentation Slides Design", type: "Design", pages: 20, submittedDate: "2024-07-22", status: "Completed", estimatedCost: "₦100.00" },
];


const studentStatusColors: Record<StudentTaskStatus, string> = {
  "Pending Approval": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "VA Quote Received - Action Needed": "bg-orange-100 text-orange-700 border-orange-300",
  "Approved - Payment Due": "bg-blue-100 text-blue-700 border-blue-300",
  "In Progress": "bg-indigo-100 text-indigo-700 border-indigo-300",
  "Completed": "bg-green-100 text-green-700 border-green-300",
  "Rejected": "bg-red-100 text-red-700 border-red-300",
  "Quote Rejected": "bg-pink-100 text-pink-700 border-pink-300",
};

const studentStatusIcons: Record<StudentTaskStatus, React.ElementType> = {
  "Pending Approval": Clock,
  "VA Quote Received - Action Needed": AlertCircle, 
  "Approved - Payment Due": DollarSign,
  "In Progress": Clock, 
  "Completed": CheckCircle,
  "Rejected": AlertCircle,
  "Quote Rejected": XCircleIcon, 
};


export function TaskList() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskListItem[]>(mockTasks);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    // TODO: Re-implement Firestore data fetching logic here.
    // For now, we just use the mock data.
    if (!user) {
      setError("You must be logged in to view tasks.");
    } else {
        setError(null);
        setTasks(mockTasks);
    }
    setIsLoading(false);
  }, [user]);


  const handleProceedToPayment = (taskId: string, taskTitle: string, amount?: string) => {
    toast({
      title: "Initiating Flutterwave Payment...",
      description: `Preparing payment for task: ${taskTitle} (Amount: ${amount || 'N/A'}). Please wait.`,
    });
    setTimeout(() => {
      toast({
        title: "Payment Successful (Simulated)",
        description: `Payment for ${taskTitle} processed. Task status will update shortly.`,
        variant: "default",
      });
      router.push(`/dashboard/tasks/${taskId}?payment_success=true`);
    }, 2500);
  };


  if (isLoading) {
    return (
        <Card className="shadow-xl">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">My Submitted Tasks</CardTitle>
                <CardDescription>Track the status and details of all your tasks.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading your tasks...</p>
            </CardContent>
        </Card>
    );
  }

  if (error) {
    return (
        <Card className="shadow-xl">
             <CardHeader>
                <CardTitle className="font-headline text-2xl">My Submitted Tasks</CardTitle>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Loading Tasks</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">My Submitted Tasks</CardTitle>
        <CardDescription>Track the status and details of all your tasks.</CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No tasks submitted yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Ready to get started? Submit your first task.
            </p>
            <Button className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link href="/dashboard/tasks/submit">Submit New Task</Link>
            </Button>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => {
                const StatusIcon = studentStatusIcons[task.status] || Info; 
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium font-mono text-xs">{task.id.substring(0,8)}...</TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.type}</TableCell>
                    <TableCell>{task.pages}</TableCell>
                    <TableCell>{task.submittedDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${studentStatusColors[task.status] || "bg-gray-100 text-gray-700 border-gray-300"}`}>
                        <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                        {task.status}
                      </Badge>
                      {task.status === "Approved - Payment Due" && task.estimatedCost && (
                        <p className="text-xs text-blue-600 mt-1">Cost: {task.estimatedCost}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Task Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/tasks/${task.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          {task.status === "Approved - Payment Due" && (
                            <DropdownMenuItem 
                              className="text-green-600 focus:bg-green-100 focus:text-green-700"
                              onClick={() => handleProceedToPayment(task.id, task.title, task.estimatedCost)}
                            >
                                <DollarSign className="mr-2 h-4 w-4" /> Proceed to Payment
                            </DropdownMenuItem>
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
      {tasks.length > 0 && (
        <CardFooter className="justify-end pt-6">
          <Button variant="outline" asChild>
            <Link href="/dashboard/tasks/archive">View Archived Tasks <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
