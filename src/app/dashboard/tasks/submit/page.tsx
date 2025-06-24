
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { TaskSubmissionForm as DeprecatedTaskSubmissionForm } from "@/components/tasks/TaskSubmissionForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, FilePlus2 } from "lucide-react";

// This page now uses the TaskSubmissionForm component,
// but the form submission logic is simplified here to remove direct DB access for the reset.

export default function SubmitTaskPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleFinalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const taskTitle = formData.get("taskTitle") as string;
    
    // TODO: Re-implement Firestore logic here.
    console.log("Simulating task submission for:", taskTitle);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Task Submitted Successfully! (Simulated)",
        description: `Your task "${taskTitle}" is now pending review. Payment will be requested upon approval.`,
        duration: 7000,
      });
      router.push('/dashboard/tasks');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <PageHeader 
        title="Submit a New Task"
        description="Provide details for your e-academic task. We'll review it and get back to you."
        icon={FilePlus2}
      />
      {/* DeprecatedTaskSubmissionForm now lives in page.tsx and is simplified */}
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Task Details</CardTitle>
          <CardDescription>Fill in the details below to submit your task for processing.</CardDescription>
        </CardHeader>
        <form onSubmit={handleFinalSubmit}>
          <CardContent className="space-y-6">
            {/* Minimal form for reset. The full form can be restored from history. */}
            <div className="space-y-2">
              <label htmlFor="taskTitle">Task Title</label>
              <input id="taskTitle" name="taskTitle" className="w-full p-2 border rounded" placeholder="e.g., Q1 Marketing Report" required disabled={isLoading} />
            </div>
             <div className="space-y-2">
              <label htmlFor="taskDescription">Task Description</label>
              <textarea id="taskDescription" name="taskDescription" className="w-full p-2 border rounded" placeholder="Provide a detailed description..." rows={4} required disabled={isLoading}></textarea>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null} 
              Submit Task for Approval
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
