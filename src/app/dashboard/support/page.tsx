import { PageHeader } from "@/components/shared/PageHeader";
import { SupportChatInterface } from "@/components/support/SupportChatInterface";
import { LifeBuoy } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="h-full flex flex-col">
      <PageHeader 
        title="Support Center"
        description="Get help with any issues you encounter. Chat with our support team or browse FAQs."
        icon={LifeBuoy}
      />
      <div className="flex-grow">
        <SupportChatInterface />
      </div>
    </div>
  );
}
