
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CheckCircle2, Clock, DollarSign, Bell, UserCircle, ArrowRight, LayoutDashboard, MessageSquare, Signal, Target, ListChecks } from "lucide-react"; 
import Link from "next/link";

export default function VaDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Welcome to your VA Dashboard" 
        description="Manage your tasks, profile, and earnings."
        icon={LayoutDashboard}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Live Tasks Available" 
          value="5" 
          icon={Signal} 
          description="Tasks open for acceptance"
        />
        <StatCard 
          title="Tasks in My Queue" 
          value="1" 
          icon={ListChecks} 
          description="Tasks you're interested in" 
        />
        <StatCard 
          title="Active Business Tasks" 
          value="2" 
          icon={Target} 
          description="Directly assigned tasks in progress" 
        />
        <StatCard 
          title="Pending Payouts" 
          value="₦15,000" 
          icon={DollarSign} 
          description="Earnings awaiting withdrawal"
          trend="+ ₦5,000 this week"
          trendColor="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Recent Activity & Notifications</CardTitle>
            <CardDescription>Latest updates on your tasks and account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: Target, text: "New business task 'Dissertation Chapter 3' assigned.", time: "30 minutes ago", color: "text-blue-500", link: "/va/business-tasks/BST001" },
              { icon: ListChecks, text: "You expressed interest in 'Urgent Proofreading'.", time: "1 hour ago", color: "text-orange-500", link: "/va/my-tasks/LT001" },
              { icon: CheckCircle2, text: "Task 'Financial Modeling' marked complete by student.", time: "2 hours ago", color: "text-green-500", link: "/va/business-tasks/BST002" }, 
              { icon: DollarSign, text: "Payout of ₦10,000 processed.", time: "1 day ago", color: "text-purple-500", link: "/va/payouts" }, 
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <activity.icon className={`h-5 w-5 mt-1 ${activity.color}`} />
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
              <Link href="/va/notifications">View All Notifications <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link href="/va/live-tasks"><Signal className="mr-2 h-4 w-4" /> Browse Live Tasks</Link> 
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/va/my-tasks"><ListChecks className="mr-2 h-4 w-4" /> Manage My Tasks</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/va/business-tasks"><Target className="mr-2 h-4 w-4" /> Manage Business Tasks</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/va/profile"><UserCircle className="mr-2 h-4 w-4" /> Update My Profile</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/va/support"><MessageSquare className="mr-2 h-4 w-4" /> Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline">My Performance</CardTitle>
            <CardDescription>Overview of your ratings and task completion.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">[Performance charts and statistics will be displayed here - e.g., Average Rating, On-time Completion Rate]</p>
        </CardContent>
      </Card>
    </div>
  );
}

