
import { AuthLayout } from "@/components/layout/AuthLayout";
import { PrintCenterRegisterForm } from "@/components/auth/PrintCenterRegisterForm";

export default function PrintCenterSignUpPage() { // Renamed function for clarity
  return (
    <AuthLayout
      title="Register Your Print Center"
      description="Join STIPS Lite to offer your printing services to students."
    >
      <PrintCenterRegisterForm />
    </AuthLayout>
  );
}
