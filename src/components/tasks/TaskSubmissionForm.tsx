
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose, // Added DialogClose for programmatic closing if needed
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface SelectableVa {
  id: string;
  name: string;
  avatarUrl: string;
  tagline: string;
}

const mockSelectableVAs: SelectableVa[] = [
  { id: "VA001", name: "Aisha Bello", avatarUrl: "https://placehold.co/40x40.png?text=AB", tagline: "Expert academic writer and researcher." },
  { id: "VA002", name: "Chinedu Okoro", avatarUrl: "https://placehold.co/40x40.png?text=CO", tagline: "Technical task wizard, specializing in STEM." },
  { id: "VA003", name: "Fatima Diallo", avatarUrl: "https://placehold.co/40x40.png?text=FD", tagline: "Creative presentations and business support." },
  { id: "VA004", name: "David Adebayo", avatarUrl: "https://placehold.co/40x40.png?text=DA", tagline: "Reliable VA for diverse tasks." },
];


export function TaskSubmissionForm() {
  const [submissionDate, setSubmissionDate] = useState<Date | undefined>(new Date());
  const [deadline, setDeadline] = useState<Date | undefined>();
  const { toast } = useToast();
  const router = useRouter();

  const [isVaSelectionDialogOpen, setIsVaSelectionDialogOpen] = useState(false);
  const [selectedVaId, setSelectedVaId] = useState<string | undefined>();


  const performActualSubmission = (vaPreference: "specific" | "random", vaIdToAssign?: string) => {
    let vaMessage = "";
    if (vaPreference === "specific" && vaIdToAssign) {
      const va = mockSelectableVAs.find(v => v.id === vaIdToAssign);
      vaMessage = `Your task has been submitted and will be assigned to ${va ? va.name : 'your chosen VA'} for review and acceptance. This is a feature of the Expert VA Plan.`;
    } else {
      vaMessage = "Your task has been submitted and a Virtual Assistant will be assigned randomly.";
    }

    toast({
      title: "Task Submitted Successfully!",
      description: `${vaMessage} Your task is now pending review and admin approval. Payment will be requested upon approval.`,
      variant: "default",
      duration: 9000, 
    });
    router.push('/dashboard/tasks');
    setIsVaSelectionDialogOpen(false); // Ensure VA selection dialog is closed
  };


  return (
    <>
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
                  To request a specific Virtual Assistant for this task, you need an active <strong>Expert VA Plan</strong>.
                  If you have this plan, you can choose a specific VA.
                  Choosing 'Request Specific VA' below will allow you to select one.
                  If you don't have the Expert VA plan, or if your chosen VA is unavailable, one will be assigned randomly.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => {
                    // This AlertDialogAction will close the AlertDialog,
                    // then we open the VA Selection Dialog.
                    setIsVaSelectionDialogOpen(true);
                  }}
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

    <Dialog open={isVaSelectionDialogOpen} onOpenChange={setIsVaSelectionDialogOpen}>
      <DialogContent className="sm:max-w-lg"> {/* Changed to sm:max-w-lg for a bit more space */}
        <DialogHeader>
          <DialogTitle>Select a Virtual Assistant</DialogTitle>
          <DialogDescription>
            Choose a VA to assign this task to. This feature requires an active Expert VA Plan.
            The VAs listed here are for demonstration.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] p-1 pr-3"> {/* Added pr-3 for scrollbar space */}
            <RadioGroup value={selectedVaId} onValueChange={setSelectedVaId} className="space-y-3 py-2">
            {mockSelectableVAs.map((va) => (
                <Label
                  key={va.id}
                  htmlFor={`va-${va.id}`}
                  className={cn(
                      "flex items-center space-x-3 p-3 border rounded-md hover:bg-accent/30 cursor-pointer transition-colors",
                      selectedVaId === va.id && "bg-accent/50 border-accent ring-2 ring-accent"
                  )}
                >
                <Avatar className="h-10 w-10">
                    <AvatarImage src={va.avatarUrl} alt={va.name} data-ai-hint="person avatar" />
                    <AvatarFallback>{va.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <span className="font-medium text-sm">{va.name}</span>
                    <p className="text-xs text-muted-foreground">{va.tagline}</p>
                </div>
                <RadioGroupItem value={va.id} id={`va-${va.id}`} className="shrink-0"/>
                </Label>
            ))}
            {mockSelectableVAs.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No VAs available for selection.</p>
            )}
            </RadioGroup>
        </ScrollArea>
        <DialogFooter className="sm:justify-between items-center"> {/* Adjusted footer alignment */}
          {selectedVaId && (
            <p className="text-sm text-muted-foreground hidden sm:block">
                Selected: {mockSelectableVAs.find(va => va.id === selectedVaId)?.name || 'N/A'}
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {setIsVaSelectionDialogOpen(false); setSelectedVaId(undefined);}}>Cancel</Button>
            <Button
              onClick={() => {
                if (selectedVaId) {
                  performActualSubmission("specific", selectedVaId);
                } else {
                  toast({ title: "No VA Selected", description: "Please select a VA to proceed.", variant: "destructive"});
                }
              }}
              disabled={!selectedVaId}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Submit with Selected VA
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

