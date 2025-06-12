
import { AuthLayout } from "@/components/layout/AuthLayout";
import { VaForgotPasswordForm } from "@/components/auth/VaForgotPasswordForm"; // Use the new VA-specific form

export default function VaForgotPasswordPage() {
  return (
    <AuthLayout
      title="VA Account Password Reset"
      description="Enter your VA account email to receive a password reset link."
    >
      <VaForgotPasswordForm />
    </AuthLayout>
  );
}
