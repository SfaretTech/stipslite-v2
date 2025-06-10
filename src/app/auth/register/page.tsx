import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Create your Account"
      description="Join STIPS Lite and simplify your student life."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
