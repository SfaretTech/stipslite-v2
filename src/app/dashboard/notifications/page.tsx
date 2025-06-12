
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, Check, Eye, X, Archive, ArchiveX } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  category: 'Task Update' | 'Referral' | 'System Alert' | 'New Feature' | 'Payment';
  link?: string;
  icon?: React.ElementType;
}

const initialNotifications: NotificationItem[] = [
  { id: "N001", title: "Task 'Research Paper Q1' Approved", description: "Your task has been approved. Payment of ₦25.00 is now due.", timestamp: "2024-07-22 10:00 AM", read: false, category: "Task Update", link: "/dashboard/tasks/TSK001", icon: Check },
  { id: "N002", title: "New Referral Signup!", description: "Jane Doe signed up using your referral link. You'll earn ₦5.00 once they complete their first task.", timestamp: "2024-07-21 14:30 PM", read: false, category: "Referral", link: "/dashboard/referrals", icon: Users },
  { id: "N003", title: "Subscription Renewal Soon", description: "Your Pro plan will renew on August 1st, 2024.", timestamp: "2024-07-20 09:15 AM", read: true, category: "System Alert", link: "/dashboard/subscription", icon: CreditCard },
  { id: "N004", title: "AI Search Feature Launched", description: "Try our new AI-powered search in the header to find tasks and print centers faster!", timestamp: "2024-07-19 11:00 AM", read: true, category: "New Feature", icon: Sparkles },
  { id: "N005", title: "Payment Received for TSK00X", description: "We've received your payment for task 'Placeholder Task'. Work will begin shortly.", timestamp: "2024-07-18 16:45 PM", read: true, category: "Payment", link: "/dashboard/tasks/TSK00X", icon: DollarSign },
];


function getCategoryBadgeVariant(category: NotificationItem['category']) {
    switch (category) {
        case 'Task Update': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
        case 'Referral': return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
        case 'System Alert': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
        case 'New Feature': return 'bg-green-100 text-green-700 hover:bg-green-200';
        case 'Payment': return 'bg-teal-100 text-teal-700 hover:bg-teal-200';
        default: return 'secondary';
    }
}


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

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
        title="Notifications"
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
          <CardTitle className="font-headline">All Notifications</CardTitle>
          <CardDescription>Manage and review all your notifications.</CardDescription>
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
                                <Badge variant="outline" className={cn("text-xs", getCategoryBadgeVariant(item.category))}>{item.category}</Badge>
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
// Add some icons that might be used by notifications
import { Sparkles, Users, CreditCard, DollarSign } from "lucide-react";

    
