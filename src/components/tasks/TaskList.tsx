
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, MoreHorizontal, CheckCircle, Clock, AlertCircle, DollarSign, ClipboardList, Loader2 } from "lucide-react"; 
import Link from "next/link";
import { useToast } from "@/hooks/use-toast"; 
import { useRouter } from "next/navigation"; 
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { format } from "date-fns";

type StudentTaskStatus = 
  | "Pending Approval" 
  | "VA Quote Received - Action Needed" 
  | "Approved - Payment Due" 
  | "In Progress" 
  | "Completed" 
  | "Rejected"
  | "Quote Rejected";

interface TaskListItem {
  id: string; // Document ID
  title: string;
  type: string; // maps to taskType from Firestore
  pages: number;
  submittedDate: string; // ISO string from Firestore's submissionDate
  status: StudentTaskStatus;
  estimatedCost?: string;
  deadline?: string; // ISO string from Firestore
}

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
  "VA Quote Received - Action Needed": AlertCircle, // Or another icon like Edit
  "Approved - Payment Due": DollarSign,
  "In Progress": Clock, 
  "Completed": CheckCircle,
  "Rejected": AlertCircle,
  "Quote Rejected": XCircle, // Assuming XCircle is available or use X
};
import { XCircle } from "lucide-react"; // Ensure XCircle is imported if used


export function TaskList() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      // Optionally, redirect to login or show a message if user is not authenticated
      return;
    }

    setIsLoading(true);
    const q = query(
      collection(db, "tasks"), 
      where("studentUid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTasks: TaskListItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedTasks.push({
          id: doc.id,
          title: data.taskTitle,
          type: data.taskType,
          pages: data.pages,
          submittedDate: data.submissionDate ? format(new Date(data.submissionDate), "yyyy-MM-dd") : 'N/A',
          status: data.status as StudentTaskStatus, // Ensure status matches
          estimatedCost: data.estimatedCost,
          deadline: data.deadline ? format(new Date(data.deadline), "yyyy-MM-dd") : undefined,
        });
      });
      setTasks(fetchedTasks);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching tasks:", error);
      toast({ title: "Error", description: "Could not fetch tasks.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [user, toast]);


  const handleProceedToPayment = (taskId: string, taskTitle: string, amount?: string) => {
    toast({
      title: "Initiating Flutterwave Payment...",
      description: `Preparing payment for task: ${taskTitle} (Amount: ${amount || 'N/A'}). Please wait.`,
    });
    // Simulate API call and redirection
    setTimeout(() => {
      toast({
        title: "Payment Successful (Simulated)",
        description: `Payment for ${taskTitle} processed. Task status will update shortly.`,
        variant: "default",
      });
      // For UI simulation, navigate and let TaskDetailPage handle status from query param
      // In a real app, this might trigger a Firestore update which onSnapshot would then pick up.
      router.push(`/dashboard/tasks/${taskId}?payment_success=true`);
    }, 2500);
  };


  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">My Submitted Tasks</CardTitle>
        <CardDescription>Track the status and details of all your tasks.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">Loading your tasks...</p>
            </div>
        ) : tasks.length === 0 ? (
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
                const StatusIcon = studentStatusIcons[task.status];
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium font-mono text-xs">{task.id.substring(0,8)}...</TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.type}</TableCell>
                    <TableCell>{task.pages}</TableCell>
                    <TableCell>{task.submittedDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${studentStatusColors[task.status]}`}>
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
                          {task.status === "Pending Approval" && ( // Example of another action
                            <DropdownMenuItem disabled>Cancel Submission (Future)</DropdownMenuItem>
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
