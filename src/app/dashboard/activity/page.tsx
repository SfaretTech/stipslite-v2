
import Link from "next/link"; // Added import
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

// Mock data for activity items - replace with actual data fetching
const mockActivityItems = [
  { id: "1", type: "Task Submission", description: "Task 'Research Paper Q1' submitted.", timestamp: "2024-07-21 10:00 AM", detailsLink: "/dashboard/tasks/TSK001" },
  { id: "2", type: "Task Approval", description: "Task 'Presentation Slides' approved.", timestamp: "2024-07-20 14:30 PM", detailsLink: "/dashboard/tasks/TSK002" },
  { id: "3", type: "Referral Signup", description: "New referral signup: Jane Doe.", timestamp: "2024-07-18 09:15 AM", detailsLink: "/dashboard/referrals" },
  { id: "4", type: "Subscription Change", description: "Upgraded to Pro Plan.", timestamp: "2024-07-15 11:00 AM", detailsLink: "/dashboard/subscription" },
  { id: "5", type: "Profile Update", description: "Updated contact information.", timestamp: "2024-07-14 16:45 PM", detailsLink: "/dashboard/profile" },
];


export default function ActivityPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="All Activity"
        description="A complete log of your recent activities on STIPS Lite."
        icon={ListChecks}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Activity Log</CardTitle>
          <CardDescription>Showing all recorded actions and events.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockActivityItems.length > 0 ? (
            <ul className="space-y-4">
              {mockActivityItems.map(item => (
                <li key={item.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-primary">{item.type}</p>
                      <p className="text-sm text-foreground">{item.description}</p>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap pl-4">{item.timestamp}</p>
                  </div>
                  {item.detailsLink && (
                    <Link href={item.detailsLink} className="text-xs text-accent hover:underline mt-1 inline-block">View Details</Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10">
              <ListChecks className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No activity recorded yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
