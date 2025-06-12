import { AppLayout } from "@/components/layout/AppLayout";

export default function VirtualAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout role="va" defaultOpen={true}>{children}</AppLayout>;
}
