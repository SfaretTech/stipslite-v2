
import { PageHeader } from "@/components/shared/PageHeader";
import { SupportChatInterface } from "@/components/support/SupportChatInterface";
import { LifeBuoy } from "lucide-react";

export default function PrintCenterSupportPage() {
  return (
    <div className="h-full flex flex-col">
      <PageHeader 
        title="Print Center Support"
        description="Manage communications related to your shop, jobs, payments, or contact admin for platform assistance."
        icon={LifeBuoy}
      />
      <div className="flex-grow">
        <SupportChatInterface userRole="print-center" />
      </div>
    </div>
  );
}
