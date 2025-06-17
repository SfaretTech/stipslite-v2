
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, Archive, Users as UsersIcon, Briefcase, Printer, Settings, UserX, ShieldCheck, ListChecks, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminNotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: 'User Management' | 'Task Activity' | 'System Event' | 'Application Review' | 'Platform Update';
  link?: string;
  icon?: React.ElementType;
}

const initialAdminNotifications: AdminNotificationItem[] = [
  { id: "APN001", title: "New User Registration: John Doe", description: "Awaiting admin approval.", timestamp: "2024-07-26 10:00 AM", category: "User Management", link: "/admin/approvals", icon: UsersIcon },
  { id: "APN002", title: "Task Submitted: TSK108 - Research Paper", description: "Submitted by Alice Smith, needs review.", timestamp: "2024-07-26 09:30 AM", category: "Task Activity", link: "/admin/tasks", icon: Briefcase },
  { id: "APN003", title: "Print Center Application: Alpha Prints", description: "New print center application awaiting approval.", timestamp: "2024-07-25 15:00 PM", category: "Application Review", link: "/admin/approvals", icon: Printer },
  { id: "APN004", title: "VA Application: Virtual Pro Services", description: "New VA application awaiting approval.", timestamp: "2024-07-25 14:00 PM", category: "Application Review", link: "/admin/approvals", icon: ShieldCheck },
  { id: "APN005", title: "System Setting Changed: Maintenance Mode", description: "Maintenance mode was toggled ON by AdminUserX.", timestamp: "2024-07-24 11:00 AM", category: "System Event", link: "/admin/settings", icon: Settings },
  { id: "APN006", title: "User Account Suspended: MikeR", description: "Account for user MikeR was suspended by AdminUserY.", timestamp: "2024-07-24 10:00 AM", category: "User Management", link: "/admin/users", icon: UserX },
  { id: "APN007", title: "Platform Update v1.2 Deployed", description: "New features and bug fixes now live.", timestamp: "2024-07-23 17:00 PM", category: "Platform Update", icon: ListChecks },
];


function getAdminCategoryBadgeVariant(category: AdminNotificationItem['category']) {
    switch (category) {
        case 'User Management': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
        case 'Task Activity': return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
        case 'System Event': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
        case 'Application Review': return 'bg-teal-100 text-teal-700 hover:bg-teal-200';
        case 'Platform Update': return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
        default: return 'secondary';
    }
}


export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>(initialAdminNotifications);

  // For admin notifications, "mark as read" or "clear all" might not be applicable
  // as it's more of an activity log. These functions can be omitted or adapted later if needed.

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Admin Notifications & Activity Log"
        description={`Showing ${notifications.length} recent platform events.`}
        icon={Activity}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Platform Activity Log</CardTitle>
          <CardDescription>Chronological list of important events and notifications for administrators.</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <ul className="space-y-4">
              {notifications.map(item => {
                const Icon = item.icon || Bell;
                return (
                    <li 
                        key={item.id} 
                        className={cn(
                            "p-4 border rounded-lg hover:shadow-md transition-all duration-200 bg-card shadow-sm"
                        )}
                    >
                    <div className="flex items-start gap-4">
                        <div className={cn("p-2 rounded-full mt-1 bg-primary/10")}>
                            <Icon className={cn("h-5 w-5 text-primary")} />
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className={cn("font-semibold text-primary")}>{item.title}</h3>
                                <Badge variant="outline" className={cn("text-xs", getAdminCategoryBadgeVariant(item.category))}>{item.category}</Badge>
                            </div>
                            <p className={cn("text-sm text-foreground/90")}>{item.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 items-center self-start sm:self-center">
                            {item.link && (
                                <Button variant="outline" size="sm" asChild className="text-xs text-accent hover:underline h-auto p-1 border-accent hover:bg-accent/10">
                                    <Link href={item.link}>View Details</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                    </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-12">
              <Archive className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">No Platform Activity Logged</p>
              <p className="text-sm text-muted-foreground">Important system events will appear here.</p>
            </div>
          )}
        </CardContent>
         {notifications.length > 0 && (
            <CardFooter className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                    Displaying latest {notifications.length} platform event{notifications.length === 1 ? '' : 's'}.
                </p>
            </CardFooter>
         )}
      </Card>
    </div>
  );
}
