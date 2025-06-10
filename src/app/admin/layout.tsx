import { AppLayout } from "@/components/layout/AppLayout";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout role="admin" defaultOpen={true}>{children}</AppLayout>;
}
