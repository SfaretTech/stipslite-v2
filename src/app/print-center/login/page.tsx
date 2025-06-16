
import { AuthLayout } from "@/components/layout/AuthLayout";
import { PrintCenterLoginForm } from "@/components/auth/PrintCenterLoginForm";

export default function PrintCenterLoginPage() {
  return (
    <AuthLayout
      title="Print Center Portal Login"
      description="Access your STIPS Lite Print Center dashboard."
    >
      <PrintCenterLoginForm />
    </AuthLayout>
  );
}
