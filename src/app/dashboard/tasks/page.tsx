import { PageHeader } from "@/components/shared/PageHeader";
import { TaskList } from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { ClipboardList, FilePlus2 } from "lucide-react";
import Link from "next/link";

export default function TasksPage() {
  return (
    <div>
      <PageHeader 
        title="My Tasks"
        description="View and manage all your submitted academic tasks."
        icon={ClipboardList}
        actions={
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/dashboard/tasks/submit">
              <FilePlus2 className="mr-2 h-4 w-4" /> Submit New Task
            </Link>
          </Button>
        }
      />
      <TaskList />
    </div>
  );
}
