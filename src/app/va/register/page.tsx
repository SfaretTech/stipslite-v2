
import { AuthLayout } from "@/components/layout/AuthLayout";
import { VaRegisterForm } from "@/components/auth/VaRegisterForm"; // Use the new VA-specific form

export default function VaRegisterPage() {
  return (
    <AuthLayout 
      title="Register as a Virtual Assistant"
      description="Join STIPS Lite as a VA and offer your skills to students."
    >
      <VaRegisterForm />
    </AuthLayout>
  );
}
