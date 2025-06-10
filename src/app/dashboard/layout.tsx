import { AppLayout } from "@/components/layout/AppLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout role="student">{children}</AppLayout>;
}
