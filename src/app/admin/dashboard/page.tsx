
"use client";

import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, ShieldCheck, ClipboardList, AlertTriangle, Briefcase, Printer, UsersRound, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function AdminDashboardContent() {
  const totalStudents = 120;
  const totalVAs = 25;
  const totalPrintCenters = 12;
  const grandTotalUsers = totalStudents + totalVAs + totalPrintCenters;
  const pendingAccountApprovals = 5;
  const pendingTaskApprovals = 12;
  const openSupportTickets = 3;

  const quickLinks = [
    { href: "/admin/approvals", title: "Manage Account Approvals" },
    { href: "/admin/tasks", title: "Manage All Tasks" },
    { href: "/admin/users", title: "View All Users" },
    { href: "/admin/manage-admins", title: "Manage Administrators" },
    { href: "/admin/live-tasks", title: "Monitor Live Tasks" },
    { href: "/admin/payments", title: "Process Payouts" },
    { href: "/admin/support", title: "Support Center" },
    { href: "/admin/settings", title: "Platform Settings" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Admin Dashboard"
        description="Overview of STIPS Lite platform activity and management tools."
        icon={LayoutDashboard}
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={String(totalStudents)} icon={Users} />
        <StatCard title="Total VAs" value={String(totalVAs)} icon={Briefcase} />
        <StatCard title="Total Print Centers" value={String(totalPrintCenters)} icon={Printer} />
        <StatCard title="Grand Total Users" value={String(grandTotalUsers)} icon={UsersRound} />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access key administrative functions.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map(link => (
              <Button key={link.href} variant="outline" className="justify-start h-auto p-4" asChild>
                <Link href={link.href}>
                  <p className="font-medium text-primary">{link.title}</p>
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Needs Attention</CardTitle>
                <CardDescription>Items requiring review.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <StatCard title="Pending Account Approvals" value={String(pendingAccountApprovals)} icon={ShieldCheck} />
                 <StatCard title="Pending Task Approvals" value={String(pendingTaskApprovals)} icon={ClipboardList} />
                 <StatCard title="Open Support Tickets" value={String(openSupportTickets)} icon={AlertTriangle} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <PageHeader title="Admin Dashboard" description="Loading platform overview..." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
       <div className="grid gap-6 lg:grid-cols-3">
         <Skeleton className="lg:col-span-2 h-64 w-full" />
         <Skeleton className="lg:col-span-1 h-64 w-full" />
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
