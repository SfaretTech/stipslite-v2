
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <AuthLayout 
      title="Admin Portal Login"
      description="Access the STIPS Lite Admin Dashboard."
    >
      <AdminLoginForm />
    </AuthLayout>
  );
}
