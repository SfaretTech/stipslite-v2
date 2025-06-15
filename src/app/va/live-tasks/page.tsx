
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Signal, Eye, Check, FileText, DollarSign, CalendarDays } from "lucide-react"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LiveTask {
  id: string;
  title: string;
  studentId: string; 
  deadline: string; 
  payoutEstimate: string;
  brief: string;
  category: string; 
  pagesOrDuration: string; 
  attachments?: { name: string, url: string }[];
}

const mockLiveTasksInitial: LiveTask[] = [
  { id: "LT001", title: "Urgent Proofreading - English Essay", studentId: "SID789", deadline: "2024-07-25", payoutEstimate: "₦20.00 - ₦30.00", brief: "Proofread a 5-page English literature essay for grammar, spelling, and punctuation errors. APA 7th edition.", category: "Proofreading", pagesOrDuration: "5 pages", attachments: [{name: "essay_draft.docx", url: "#"}]},
  { id: "LT002", title: "Quick Data Entry - Survey Responses", studentId: "SID123", deadline: "2024-07-26", payoutEstimate: "₦15.00", brief: "Enter 100 survey responses from scanned images into an Excel sheet. Template provided.", category: "Data Entry", pagesOrDuration: "Approx 2 hours", attachments: [{name: "survey_scans.zip", url: "#"}, {name: "excel_template.xlsx", url: "#"}]},
  { id: "LT003", title: "Simple Logo Design for Student Club", studentId: "SID456", deadline: "2024-07-28", payoutEstimate: "₦40.00 - ₦60.00", brief: "Design a simple, modern logo for a university debate club. Name: 'The Orators'. Preferred colors: Blue and Gold.", category: "Design", pagesOrDuration: "1 concept" },
];

export default function VaLiveTasksPage() {
  const [liveTasks, setLiveTasks] = useState<LiveTask[]>(mockLiveTasksInitial);
  const [selectedTask, setSelectedTask] = useState<LiveTask | null>(null);
  const { toast } = useToast();

  const handleAcceptTask = (taskToAccept: LiveTask) => {
    setLiveTasks(prev => prev.filter(t => t.id !== taskToAccept.id));
    toast({ 
      title: "Task Accepted!", 
      description: `Task "${taskToAccept.title}" has been accepted and notionally moved to your Business Service Tasks. Please check there to manage it.`,
      duration: 7000,
    });
    setSelectedTask(null); 
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Live Tasks"
        description="Browse tasks available for VAs. Accept tasks that match your skills."
        icon={Signal} 
      />
      <Dialog open={!!selectedTask} onOpenChange={(isOpen) => !isOpen && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-lg">
            {selectedTask && (
            <>
                <DialogHeader>
                    <DialogTitle>{selectedTask.title} (Live Task ID: {selectedTask.id})</DialogTitle>
                    <DialogDescription>
                      Category: {selectedTask.category} | Deadline: {selectedTask.deadline} | Est. Payout: {selectedTask.payoutEstimate}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="space-y-1">
                        <Label className="font-semibold text-primary">Task Brief:</Label>
                        <p className="text-sm text-foreground/80 p-3 bg-muted/10 border rounded-md whitespace-pre-wrap">{selectedTask.brief}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong className="text-muted-foreground">Student ID:</strong> {selectedTask.studentId}</div>
                        <div><strong className="text-muted-foreground">Est. Size:</strong> {selectedTask.pagesOrDuration}</div>
                    </div>
                     {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
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
                </div>
                <DialogFooter className="border-t pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Close</Button>
                    </DialogClose>
                    <Button onClick={() => handleAcceptTask(selectedTask)} className="bg-green-600 hover:bg-green-700 text-white">
                        <Check className="mr-2 h-4 w-4" />Accept This Task
                    </Button>
                </DialogFooter>
            </>
            )}
        </DialogContent>
      </Dialog>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Available Live Tasks ({liveTasks.length})</CardTitle>
          <CardDescription>These tasks are open for any qualified VA to accept.</CardDescription>
        </CardHeader>
        <CardContent>
          {liveTasks.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground">
                <Signal className="mx-auto h-16 w-16 mb-4" /> 
                <p className="text-xl font-semibold">No live tasks available right now.</p>
                <p>Check back later, or ensure your skills in your profile are up to date.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveTasks.map(task => (
                <Card key={task.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-headline text-lg">{task.title}</CardTitle>
                    <CardDescription>Student ID: {task.studentId} <Badge variant="secondary" className="ml-2">{task.category}</Badge></CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm flex-grow">
                    <p className="line-clamp-3 text-muted-foreground">{task.brief}</p>
                    <div className="pt-1">
                        <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-1.5 text-primary/70"/> <strong>Deadline:</strong> {task.deadline}</p>
                        <p className="flex items-center"><DollarSign className="h-4 w-4 mr-1.5 text-primary/70"/> <strong>Est. Payout:</strong> {task.payoutEstimate}</p>
                        <p className="flex items-center"><FileText className="h-4 w-4 mr-1.5 text-primary/70"/> <strong>Size:</strong> {task.pagesOrDuration}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t">
                    <Button 
                        variant="outline" 
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                        onClick={() => setSelectedTask(task)}
                    >
                      <Eye className="mr-2 h-4 w-4" />View Details & Accept
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
