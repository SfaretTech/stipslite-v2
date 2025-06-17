
import { PageHeader } from "@/components/shared/PageHeader";
import { ReferralDashboard } from "@/components/referrals/ReferralDashboard";
import { Gift } from "lucide-react";

export default function VaReferralsPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="VA Referral Program"
        description="Refer new students or other Virtual Assistants to STIPS Lite and earn rewards."
        icon={Gift}
      />
      <ReferralDashboard userRole="va" />
    </div>
  );
}
