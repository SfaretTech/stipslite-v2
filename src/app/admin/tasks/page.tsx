
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardList, Check, X, Eye, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


const pendingTasks = [
  { id: "TSK101", title: "Market Analysis Report", user: "John Doe", submittedDate: "2024-07-15", type: "Report", pages: 20 },
  { id: "TSK102", title: "App UI Design", user: "Alice Smith", submittedDate: "2024-07-14", type: "Design", pages: 10 },
  { id: "TSK103", title: "Thesis Chapter 3", user: "Bob Johnson", submittedDate: "2024-07-13", type: "Research", pages: 30 },
];

export default function AdminTasksPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Task Approvals"
        description="Review, approve, set pricing, or reject submitted tasks."
        icon={ClipboardList}
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Pending Task Submissions</CardTitle>
          <CardDescription>There are {pendingTasks.length} tasks awaiting admin review.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingTasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.user}</TableCell>
                  <TableCell>{task.submittedDate}</TableCell>
                  <TableCell><Badge variant="secondary">{task.type}</Badge></TableCell>
                  <TableCell>{task.pages}</TableCell>
                  <TableCell className="space-x-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1 h-3.5 w-3.5" /> Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Review Task: {task.title}</DialogTitle>
                          <DialogDescription>
                            Details: Submitted by {task.user} on {task.submittedDate}. Type: {task.type}, Pages: {task.pages}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                           <p className="text-sm text-muted-foreground">
                            [Placeholder for full task details, description, and attachments]
                           </p>
                          <div className="space-y-2">
                            <Label htmlFor="estimatedCost">Set Estimated Cost (NGN)</Label>
                            <div className="relative">
                                <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                                <Input id="estimatedCost" type="number" placeholder="e.g., 25.00" className="pl-8" />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
                            <X className="mr-1 h-4 w-4" /> Reject Task
                          </Button>
                          <Button className="bg-green-600 hover:bg-green-700 text-white">
                            <Check className="mr-1 h-4 w-4" /> Approve & Set Cost
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
              {pendingTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No pending task submissions.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
