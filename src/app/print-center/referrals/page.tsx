
import { PageHeader } from "@/components/shared/PageHeader";
import { ReferralDashboard } from "@/components/referrals/ReferralDashboard";
import { Gift } from "lucide-react";

export default function PrintCenterReferralsPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Print Center Referral Program"
        description="Help grow the STIPS Lite community by referring new students or other print centers. Earn rewards for successful referrals."
        icon={Gift}
      />
      <ReferralDashboard userRole="print-center" />
    </div>
  );
}
