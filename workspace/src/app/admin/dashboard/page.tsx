import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, ShieldCheck, ClipboardList, AlertTriangle, Briefcase, Printer, UsersRound } from "lucide-react";
import Link from "next/link";

// A local component for a clickable card link, using Next.js Link for SPA navigation.
function ButtonLink({ href, title }: { href: string; title: string }) {
  return (
    <Link href={href} className="block hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
      <Card className="hover:bg-muted/50 transition-colors h-full">
        <CardContent className="p-4">
          <p className="font-medium text-primary">{title}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function AdminDashboardPage() {
  // Mock data for demonstration. In a real application, this would be fetched from a data source.
  const totalStudents = 120;
  const totalVAs = 25;
  const totalPrintCenters = 12;
  const grandTotalUsers = totalStudents + totalVAs + totalPrintCenters;
  const pendingAccountApprovals = 5;
  const pendingTaskApprovals = 12;
  const openSupportTickets = 3;

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Admin Dashboard"
        description="Overview of STIPS Lite platform activity and management tools."
      />
      
      {/* User Statistics Row */}
      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
          <CardDescription>A snapshot of the platform's user base.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Students" value={String(totalStudents)} icon={Users} description="Registered student accounts." />
            <StatCard title="Total VAs" value={String(totalVAs)} icon={Briefcase} description="Registered Virtual Assistants." />
            <StatCard title="Total Print Centers" value={String(totalPrintCenters)} icon={Printer} description="Registered print shop centers." />
            <StatCard title="Grand Total Users" value={String(grandTotalUsers)} icon={UsersRound} description="All active user accounts." />
          </div>
        </CardContent>
      </Card>
      
      {/* Operational Statistics and Quick Links */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
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
        </div>
        
        <div className="lg:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>Operational Overview</CardTitle>
                    <CardDescription>Items needing attention.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <StatCard title="Pending Account Approvals" value={String(pendingAccountApprovals)} icon={ShieldCheck} description="New accounts awaiting review." />
                     <StatCard title="Pending Task Approvals" value={String(pendingTaskApprovals)} icon={ClipboardList} description="Submitted tasks needing admin action." />
                     <StatCard title="Open Support Tickets" value={String(openSupportTickets)} icon={AlertTriangle} description="Active user queries." />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
