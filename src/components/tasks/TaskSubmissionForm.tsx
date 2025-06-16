
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
  DialogClose, 
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge"; // Added import for Badge

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, UploadCloud, DollarSign, Users, Shuffle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
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
  isAvailableForDirectAssignment: boolean; // Added for simulation
}

// Mock data for VAs, including their direct assignment availability (simulated)
const mockSelectableVAs: SelectableVa[] = [
  { id: "VA001", name: "Aisha Bello", avatarUrl: "https://placehold.co/40x40.png?text=AB", tagline: "Expert academic writer and researcher.", isAvailableForDirectAssignment: true },
  { id: "VA002", name: "Chinedu Okoro", avatarUrl: "https://placehold.co/40x40.png?text=CO", tagline: "Technical task wizard, specializing in STEM.", isAvailableForDirectAssignment: true },
  { id: "VA003", name: "Fatima Diallo", avatarUrl: "https://placehold.co/40x40.png?text=FD", tagline: "Creative presentations and business support.", isAvailableForDirectAssignment: false }, // Example of unavailable VA
  { id: "VA004", name: "David Adebayo", avatarUrl: "https://placehold.co/40x40.png?text=DA", tagline: "Reliable VA for diverse tasks.", isAvailableForDirectAssignment: true },
];


export function TaskSubmissionForm() {
  const [submissionDate, setSubmissionDate] = useState<Date | undefined>(new Date());
  const [deadline, setDeadline] = useState<Date | undefined>();
  const { toast } = useToast();
  const router = useRouter();

  const [isVaSelectionDialogOpen, setIsVaSelectionDialogOpen] = useState(false);
  const [selectedVaId, setSelectedVaId] = useState<string | undefined>();
  const [isSubscribedToExpertVaPlan, setIsSubscribedToExpertVaPlan] = useState(false); // Simulated

  useEffect(() => {
    // Simulate checking if user has Expert VA Plan
    if (typeof window !== 'undefined') {
      const planStatus = localStorage.getItem('stipsLiteActivePlanId'); // Assuming 'expert_va' plan enables this
      if (planStatus === 'expert_va' || planStatus === 'business_org_va') { // business_org_va might also grant this
        setIsSubscribedToExpertVaPlan(true);
      }
    }
  }, []);


  const performActualSubmission = (vaPreference: "specific" | "random", vaIdToAssign?: string) => {
    let vaMessage = "";
    if (vaPreference === "specific" && vaIdToAssign) {
      const va = mockSelectableVAs.find(v => v.id === vaIdToAssign);
      if (va && !va.isAvailableForDirectAssignment) {
        toast({
          title: "VA Currently Unavailable",
          description: `${va.name} is not accepting direct assignments at the moment. Your task will be sent to the general pool, or you can cancel and choose another VA.`,
          variant: "destructive",
          duration: 7000,
        });
        // Fallback to random or let user decide further (for UI, we'll proceed with random assignment if they submitted from dialog)
        // For simplicity, this simulation will treat it as if it goes to general pool after this toast.
        // In a real app, you might re-open the selection dialog or offer clear choices.
        vaMessage = `Your task has been submitted. Note: ${va.name} was selected but is currently unavailable for direct tasks, so it has been added to the general pool.`;
      } else {
        vaMessage = `Your task has been submitted and will be assigned to ${va ? va.name : 'your chosen VA'} for review and acceptance. This is a feature of the Expert VA Plan.`;
      }
    } else {
      vaMessage = "Your task has been submitted and a Virtual Assistant will be assigned randomly from the general pool.";
    }

    toast({
      title: "Task Submitted Successfully!",
      description: `${vaMessage} Your task is now pending review and admin approval. Payment will be requested upon approval.`,
      variant: "default",
      duration: 9000, 
    });
    router.push('/dashboard/tasks');
    setIsVaSelectionDialogOpen(false); 
    setSelectedVaId(undefined);
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
                  You can have a Virtual Assistant assigned randomly from our general pool, or, if you have an active <strong>Expert VA Plan</strong>, you can request a specific VA.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="sm:flex-col sm:gap-2"> {/* Adjusted for better layout */}
                <AlertDialogAction
                  onClick={() => {
                    if (isSubscribedToExpertVaPlan) {
                      setIsVaSelectionDialogOpen(true);
                    } else {
                      toast({
                        title: "Expert VA Plan Required",
                        description: "To request a specific VA, please subscribe to the Expert VA Plan from the Subscription page.",
                        variant: "destructive",
                        action: <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/subscription')}>Go to Subscription</Button>
                      });
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  <Users className="mr-2 h-4 w-4" /> Request Specific VA
                </AlertDialogAction>
                <AlertDialogAction
                  onClick={() => performActualSubmission("random")}
                  className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                >
                 <Shuffle className="mr-2 h-4 w-4" /> Assign Random VA
                </AlertDialogAction>
                 <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </form>
    </Card>

    <Dialog open={isVaSelectionDialogOpen} onOpenChange={setIsVaSelectionDialogOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Select a Virtual Assistant</DialogTitle>
          <DialogDescription>
            Choose a VA to assign this task to. VAs who are currently unavailable for direct assignments are indicated.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] p-1 pr-3"> 
            <RadioGroup value={selectedVaId} onValueChange={setSelectedVaId} className="space-y-3 py-2">
            {mockSelectableVAs.map((va) => (
                <Label
                  key={va.id}
                  htmlFor={`va-${va.id}`}
                  className={cn(
                      "flex items-center space-x-3 p-3 border rounded-md hover:bg-accent/30 cursor-pointer transition-colors",
                      selectedVaId === va.id && "bg-accent/50 border-accent ring-2 ring-accent",
                      !va.isAvailableForDirectAssignment && "opacity-60 bg-muted/30 hover:bg-muted/40"
                  )}
                >
                <Avatar className="h-10 w-10">
                    <AvatarImage src={va.avatarUrl} alt={va.name} data-ai-hint="person avatar" />
                    <AvatarFallback>{va.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <span className="font-medium text-sm">{va.name}</span>
                    <p className="text-xs text-muted-foreground">{va.tagline}</p>
                    {!va.isAvailableForDirectAssignment && (
                        <Badge variant="destructive" className="mt-1 text-xs">Unavailable for Direct Tasks</Badge>
                    )}
                </div>
                <RadioGroupItem value={va.id} id={`va-${va.id}`} className="shrink-0" disabled={!va.isAvailableForDirectAssignment}/>
                </Label>
            ))}
            {mockSelectableVAs.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No VAs available for selection.</p>
            )}
            </RadioGroup>
        </ScrollArea>
         {selectedVaId && !mockSelectableVAs.find(va => va.id === selectedVaId)?.isAvailableForDirectAssignment && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 flex items-start mt-2 text-sm">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 shrink-0"/>
                <p>
                    The selected VA is currently not available for direct assignments. If you proceed, your task will be sent to the general pool.
                </p>
            </div>
        )}
        <DialogFooter className="sm:justify-between items-center pt-4 border-t"> 
          {selectedVaId && mockSelectableVAs.find(va => va.id === selectedVaId) && (
            <p className="text-sm text-muted-foreground hidden sm:block">
                Selected: {mockSelectableVAs.find(va => va.id === selectedVaId)?.name || 'N/A'}
            </p>
          )}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => {setIsVaSelectionDialogOpen(false); setSelectedVaId(undefined);}} className="flex-1 sm:flex-none">Cancel</Button>
            <Button
              onClick={() => {
                if (selectedVaId) {
                  performActualSubmission("specific", selectedVaId);
                } else {
                  toast({ title: "No VA Selected", description: "Please select a VA to proceed or cancel.", variant: "destructive"});
                }
              }}
              disabled={!selectedVaId}
              className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1 sm:flex-none"
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

