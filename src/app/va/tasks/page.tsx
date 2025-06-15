
"use client";

// This page is being replaced by /va/live-tasks and /va/business-tasks.
// Keeping a minimal functional component to avoid build errors if direct deletion is not supported.
// The actual functionality has been moved.

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react"; // Example icon

export default function VaTasksPage_Deprecated() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Assigned Tasks (Deprecated)"
        description="This page is no longer in active use. Please use 'Live Tasks' or 'Business Service Tasks'."
        icon={Briefcase}
      />
      <Card>
        <CardHeader>
          <CardTitle>Content Moved</CardTitle>
          <CardDescription>
            Task management for VAs has been split into "Live Tasks" and "Business Service Tasks". 
            Please use the sidebar navigation to access these new pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is a placeholder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
