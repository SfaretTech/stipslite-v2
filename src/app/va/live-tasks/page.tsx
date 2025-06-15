
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Signal, Eye, Check, FileText, DollarSign, CalendarDays, Sparkles, Info } from "lucide-react"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // For potential navigation after claiming

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
  { id: "LT004", title: "Literature Search for Thesis", studentId: "SID007", deadline: "2024-07-30", payoutEstimate: "₦30.00 - ₦45.00", brief: "Find and summarize 10 peer-reviewed articles on the impact of social media on adolescent mental health published in the last 3 years.", category: "Research", pagesOrDuration: "10 summaries" },
  { id: "LT005", title: "PowerPoint Presentation Formatting", studentId: "SID008", deadline: "2024-07-27", payoutEstimate: "₦25.00", brief: "Format a 20-slide PowerPoint presentation according to university branding guidelines. Ensure consistency in fonts, colors, and layout.", category: "Presentation", pagesOrDuration: "20 slides", attachments: [{name: "draft_presentation.pptx", url: "#"}, {name: "branding_guide.pdf", url: "#"}]},
];

export default function VaLiveTasksPage() {
  const [liveTasks, setLiveTasks] = useState<LiveTask[]>(mockLiveTasksInitial);
  const [selectedTask, setSelectedTask] = useState<LiveTask | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleShowInterest = (taskToClaim: LiveTask) => {
    // Simulate claiming task: remove from live tasks, (conceptually) add to My Tasks
    setLiveTasks(prev => prev.filter(t => t.id !== taskToClaim.id));
    // In a real app, this would also update a backend and potentially add to a "my tasks" state elsewhere.
    
    toast({ 
      title: "Interest Expressed!", 
      description: `Task "${taskToClaim.title}" has been moved to your 'My Tasks' queue. Please go there to formally accept or decline it.`,
      duration: 7000,
      action: (
        <Button variant="outline" size="sm" onClick={() => router.push('/va/my-tasks')}>
          Go to My Tasks
        </Button>
      ),
    });
    setSelectedTask(null); // Close the dialog
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Live Tasks"
        description="Browse tasks available from the general student pool. Express interest to add them to your 'My Tasks' queue for review."
        icon={Signal} 
      />
      <Dialog open={!!selectedTask} onOpenChange={(isOpen) => !isOpen && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-lg">
            {selectedTask && (
            <>
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-primary" /> {selectedTask.title}
                    </DialogTitle>
                    <DialogDescription>
                      Live Task ID: {selectedTask.id} | Category: {selectedTask.category} 
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
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong className="text-muted-foreground flex items-center"><CalendarDays className="h-4 w-4 mr-1"/>Deadline:</strong> {selectedTask.deadline}</div>
                        <div><strong className="text-muted-foreground flex items-center"><DollarSign className="h-4 w-4 mr-1"/>Est. Payout:</strong> {selectedTask.payoutEstimate}</div>
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
                        <Button type="button" variant="outline">Not Interested</Button>
                    </DialogClose>
                    <Button onClick={() => handleShowInterest(selectedTask)} className="bg-green-600 hover:bg-green-700 text-white">
                        <Check className="mr-2 h-4 w-4" />I'm Interested, Add to My Queue
                    </Button>
                </DialogFooter>
            </>
            )}
        </DialogContent>
      </Dialog>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Available Live Tasks ({liveTasks.length})</CardTitle>
          <CardDescription>These tasks are open for any qualified VA to express interest in.</CardDescription>
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
                    <CardTitle className="font-headline text-lg line-clamp-2">{task.title}</CardTitle>
                    <CardDescription>
                        <Badge variant="secondary" className="mr-2">{task.category}</Badge>
                        Student ID: {task.studentId}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm flex-grow">
                    <p className="line-clamp-3 text-muted-foreground h-16">{task.brief}</p> {/* Fixed height for brief preview */}
                    <div className="pt-1 space-y-1">
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
                      <Eye className="mr-2 h-4 w-4" />View Details & Express Interest
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
            <div className="flex items-start text-sm text-muted-foreground p-2 bg-blue-50 border border-blue-200 rounded-md">
                <Info className="h-5 w-5 mr-2 mt-0.5 text-blue-600 shrink-0"/>
                <div>
                    Tasks you express interest in will move to your 'My Tasks' queue. 
                    You can then formally accept or decline them from there. This helps manage your workload effectively.
                </div>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}

