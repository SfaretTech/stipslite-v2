import { PageHeader } from "@/components/shared/PageHeader";
import { ReferralDashboard } from "@/components/referrals/ReferralDashboard";
import { Users, Gift } from "lucide-react";

export default function ReferralsPage() {
  return (
    <div>
      <PageHeader 
        title="Referral Program"
        description="Invite friends to STIPS Lite and earn rewards for every successful referral."
        icon={Gift}
      />
      <ReferralDashboard />
    </div>
  );
}
