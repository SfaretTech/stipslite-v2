
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
import { Bell, LifeBuoy, LogOut, Settings, UserCircle, PanelLeft, Search, Sparkles, CheckCircle, Users as UsersIcon, CreditCard, DollarSign as DollarIcon, Eye, Briefcase, Printer, MessageSquare as MessageSquareIcon, AlertCircle as AlertCircleIcon, Gift, LayoutDashboard } from "lucide-react";
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
  { id: "VAN003", title: "New Student Referral: Mark P.", timestamp: "3 hours ago", read: false, link: "/va/referrals", icon: Gift },
];

const mockPrintCenterNotifications = [
  { id: "PCN001", title: "New Print Job Received: #JOB123", description: "From Student John Doe - 'Math_Assignment.pdf'", timestamp: "30 mins ago", read: false, link: "/printcenter/jobs/JOB123", icon: Printer },
  { id: "PCN002", title: "Payment Confirmed for Job #JOB120", description: "Student Alice S. has paid ₦50.00.", timestamp: "2 hours ago", read: false, link: "/printcenter/jobs/JOB120", icon: DollarIcon },
  { id: "PCN003", title: "Admin Message: Holiday Schedule", description: "Please update your holiday hours in your profile.", timestamp: "2 days ago", read: true, link: "/printcenter/profile", icon: MessageSquareIcon },
  { id: "PCN004", title: "Low Paper Stock Alert", description: "Your A4 paper stock seems low.", timestamp: "3 days ago", read: true, category: "Shop Alert", icon: AlertCircleIcon },
  { id: "PCN005", title: "New Print Center Referral: Alpha Prints", timestamp: "1 day ago", read: false, link: "/printcenter/referrals", icon: Gift },
];

const mockAdminNotifications = [
    { id: "AN001", title: "New User 'Jane S.' Awaiting Approval", timestamp: "15 mins ago", read: false, link: "/admin/approvals", icon: UsersIcon },
    { id: "AN002", title: "Task 'TSK105' Submitted by 'John D.'", timestamp: "1 hour ago", read: false, link: "/admin/tasks", icon: Briefcase },
    { id: "AN003", title: "Support Ticket #STK034 Opened", timestamp: "3 hours ago", read: false, link: "/admin/dashboard", icon: LifeBuoy }, // Assuming admins handle support tickets or see them
    { id: "AN004", title: "Platform Update Deployed Successfully", timestamp: "1 day ago", read: true, link: "/admin/settings", icon: Settings },
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
  let referralsLink = "/dashboard/referrals";
  let currentNotifications = mockStudentNotifications;

  if (role === "va") {
    userName = "VA Name";
    userEmail = "va@example.com";
    profileLink = "/va/profile";
    notificationsLink = "/va/notifications";
    subscriptionSettingsLink = "/va/subscription"; 
    supportLink = "/va/support";
    logoutLink = "/va/login";
    referralsLink = "/va/referrals";
    currentNotifications = mockVaNotifications;
  } else if (role === "admin") {
    userName = "Admin User";
    userEmail = "admin@stipslite.com"; // Changed email
    profileLink = "/admin/settings"; // Admin's "profile" is platform settings
    notificationsLink = "/admin/dashboard"; // Or a specific admin activity log page
    subscriptionSettingsLink = ""; // No direct subscription for admin account
    supportLink = "/admin/dashboard"; // Admin might handle support or view overview
    logoutLink = "/auth/login"; // Admin logs out to general login
    referralsLink = "/admin/settings"; // Admin manages referral program from settings
    currentNotifications = mockAdminNotifications; 
  } else if (role === "print-center") {
    userName = "Print Shop Owner";
    userEmail = "shop@example.com";
    profileLink = "/printcenter/profile";
    notificationsLink = "/printcenter/notifications"; 
    subscriptionSettingsLink = ""; // Print centers don't have subscriptions in this model
    supportLink = "/printcenter/support";
    logoutLink = "/printcenter/login";
    referralsLink = "/printcenter/referrals";
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
            {role !== 'admin' && (
                <DropdownMenuItem asChild>
                <Link href={profileLink}>
                    {role === 'print-center' ? <Printer className="mr-2 h-4 w-4" /> : <UserCircle className="mr-2 h-4 w-4" />}
                    <span>{role === 'print-center' ? 'Shop Profile' : 'Profile'}</span>
                </Link>
                </DropdownMenuItem>
            )}
            {role === 'admin' && (
                <DropdownMenuItem asChild>
                <Link href={profileLink}> 
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Platform Settings</span>
                </Link>
                </DropdownMenuItem>
            )}
             <DropdownMenuItem asChild>
              <Link href={notificationsLink}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
                {unreadNotificationsCount > 0 && <Badge variant="destructive" className="ml-auto">{unreadNotificationsCount}</Badge>}
              </Link>
            </DropdownMenuItem>
            { (role === 'student' || role === 'va') && subscriptionSettingsLink && (
                <DropdownMenuItem asChild>
                <Link href={subscriptionSettingsLink}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Subscription</span>
                </Link>
                </DropdownMenuItem>
            )}
             {role !== 'admin' && (
                <DropdownMenuItem asChild>
                  <Link href={referralsLink}>
                    <Gift className="mr-2 h-4 w-4" />
                    <span>Referrals</span>
                  </Link>
                </DropdownMenuItem>
            )}
             {role === 'admin' && ( // Admin specific link for referral settings
                <DropdownMenuItem asChild>
                <Link href="/admin/settings"> 
                    <Gift className="mr-2 h-4 w-4" />
                    <span>Referral Settings</span>
                </Link>
                </DropdownMenuItem>
            )}
             {role !== 'admin' && (
                <DropdownMenuItem asChild>
                <Link href={supportLink}>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Support</span>
                </Link>
                </DropdownMenuItem>
             )}
             {role === 'admin' && (
                 <DropdownMenuItem asChild>
                 <Link href="/admin/dashboard">
                     <LayoutDashboard className="mr-2 h-4 w-4" />
                     <span>Admin Overview</span>
                 </Link>
                 </DropdownMenuItem>
             )}
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
