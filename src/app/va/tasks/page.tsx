
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CheckCircle, Clock, Eye, MessageSquare, MoreHorizontal, AlertCircle, Check, X } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


type TaskStatusVA = "Pending Acceptance" | "In Progress" | "Submitted - Awaiting Review" | "Revision Requested" | "Completed" | "Cancelled";

interface AssignedTask {
  id: string;
  title: string;
  studentName: string;
  submittedDate: string; // Date student submitted to platform
  assignedDate: string; // Date VA was assigned or accepted
  deadline: string; // Deadline for VA to complete
  status: TaskStatusVA;
  payoutAmount: string;
  brief: string;
}

const mockAssignedTasks: AssignedTask[] = [
  { id: "TSK123", title: "Advanced Calculus Problem Set", studentName: "John Student", submittedDate: "2024-07-20", assignedDate: "2024-07-21", deadline: "2024-07-25", status: "Pending Acceptance", payoutAmount: "₦75.00", brief: "Solve problems 1-10 from Chapter 5. Show all work." },
  { id: "TSK101", title: "Literature Review - Chapter 1", studentName: "Alice Scholar", submittedDate: "2024-07-10", assignedDate: "2024-07-12", deadline: "2024-07-18", status: "In Progress", payoutAmount: "₦50.00", brief: "Comprehensive literature review for renewable energy sources." },
  { id: "TSK088", title: "Marketing Presentation Q3", studentName: "Bob Marketer", submittedDate: "2024-07-08", assignedDate: "2024-07-09", deadline: "2024-07-15", status: "Submitted - Awaiting Review", payoutAmount: "₦120.00", brief: "20-slide presentation for Q3 marketing strategy." },
  { id: "TSK075", title: "Python API Integration", studentName: "Carol Coder", submittedDate: "2024-07-05", assignedDate: "2024-07-06", deadline: "2024-07-12", status: "Revision Requested", payoutAmount: "₦90.00", brief: "Integrate Stripe API into existing Django app. Student noted a bug in error handling." },
  { id: "TSK050", title: "History Essay - WW2 Impact", studentName: "David Historian", submittedDate: "2024-06-25", assignedDate: "2024-06-26", deadline: "2024-07-02", status: "Completed", payoutAmount: "₦60.00", brief: "Detailed essay on the socio-economic impact of WW2." },
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
  // TODO: Add state and handlers for accepting/declining tasks, submitting work, etc.

  return (
    <div className="space-y-8">
      <PageHeader 
        title="My Assigned Tasks"
        description="Manage tasks assigned to you. Accept new tasks, submit completed work, and track progress."
        icon={Briefcase}
      />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Task Queue ({mockAssignedTasks.length})</CardTitle>
          <CardDescription>Overview of all tasks currently in your queue.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockAssignedTasks.length === 0 ? (
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
                {mockAssignedTasks.map(task => {
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
                        <Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DialogTrigger asChild>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />View Details & Brief
                                </DropdownMenuItem>
                              </DialogTrigger>
                              {task.status === "Pending Acceptance" && (
                                <>
                                  <DropdownMenuItem className="text-green-600 focus:text-green-700">
                                    <Check className="mr-2 h-4 w-4" />Accept Task
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 focus:text-red-700">
                                    <X className="mr-2 h-4 w-4" />Decline Task
                                  </DropdownMenuItem>
                                </>
                              )}
                              {task.status === "In Progress" && (
                                <DialogTrigger asChild>
                                  <DropdownMenuItem className="text-blue-600 focus:text-blue-700">
                                      Submit Work
                                  </DropdownMenuItem>
                                </DialogTrigger>
                              )}
                              {task.status === "Revision Requested" && (
                                <DialogTrigger asChild>
                                <DropdownMenuItem className="text-orange-600 focus:text-orange-700">
                                  Submit Revision
                                </DropdownMenuItem>
                                </DialogTrigger>
                              )}
                               <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />Contact Student (Future)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                           {/* Dialog for View Details / Submit Work / Submit Revision */}
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>{task.title} (ID: {task.id})</DialogTitle>
                              <DialogDescription>
                                Student: {task.studentName} | Deadline: {task.deadline} | Payout: {task.payoutAmount}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-1">
                                    <Label className="font-semibold">Task Brief:</Label>
                                    <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md whitespace-pre-wrap">{task.brief}</p>
                                </div>
                                {task.status === "Revision Requested" && (
                                    <div className="space-y-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <Label className="font-semibold text-yellow-700">Revision Notes from Student:</Label>
                                        <p className="text-sm text-yellow-600">[Placeholder for student's revision comments. E.g., "Please add more sources to section 2 and rephrase the conclusion."]</p>
                                    </div>
                                )}

                                {(task.status === "In Progress" || task.status === "Revision Requested") && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="submissionNotes">Submission Notes (Optional)</Label>
                                        <Textarea id="submissionNotes" placeholder="Any notes for the student or admin..." rows={3} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="attachments">Attach Completed Work</Label>
                                        <Input id="attachments" type="file" multiple />
                                        <p className="text-xs text-muted-foreground">Upload your completed files (e.g., .docx, .pdf, .zip).</p>
                                    </div>
                                </>
                                )}
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline">Close</Button>
                              {(task.status === "In Progress" || task.status === "Revision Requested") && (
                                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                  {task.status === "Revision Requested" ? "Submit Revised Work" : "Submit Completed Work"}
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
