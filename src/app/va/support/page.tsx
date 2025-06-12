
import { PageHeader } from "@/components/shared/PageHeader";
import { SupportChatInterface } from "@/components/support/SupportChatInterface"; // Re-use existing component
import { LifeBuoy } from "lucide-react";

export default function VaSupportPage() {
  return (
    <div className="h-full flex flex-col">
      <PageHeader 
        title="VA Support Center"
        description="Get help with platform issues, payment queries, or student interactions."
        icon={LifeBuoy}
      />
      <div className="flex-grow">
        {/* We can reuse the same support chat interface. It can be context-aware if needed later. */}
        <SupportChatInterface /> 
      </div>
    </div>
  );
}
