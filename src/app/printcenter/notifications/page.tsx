
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, Check, Eye, X, Archive, ArchiveX, Printer, DollarSign, MessageSquare, AlertCircle } from "lucide-react"; 
import { cn } from "@/lib/utils";

interface PrintCenterNotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  category: 'New Print Job' | 'Payment Update' | 'Admin Message' | 'Shop Alert';
  link?: string;
  icon?: React.ElementType;
}

const initialPrintCenterNotifications: PrintCenterNotificationItem[] = [
  { id: "PCN001", title: "New Print Job Received: #JOB123", description: "From Student John Doe - 'Math_Assignment.pdf', 10 pages, Color.", timestamp: "2024-07-25 10:00 AM", read: false, category: "New Print Job", link: "/printcenter/jobs/JOB123", icon: Printer },
  { id: "PCN002", title: "Payment Confirmed for Job #JOB120", description: "Student Alice Smith has paid ₦50.00 for job #JOB120.", timestamp: "2024-07-24 14:30 PM", read: false, category: "Payment Update", link: "/printcenter/jobs/JOB120", icon: DollarSign },
  { id: "PCN003", title: "Admin Message: Holiday Hours", description: "Please update your shop's operating hours for the upcoming public holiday.", timestamp: "2024-07-23 09:15 AM", read: true, category: "Admin Message", link: "/printcenter/profile", icon: MessageSquare },
  { id: "PCN004", title: "Low Paper Stock Alert", description: "Your A4 paper stock seems low. Consider reordering.", timestamp: "2024-07-22 11:00 AM", read: true, category: "Shop Alert", icon: AlertCircle },
];


function getPrintCenterCategoryBadgeVariant(category: PrintCenterNotificationItem['category']) {
    switch (category) {
        case 'New Print Job': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
        case 'Payment Update': return 'bg-green-100 text-green-700 hover:bg-green-200';
        case 'Admin Message': return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
        case 'Shop Alert': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
        default: return 'secondary';
    }
}


export default function PrintCenterNotificationsPage() {
  const [notifications, setNotifications] = useState<PrintCenterNotificationItem[]>(initialPrintCenterNotifications);

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
        title="Shop Notifications"
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
          <CardTitle className="font-headline">All Shop Notifications</CardTitle>
          <CardDescription>Manage and review all your print center notifications.</CardDescription>
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
                                <Badge variant="outline" className={cn("text-xs", getPrintCenterCategoryBadgeVariant(item.category))}>{item.category}</Badge>
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
