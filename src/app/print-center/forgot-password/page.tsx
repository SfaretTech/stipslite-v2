
import { AuthLayout } from "@/components/layout/AuthLayout";
import { PrintCenterForgotPasswordForm } from "@/components/auth/PrintCenterForgotPasswordForm";

export default function PrintCenterForgotPasswordPage() {
  return (
    <AuthLayout
      title="Print Center Password Reset"
      description="Enter your shop email to receive a password reset link."
    >
      <PrintCenterForgotPasswordForm />
    </AuthLayout>
  );
}
