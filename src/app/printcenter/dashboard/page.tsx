
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Printer, LayoutDashboard, ListChecks, DollarSign, UserCircle, Settings, MessageSquare, ArrowRight, Banknote, FileText } from "lucide-react";
import Link from "next/link";

export default function PrintCenterDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome to your Print Center Dashboard"
        description="Manage your print jobs, shop profile, and earnings."
        icon={LayoutDashboard}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Print Jobs"
          value="7"
          icon={ListChecks}
          description="New jobs awaiting your action"
        />
        <StatCard
          title="Jobs in Progress"
          value="3"
          icon={Printer}
          description="Currently printing or awaiting pickup"
        />
        <StatCard
          title="Completed Jobs (Month)"
          value="42"
          icon={FileText}
          description="Successfully completed this month"
        />
        <StatCard
          title="Current Earnings Balance"
          value="₦23,500"
          icon={Banknote}
          description="Available for withdrawal"
          trend="+ ₦7,200 this week"
          trendColor="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Recent Activity & Notifications</CardTitle>
            <CardDescription>Latest updates on print jobs and your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: ListChecks, text: "New print job 'Math101_Assignment.pdf' received from Student A.", time: "15 minutes ago", link: "/printcenter/jobs/JOB001" },
              { icon: DollarSign, text: "Payment confirmed for job 'ENG_Thesis_Ch1.docx'.", time: "1 hour ago", link: "/printcenter/jobs/JOB002" },
              { icon: FileText, text: "Job 'Presentation_Slides.pptx' marked ready for pickup.", time: "3 hours ago", link: "/printcenter/jobs/JOB003" },
              { icon: Settings, text: "Reminder: Update your shop holiday hours.", time: "1 day ago", link: "/printcenter/profile" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <activity.icon className={`h-5 w-5 mt-1 text-primary`} />
                <div>
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                  {activity.link && <Link href={activity.link} className="text-xs text-accent hover:underline">View Details</Link>}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/printcenter/jobs?filter=new">View All New Jobs <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link href="/printcenter/jobs"><ListChecks className="mr-2 h-4 w-4" /> Manage Print Jobs</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/printcenter/profile"><UserCircle className="mr-2 h-4 w-4" /> Update Shop Profile</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/printcenter/earnings"><Banknote className="mr-2 h-4 w-4" /> Manage Earnings</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/printcenter/support"><MessageSquare className="mr-2 h-4 w-4" /> Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

