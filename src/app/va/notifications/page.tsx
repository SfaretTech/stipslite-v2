
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, Check, Eye, X, Archive, ArchiveX, Target, DollarSign, MessageSquare, Info, Broadcast } from "lucide-react"; // Added Target, Broadcast
import { cn } from "@/lib/utils";

interface VaNotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  category: 'New Business Task' | 'Task Update' | 'Payment' | 'System Alert' | 'Student Message' | 'Live Task Available';
  link?: string;
  icon?: React.ElementType;
}

const initialVaNotifications: VaNotificationItem[] = [
  { id: "VAN001", title: "New Business Task: 'Dissertation Chapter 3'", description: "Student Sarah Researcher has assigned you a new task. Please review and accept or decline.", timestamp: "2024-07-22 11:00 AM", read: false, category: "New Business Task", link: "/va/business-tasks/BST001", icon: Target },
  { id: "VAN002", title: "Revision Requested for 'Financial Modeling'", description: "Student Mike Finance has requested revisions. Please check the task details for comments.", timestamp: "2024-07-21 15:30 PM", read: false, category: "Task Update", link: "/va/business-tasks/BST002", icon: MessageSquare },
  { id: "VAN003", title: "Payment Processed: ₦10,000", description: "Your payout for completed tasks has been processed.", timestamp: "2024-07-20 10:15 AM", read: true, category: "Payment", link: "/va/payouts", icon: DollarSign }, // Assuming /va/payouts page
  { id: "VAN004", title: "Profile Tip: Add More Skills", description: "Consider adding more skills to your profile to attract a wider range of tasks.", timestamp: "2024-07-19 09:00 AM", read: true, category: "System Alert", icon: Info },
  { id: "VAN005", title: "Task 'Legal Case Brief' Completed by Student", description: "Student Laura Lawyer has marked task BST003 as completed. Payment will be processed soon.", timestamp: "2024-07-18 17:00 PM", read: true, category: "Task Update", link: "/va/business-tasks/BST003", icon: Check },
  { id: "VAN006", title: "New Live Task Available: 'Urgent Proofreading'", description: "A new task is available in the Live Tasks pool that matches your skills.", timestamp: "2024-07-23 09:00 AM", read: false, category: "Live Task Available", link: "/va/live-tasks", icon: Broadcast },
];


function getVaCategoryBadgeVariant(category: VaNotificationItem['category']) {
    switch (category) {
        case 'New Business Task': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
        case 'Task Update': return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
        case 'Payment': return 'bg-green-100 text-green-700 hover:bg-green-200';
        case 'System Alert': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
        case 'Student Message': return 'bg-pink-100 text-pink-700 hover:bg-pink-200';
        case 'Live Task Available': return 'bg-teal-100 text-teal-700 hover:bg-teal-200';
        default: return 'secondary';
    }
}


export default function VaNotificationsPage() {
  const [notifications, setNotifications] = useState<VaNotificationItem[]>(initialVaNotifications);

  const toggleReadStatus = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: !n.read } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const clearAllNotifications = () => {
      setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-8">
      <PageHeader 
        title="VA Notifications"
        description={`You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`}
        icon={Bell}
        actions={
            <div className="flex gap-2">
                <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
                    <Check className="mr-2 h-4 w-4" /> Mark All as Read
                </Button>
                 <Button variant="destructive" onClick={clearAllNotifications} disabled={notifications.length === 0}>
                    <ArchiveX className="mr-2 h-4 w-4" /> Clear All
                </Button>
            </div>
        }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">All VA Notifications</CardTitle>
          <CardDescription>Manage and review all your VA-related notifications.</CardDescription>
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
                            "p-4 border rounded-lg hover:shadow-md transition-all duration-200",
                            item.read ? "bg-card/70 opacity-70" : "bg-card shadow-sm"
                        )}
                    >
                    <div className="flex items-start gap-4">
                        <div className={cn("p-2 rounded-full mt-1", item.read ? "bg-muted" : "bg-primary/10")}>
                            <Icon className={cn("h-5 w-5", item.read ? "text-muted-foreground" : "text-primary")} />
                        </div>
                        <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className={cn("font-semibold", item.read ? "text-muted-foreground" : "text-primary")}>{item.title}</h3>
                                <Badge variant="outline" className={cn("text-xs", getVaCategoryBadgeVariant(item.category))}>{item.category}</Badge>
                            </div>
                            <p className={cn("text-sm", item.read ? "text-muted-foreground/80" : "text-foreground/90")}>{item.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.timestamp}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 items-center self-start sm:self-center">
                            {item.link && (
                                <Button variant="ghost" size="sm" asChild className="text-xs text-accent hover:underline h-auto p-1">
                                    <Link href={item.link}><Eye className="mr-1 h-3.5 w-3.5"/>Details</Link>
                                </Button>
                            )}
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => toggleReadStatus(item.id)}
                                className="text-xs h-auto p-1"
                            >
                                {item.read ? <Check className="mr-1 h-3.5 w-3.5 text-green-600"/> : <X className="mr-1 h-3.5 w-3.5 text-red-600"/>}
                                {item.read ? 'Mark Unread' : 'Mark Read'}
                            </Button>
                        </div>
                    </div>
                    </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-12">
              <Archive className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">No Notifications</p>
              <p className="text-sm text-muted-foreground">You're all caught up!</p>
            </div>
          )}
        </CardContent>
         {notifications.length > 0 && (
            <CardFooter className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                    Showing {notifications.length} notification{notifications.length === 1 ? '' : 's'}.
                </p>
            </CardFooter>
         )}
      </Card>
    </div>
  );
}
