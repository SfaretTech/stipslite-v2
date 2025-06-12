
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Activity, CheckCircle2, ClipboardList, FilePlus2, DollarSign, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Welcome to your Dashboard" 
        description="Here's an overview of your STIPS Lite activity."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Active Tasks" 
          value="3" 
          icon={ClipboardList} 
          description="Tasks currently in progress" 
        />
        <StatCard 
          title="Completed Tasks" 
          value="12" 
          icon={CheckCircle2} 
          description="Tasks successfully submitted" 
        />
        <StatCard 
          title="Referral Earnings" 
          value="₦25.50" 
          icon={DollarSign} 
          description="Total earnings from referrals"
          trend="+ ₦5.00 this week"
          trendColor="green"
        />
        <StatCard 
          title="Referred Users" 
          value="5" 
          icon={Users} 
          description="Users you've successfully referred"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Recent Activity</CardTitle>
            <CardDescription>Latest updates on your tasks and referrals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: FilePlus2, text: "New task 'Research Paper Q1' submitted.", time: "2 hours ago", color: "text-blue-500" },
              { icon: CheckCircle2, text: "Task 'Presentation Slides' approved.", time: "1 day ago", color: "text-green-500" },
              { icon: Users, text: "New referral signup: Jane Doe.", time: "3 days ago", color: "text-purple-500" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <activity.icon className={`h-5 w-5 mt-1 ${activity.color}`} />
                <div>
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/dashboard/activity">View All Activity <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link href="/dashboard/tasks/submit"><FilePlus2 className="mr-2 h-4 w-4" /> Submit New Task</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/print-centers"><ClipboardList className="mr-2 h-4 w-4" /> Find Print Center</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/referrals"><Users className="mr-2 h-4 w-4" /> Manage Referrals</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/subscription"><DollarSign className="mr-2 h-4 w-4" /> View Subscription</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Subscription Status</CardTitle>
          <CardDescription>Your current plan and usage.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-2 flex justify-between text-sm">
                <span>Monthly Plan</span>
                <span className="font-semibold text-primary">₦9.99 / month</span>
            </div>
            <Progress value={60} aria-label="Subscription period progress" className="h-3"/>
            <p className="text-xs text-muted-foreground mt-1 text-right">Renews on July 30, 2024</p>
        </CardContent>
        <CardFooter>
            <Button asChild>
                <Link href="/dashboard/subscription">Manage Subscription</Link>
            </Button>
        </CardFooter>
      </Card>

    </div>
  );
}
