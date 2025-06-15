
"use client";

// This page is deprecated and its functionality moved to:
// - /va/live-tasks
// - /va/my-tasks
// - /va/business-tasks
// This file is kept minimal to avoid build issues if direct deletion is not supported by the tool.

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Info } from "lucide-react"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VaTasksPage_Deprecated() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="VA Task Management (Deprecated)"
        description="This page is no longer in active use. Please use the new task management sections."
        icon={Briefcase}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Info className="mr-2 h-6 w-6 text-primary"/> Page Content Moved
          </CardTitle>
          <CardDescription>
            Task management for Virtual Assistants has been reorganized for clarity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Please use the following sections in the sidebar for managing your tasks:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>
              <strong>Live Tasks:</strong> For browsing and expressing interest in tasks from the general student pool.
              <Button variant="link" asChild className="p-0 h-auto ml-2"><Link href="/va/live-tasks">Go to Live Tasks</Link></Button>
            </li>
            <li>
              <strong>My Tasks:</strong> For managing tasks you've shown interest in, formally accepting/declining, and submitting work.
               <Button variant="link" asChild className="p-0 h-auto ml-2"><Link href="/va/my-tasks">Go to My Tasks</Link></Button>
            </li>
            <li>
              <strong>Business Service Tasks:</strong> For managing tasks directly assigned to you by students.
               <Button variant="link" asChild className="p-0 h-auto ml-2"><Link href="/va/business-tasks">Go to Business Service Tasks</Link></Button>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground pt-2">
            This page is a placeholder to ensure smooth navigation during the transition.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

