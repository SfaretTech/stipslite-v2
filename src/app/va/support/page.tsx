
import { PageHeader } from "@/components/shared/PageHeader";
import { SupportChatInterface } from "@/components/support/SupportChatInterface";
import { LifeBuoy } from "lucide-react";

export default function VaSupportPage() {
  return (
    <div className="h-full flex flex-col">
      <PageHeader 
        title="VA Support Center"
        description="Manage communications with students regarding tasks, and contact admin for platform support."
        icon={LifeBuoy}
      />
      <div className="flex-grow">
        <SupportChatInterface userRole="va" />
      </div>
    </div>
  );
}
