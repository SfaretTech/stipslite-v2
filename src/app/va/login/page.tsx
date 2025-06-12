
import { AuthLayout } from "@/components/layout/AuthLayout";
import { VaLoginForm } from "@/components/auth/VaLoginForm"; // Use the new VA-specific form

export default function VaLoginPage() {
  return (
    <AuthLayout 
      title="VA Portal Login"
      description="Access your STIPS Lite Virtual Assistant dashboard."
    >
      <VaLoginForm />
    </AuthLayout>
  );
}
