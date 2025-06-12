
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, UploadCloud, DollarSign, Users, Shuffle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const durationOptions = [
  { value: "1_hour", label: "1 Hour" },
  { value: "2_hours", label: "2 Hours" },
  { value: "3_hours", label: "3 Hours" },
  { value: "4_hours", label: "4 Hours" },
  { value: "6_hours", label: "6 Hours" },
  { value: "8_hours", label: "8 Hours (1 Work Day)" },
  { value: "1_day", label: "1 Day" },
  { value: "2_days", label: "2 Days" },
  { value: "3_days", label: "3 Days" },
  { value: "4_days", label: "4 Days" },
  { value: "5_days", label: "5 Days" },
  { value: "1_week", label: "1 Week" },
  { value: "2_weeks", label: "2 Weeks" },
  { value: "3_weeks", label: "3 Weeks" },
  { value: "1_month", label: "1 Month" },
];

export function TaskSubmissionForm() {
  const [submissionDate, setSubmissionDate] = useState<Date | undefined>(new Date());
  const [deadline, setDeadline] = useState<Date | undefined>();
  const { toast } = useToast();
  const router = useRouter();

  const performActualSubmission = (vaPreference: "specific" | "random") => {
    let vaMessage = "";
    if (vaPreference === "specific") {
      vaMessage = "Your task has been submitted. As per your request for a specific VA (Professional Plan feature), the task will be assigned to them for review and acceptance.";
    } else {
      vaMessage = "A Virtual Assistant will be assigned randomly to your task.";
    }

    toast({
      title: "Task Submitted Successfully!",
      description: `${vaMessage} Your task is now pending review and admin approval. Payment will be requested upon approval.`,
      variant: "default",
      duration: 9000, 
    });
    router.push('/dashboard/tasks');
  };


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Submit New Task</CardTitle>
        <CardDescription>Fill in the details below to submit your task for processing.</CardDescription>
      </CardHeader>
      <form onSubmit={(e) => e.preventDefault()} id="taskSubmissionForm">
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="taskType">Task Type</Label>
              <Select name="taskType" required>
                <SelectTrigger id="taskType">
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="essay">Essay</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="research">Research Paper</SelectItem>
                  <SelectItem value="coding">Coding Assignment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskTitle">Task Title</Label>
              <Input id="taskTitle" name="taskTitle" placeholder="e.g., Q1 Marketing Report" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taskDescription">Task Description</Label>
            <Textarea id="taskDescription" name="taskDescription" placeholder="Provide a detailed description of the task requirements including formatting (e.g., APA 7th ed., font size 12, font name: Times New Roman), specific sources to use, or any other instructions." rows={4} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="pages">Number of Pages/Slides</Label>
              <Input id="pages" name="pages" type="number" placeholder="e.g., 10" min="1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Estimated Duration</Label>
              <Select name="estimatedDuration" required>
                <SelectTrigger id="estimatedDuration">
                  <SelectValue placeholder="Select estimated duration" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="submissionDate">Submission Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !submissionDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {submissionDate ? format(submissionDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={submissionDate}
                    onSelect={setSubmissionDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Preferred Deadline</Label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0,0,0,0)) || (submissionDate && date < new Date(new Date(submissionDate).setHours(0,0,0,0)))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments (Optional)</Label>
            <div className="flex items-center justify-center w-full">
                <Label 
                  htmlFor="dropzone-file" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-1 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PDF, DOCX, PPTX, ZIP (MAX. 10MB)</p>
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" multiple name="attachments"/>
                </Label>
            </div> 
          </div>

          <div className="p-4 bg-primary/10 rounded-md border border-primary/20">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 mr-3 text-primary" />
              <div>
                <h4 className="font-semibold text-primary">Payment Information</h4>
                <p className="text-sm text-muted-foreground">
                  An estimated cost will be provided upon task approval. Payment will be required to start processing.
                </p>
              </div>
            </div>
          </div>

        </CardContent>
        <CardFooter className="pt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Submit Task for Approval
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Virtual Assistant Preference</AlertDialogTitle>
                <AlertDialogDescription>
                  Choosing 'Request Specific VA' means you intend for a particular Virtual Assistant to work on this task.
                  With an active <strong>Professional VA plan (₦2000/year)</strong>, you can find and select your preferred VA (e.g., using the 'Find a VA' page).
                  After confirming your preference here and submitting your task, it will be directly assigned to them. They will then be notified to review and accept your work, subject to their availability.
                  If you don't have the Professional VA plan, do not wish to specify a VA, or if your chosen VA is unavailable, one will be assigned randomly.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => performActualSubmission("specific")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Users className="mr-2 h-4 w-4" /> Request Specific VA
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={() => performActualSubmission("random")}
                  className="bg-primary hover:bg-primary/90"
                >
                 <Shuffle className="mr-2 h-4 w-4" /> Assign Random VA
                </AlertDialogAction>
                 <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </form>
    </Card>
  );
}

