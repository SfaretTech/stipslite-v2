
import { PageHeader } from "@/components/shared/PageHeader";
import { TaskSubmissionForm } from "@/components/tasks/TaskSubmissionForm";
import { FilePlus2 } from "lucide-react";

export default function SubmitTaskPage() {
  return (
    <div>
      <PageHeader 
        title="Submit a New Task"
        description="Provide details for your e-academic task. We'll review it and get back to you."
        icon={FilePlus2}
      />
      <TaskSubmissionForm />
    </div>
  );
}
