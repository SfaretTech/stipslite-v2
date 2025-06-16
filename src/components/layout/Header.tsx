
"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Bell, LifeBuoy, LogOut, Settings, UserCircle, PanelLeft, Search, Sparkles, CheckCircle, Users as UsersIcon, CreditCard, DollarSign as DollarIcon, Eye, Briefcase, Printer } from "lucide-react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AiSearchDialog } from "@/components/ai/AiSearchDialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { cn } from "@/lib/utils"; 

// Mock notifications for the dropdown - ideally fetch this or share from a context
const mockStudentNotifications = [
  { id: "N001", title: "Task 'Research Paper Q1' Approved", timestamp: "2 hours ago", read: false, link: "/dashboard/tasks/TSK001", icon: CheckCircle },
  { id: "N002", title: "New Referral: Jane Doe", timestamp: "1 day ago", read: false, link: "/dashboard/referrals", icon: UsersIcon },
  { id: "N003", title: "Subscription Renewal Soon", timestamp: "3 days ago", read: true, link: "/dashboard/subscription", icon: CreditCard },
  { id: "N004", title: "Payment Received", timestamp: "5 days ago", read: true, link: "/dashboard/tasks/TSK00X", icon: DollarIcon },
];

const mockVaNotifications = [
  { id: "VAN001", title: "New Task Assigned", timestamp: "1 hour ago", read: false, link: "/va/business-tasks/BST001", icon: Briefcase },
  { id: "VAN002", title: "Payment Processed", timestamp: "2 days ago", read: true, link: "/va/payouts", icon: DollarIcon }, 
];

const mockPrintCenterNotifications = [
  { id: "PCN001", title: "New Print Job Received", description: "From Student John D. - 'Math_Assignment.pdf'", timestamp: "30 mins ago", read: false, link: "/print-center/jobs/JOB001", icon: Printer },
  { id: "PCN002", title: "Admin Message: Holiday Schedule", description: "Please update your holiday hours.", timestamp: "2 days ago", read: true, link: "/print-center/support", icon: Settings },
];


export function Header({ role = "student" }: { role?: "student" | "admin" | "va" | "print-center" }) {
  const { isMobile } = useSidebar();

  let userName = "Student Name";
  let userEmail = "student@example.com";
  let profileLink = "/dashboard/profile";
  let notificationsLink = "/dashboard/notifications";
  let subscriptionSettingsLink = "/dashboard/subscription";
  let supportLink = "/dashboard/support";
  let logoutLink = "/auth/login";
  let currentNotifications = mockStudentNotifications;

  if (role === "va") {
    userName = "VA Name";
    userEmail = "va@example.com";
    profileLink = "/va/profile";
    notificationsLink = "/va/notifications";
    subscriptionSettingsLink = "/va/subscription"; 
    supportLink = "/va/support";
    logoutLink = "/va/login";
    currentNotifications = mockVaNotifications;
  } else if (role === "admin") {
    userName = "Admin User";
    userEmail = "admin@example.com";
    profileLink = "/admin/settings"; 
    notificationsLink = "/admin/dashboard"; 
    subscriptionSettingsLink = "/admin/settings"; 
    supportLink = "/admin/dashboard"; 
    logoutLink = "/auth/login"; 
    currentNotifications = []; 
  } else if (role === "print-center") {
    userName = "Print Shop Owner";
    userEmail = "shop@example.com";
    profileLink = "/print-center/profile";
    notificationsLink = "/print-center/dashboard"; // Or a dedicated notifications page later
    subscriptionSettingsLink = "/print-center/profile"; // Shop settings might be in profile
    supportLink = "/print-center/support";
    logoutLink = "/print-center/login";
    currentNotifications = mockPrintCenterNotifications;
  }
  
  const unreadNotificationsCount = currentNotifications.filter(n => !n.read).length;


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {isMobile && <SidebarTrigger />}
      {!isMobile && <div className="w-8 h-8" /> /* Placeholder to align items when desktop sidebar trigger is hidden or part of sidebar itself */}
      
      <div className="flex-1">
        {/* Optional: Global search bar if not using AI Search Dialog exclusively */}
      </div>

      <div className="flex items-center gap-3">
        <AiSearchDialog />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs rounded-full"
                >
                  {unreadNotificationsCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 md:w-96">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Recent Notifications</span>
              {unreadNotificationsCount > 0 && <Badge variant="secondary">{unreadNotificationsCount} Unread</Badge>}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px] max-h-[calc(100vh-200px)]"> 
              {currentNotifications.length === 0 && (
                <DropdownMenuItem disabled className="text-center text-muted-foreground py-4">
                  No new notifications.
                </DropdownMenuItem>
              )}
              {currentNotifications.map(notification => {
                const IconComponent = notification.icon || Bell;
                return (
                  <DropdownMenuItem key={notification.id} asChild className={cn(!notification.read && "bg-accent/50 hover:bg-accent/70", "cursor-pointer")}>
                    <Link href={notification.link || notificationsLink} className="flex items-start gap-3 p-2">
                      <IconComponent className={cn("h-5 w-5 mt-0.5 shrink-0", notification.read ? "text-muted-foreground" : "text-primary")} />
                      <div className="flex-grow">
                        <p className={cn("text-sm font-medium", !notification.read && "text-foreground")}>{notification.title}</p>
                        {/* @ts-ignore */}
                        {notification.description && <p className="text-xs text-muted-foreground/80 line-clamp-1">{notification.description}</p>}
                        <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                      </div>
                       {!notification.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5"></div>}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </ScrollArea>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={notificationsLink} className="flex items-center justify-center text-primary hover:underline">
                <Eye className="mr-2 h-4 w-4" /> View All Notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="person avatar" />
                <AvatarFallback>{userName.substring(0,1).toUpperCase()}{userName.split(' ')[1]?.substring(0,1).toUpperCase() || userName.substring(1,2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={profileLink}>
                {role === 'print-center' ? <Printer className="mr-2 h-4 w-4" /> : <UserCircle className="mr-2 h-4 w-4" />}
                <span>{role === 'print-center' ? 'Shop Profile' : 'Profile'}</span>
              </Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link href={notificationsLink}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
                {unreadNotificationsCount > 0 && <Badge variant="destructive" className="ml-auto">{unreadNotificationsCount}</Badge>}
              </Link>
            </DropdownMenuItem>
            { (role === 'student' || role === 'va') && (
                <DropdownMenuItem asChild>
                <Link href={subscriptionSettingsLink}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Subscription</span>
                </Link>
                </DropdownMenuItem>
            )}
             { role === 'admin' && (
                <DropdownMenuItem asChild>
                <Link href={subscriptionSettingsLink}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Platform Settings</span>
                </Link>
                </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href={supportLink}>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={logoutLink} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
