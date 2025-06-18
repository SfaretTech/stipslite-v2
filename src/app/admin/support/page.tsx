
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { SupportChatInterface } from "@/components/support/SupportChatInterface";
import { LifeBuoy } from "lucide-react";

export default function AdminSupportPage() {
  return (
    <div className="h-full flex flex-col">
      <PageHeader 
        title="Admin Support Center"
        description="Manage and respond to all user support tickets from students, VAs, and Print Centers."
        icon={LifeBuoy}
      />
      <div className="flex-grow">
        {/* The SupportChatInterface will handle ticket listing and chat functionalities */}
        <SupportChatInterface userRole="admin" />
      </div>
    </div>
  );
}

