
import { PageHeader } from "@/components/shared/PageHeader";
import { ReferralDashboard } from "@/components/referrals/ReferralDashboard";
import { Gift } from "lucide-react"; // Changed icon to Gift for consistency

export default function ReferralsPage() {
  return (
    <div>
      <PageHeader 
        title="My Referral Program"
        description="Invite students or print centers to STIPS Lite and earn rewards!"
        icon={Gift}
      />
      <ReferralDashboard userRole="student" />
    </div>
  );
}
