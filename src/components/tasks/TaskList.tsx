"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, MoreHorizontal, CheckCircle, Clock, AlertCircle, DollarSign, ClipboardList } from "lucide-react"; // Added ClipboardList for empty state
import Link from "next/link";
import { useToast } from "@/hooks/use-toast"; // Added useToast
import { useRouter } from "next/navigation"; // Added useRouter

type TaskStatus = "Pending Approval" | "Approved - Payment Due" | "In Progress" | "Completed" | "Rejected";

interface Task {
  id: string;
  title: string;
  type: string;
  pages: number;
  submittedDate: string;
  status: TaskStatus;
  estimatedCost?: string;
}

const mockTasks: Task[] = [
  { id: "TSK001", title: "Literature Review - Chapter 1", type: "Research", pages: 15, submittedDate: "2024-07-10", status: "Approved - Payment Due", estimatedCost: "₦65.00" }, // Updated cost to match detail page
  { id: "TSK002", title: "Marketing Presentation Q3", type: "Presentation", pages: 20, submittedDate: "2024-07-08", status: "In Progress" },
  { id: "TSK003", title: "Calculus Problem Set", type: "Assignment", pages: 5, submittedDate: "2024-07-05", status: "Completed" },
  { id: "TSK004", title: "History Essay - WW2 Impact", type: "Essay", pages: 8, submittedDate: "2024-07-12", status: "Pending Approval" },
  { id: "TSK005", title: "App Dev Proposal", type: "Report", pages: 12, submittedDate: "2024-07-01", status: "Rejected" },
];

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

export function TaskList() {
  const { toast } = useToast();
  const router = useRouter();

  const handleProceedToPayment = (taskId: string, taskTitle: string, amount?: string) => {
    toast({
      title: "Initiating Flutterwave Payment...",
      description: `Preparing payment for task: ${taskTitle} (Amount: ${amount || 'N/A'}). Please wait.`,
    });
    // Simulate API call and redirection
    setTimeout(() => {
      toast({
        title: "Payment Successful (Simulated)",
        description: `Payment for ${taskTitle} processed. Task is now In Progress.`,
        variant: "default",
      });
      // Here you would typically navigate or update task status from backend response
      // For simulation, we can navigate to the task detail page.
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
        {mockTasks.length === 0 ? (
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
              {mockTasks.map((task) => {
                const StatusIcon = statusIcons[task.status];
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.id}</TableCell>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.type}</TableCell>
                    <TableCell>{task.pages}</TableCell>
                    <TableCell>{task.submittedDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${statusColors[task.status]}`}>
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
                          {task.status === "Pending Approval" && (
                            <DropdownMenuItem>Cancel Submission</DropdownMenuItem>
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
      {mockTasks.length > 0 && (
        <CardFooter className="justify-end pt-6">
          <Button variant="outline" asChild>
            <Link href="/dashboard/tasks/archive">View Archived Tasks <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
