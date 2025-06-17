
import { PageHeader } from "@/components/shared/PageHeader";
import { ReferralDashboard } from "@/components/referrals/ReferralDashboard";
import { Gift } from "lucide-react";

export default function VaReferralsPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="VA Referral Program"
        description="Refer new students or print centers to STIPS Lite and earn rewards for your efforts."
        icon={Gift}
      />
      <ReferralDashboard userRole="va" />
    </div>
  );
}
