import { PageHeader } from "@/components/shared/PageHeader";
import { UserProfileForm } from "@/components/profile/UserProfileForm";
import { UserCircle } from "lucide-react";

export default function ProfilePage() {
  return (
    <div>
      <PageHeader 
        title="My Profile"
        description="Manage your personal information, account settings, and passport details."
        icon={UserCircle}
      />
      <UserProfileForm />
    </div>
  );
}
