
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, ShieldCheck, ClipboardList, AlertTriangle, Briefcase, Printer, UsersRound } from "lucide-react";

export default function AdminDashboardPage() {
  // Mock data - in a real app, this would come from a data source
  const totalStudents = 120;
  const totalVAs = 25;
  const totalPrintCenters = 12;
  const grandTotalUsers = totalStudents + totalVAs + totalPrintCenters;

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Admin Dashboard"
        description="Overview of STIPS Lite platform activity and management tools."
      />
      
      {/* User Statistics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={String(totalStudents)} icon={Users} description="Registered student accounts." />
        <StatCard title="Total VAs" value={String(totalVAs)} icon={Briefcase} description="Registered Virtual Assistants." />
        <StatCard title="Total Print Centers" value={String(totalPrintCenters)} icon={Printer} description="Registered print shop centers." />
        <StatCard title="Grand Total Users" value={String(grandTotalUsers)} icon={UsersRound} description="All active user accounts." />
      </div>

      {/* Operational Statistics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Pending Account Approvals" value="5" icon={ShieldCheck} description="New accounts awaiting review." />
        <StatCard title="Pending Task Approvals" value="12" icon={ClipboardList} description="Submitted tasks needing admin action." />
        <StatCard title="Open Support Tickets" value="3" icon={AlertTriangle} description="Active user queries." />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Quick Links</CardTitle>
          <CardDescription>Access key administrative functions.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ButtonLink href="/admin/approvals" title="Manage Account Approvals" />
          <ButtonLink href="/admin/tasks" title="Manage Task Approvals" />
          <ButtonLink href="/admin/users" title="View All Users" />
          <ButtonLink href="/admin/manage-admins" title="Manage Administrators" />
          <ButtonLink href="/admin/settings" title="Platform Settings" />
          <ButtonLink href="/admin/notifications" title="View Activity Log" />
        </CardContent>
      </Card>
      {/* Additional admin-specific components or charts can be added here */}
    </div>
  );
}

function ButtonLink({ href, title }: { href: string; title: string }) {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-4">
        <a href={href} className="font-medium text-primary hover:underline">{title}</a>
      </CardContent>
    </Card>
  );
}

