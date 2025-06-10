import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, ShieldCheck, ClipboardList, AlertTriangle } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Admin Dashboard"
        description="Overview of STIPS Lite platform activity and management tools."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pending Account Approvals" value="5" icon={ShieldCheck} description="New user accounts awaiting review." />
        <StatCard title="Pending Task Approvals" value="12" icon={ClipboardList} description="Submitted tasks needing admin action." />
        <StatCard title="Total Users" value="157" icon={Users} description="Registered users on the platform." />
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
          <ButtonLink href="/admin/settings" title="Platform Settings" />
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
