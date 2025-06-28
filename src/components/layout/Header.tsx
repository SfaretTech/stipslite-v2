
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
} from "@/components/ui/dropdown-menu";
import { Bell, LifeBuoy, LogOut, Settings, UserCircle, Sparkles, CheckCircle, Users as UsersIcon, CreditCard, DollarSign as DollarIcon, Briefcase, Printer, MessageSquare as MessageSquareIcon, AlertCircle as AlertCircleIcon, Gift, LayoutDashboard, Activity, Eye } from "lucide-react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AiSearchDialog } from "@/components/ai/AiSearchDialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// Mock notifications for the dropdown - ideally fetch this or share from a context
const mockStudentNotifications = [
  { id: "N001", title: "Task 'Research Paper Q1' Approved", description: "Your task has been approved. Payment of ₦25.00 is now due.", timestamp: "2 hours ago", read: false, link: "/dashboard/tasks/TSK001", icon: CheckCircle },
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
  { id: "PCN001", title: "New Print Job Received: #JOB123", description: "From Student John Doe - 'Math_Assignment.pdf'", timestamp: "30 mins ago", read: false, link: "/print-center/jobs/JOB123", icon: Printer },
  { id: "PCN002", title: "Payment Confirmed for Job #JOB120", description: "Student Alice S. has paid ₦50.00.", timestamp: "2 hours ago", read: false, link: "/print-center/jobs/JOB120", icon: DollarIcon },
  { id: "PCN003", title: "Admin Message: Holiday Schedule", description: "Please update your holiday hours in your profile.", timestamp: "2 days ago", read: true, link: "/print-center/profile", icon: MessageSquareIcon },
  { id: "PCN004", title: "Low Paper Stock Alert", description: "Your A4 paper stock seems low.", timestamp: "3 days ago", read: true, category: "Shop Alert", icon: AlertCircleIcon },
  { id: "PCN005", title: "New Print Center Referral: Alpha Prints", timestamp: "1 day ago", read: false, link: "/print-center/referrals", icon: Gift },
];

const mockAdminNotifications = [
    { id: "AN001", title: "New User 'Jane S.' Awaiting Approval", timestamp: "15 mins ago", read: false, link: "/admin/approvals", icon: UsersIcon },
    { id: "AN002", title: "Task 'TSK105' Submitted by 'John D.'", timestamp: "1 hour ago", read: false, link: "/admin/tasks", icon: Briefcase },
    { id: "AN003", title: "Support Ticket #STK034 Opened", timestamp: "3 hours ago", read: false, link: "/admin/support", icon: LifeBuoy },
];


export function Header({ role = "student" }: { role?: "student" | "admin" | "va" | "print-center" }) {
  const { isMobile } = useSidebar();
  const { user, setUser } = useAuth(); // Get user from context
  const router = useRouter();
  const { toast } = useToast();

  let userName = "Guest";
  let userEmail = "Not logged in";
  let profileLink = "/dashboard/profile";
  let notificationsLink = "/dashboard/notifications";
  let subscriptionSettingsLink = "/dashboard/subscription";
  let supportLink = "/dashboard/support";
  let referralsLink = "/dashboard/referrals";
  let currentNotifications = mockStudentNotifications;
  let notificationsLinkText = "Notifications";
  let NotificationsLinkIconComponent = Bell;

  if (user) {
    userName = user.displayName || user.email?.split('@')[0] || "User";
    userEmail = user.email || "No email";
  }

  if (role === "va") {
    userName = user ? (user.displayName || user.email?.split('@')[0] || "VA User") : "VA User";
    userEmail = user ? (user.email || "va.user@example.com") : "va.user@example.com";
    profileLink = "/va/profile";
    notificationsLink = "/va/notifications";
    subscriptionSettingsLink = "/va/subscription";
    supportLink = "/va/support";
    referralsLink = "/va/referrals";
    currentNotifications = mockVaNotifications;
    NotificationsLinkIconComponent = Bell;
  } else if (role === "admin") {
    userName = "Admin User";
    userEmail = "admin@stipslite.com";
    profileLink = "/admin/settings";
    notificationsLink = "/admin/settings"; // Admin notifications are now an activity log under settings or a dedicated page. Redirecting to settings for now.
    subscriptionSettingsLink = "";
    supportLink = "/admin/support";
    referralsLink = "/admin/settings";
    currentNotifications = mockAdminNotifications;
    notificationsLinkText = "Activity Log";
    NotificationsLinkIconComponent = Activity;
  } else if (role === "print-center") {
    userName = user ? (user.displayName || user.email?.split('@')[0] || "Print Center") : "Print Center";
    userEmail = user ? (user.email || "pc.user@example.com") : "pc.user@example.com";
    profileLink = "/print-center/profile";
    notificationsLink = "/print-center/notifications";
    subscriptionSettingsLink = "/print-center/subscription";
    supportLink = "/print-center/support";
    referralsLink = "/print-center/referrals";
    currentNotifications = mockPrintCenterNotifications;
    NotificationsLinkIconComponent = Bell;
  } else {
     if (user) {
       profileLink = "/dashboard/profile";
       notificationsLink = "/dashboard/notifications";
       subscriptionSettingsLink = "/dashboard/subscription";
       supportLink = "/dashboard/support";
       referralsLink = "/dashboard/referrals";
       currentNotifications = mockStudentNotifications;
       NotificationsLinkIconComponent = Bell;
     } else {
        // Default guest links
        profileLink = "/auth/login";
        notificationsLink = "/auth/login";
        subscriptionSettingsLink = "/auth/login";
        supportLink = "/auth/login";
        referralsLink = "/auth/login";
     }
  }

  const unreadNotificationsCount = currentNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    setUser(null); // Clear user from context
    const appropriateLogoutLink = role === "admin" ? "/admin/login"
                               : role === "va" ? "/va/login"
                               : role === "print-center" ? "/print-center/login"
                               : "/auth/login";
    router.push(appropriateLogoutLink);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {isMobile && <SidebarTrigger />}
      {!isMobile && <div className="w-8 h-8" />
      }

      <div className="flex-1">

      </div>

      <div className="flex items-center gap-3">
        <AiSearchDialog />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full relative">
              <NotificationsLinkIconComponent className="h-5 w-5" />
              {user && unreadNotificationsCount > 0 && (
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
              <span>{role === 'admin' ? 'Recent Activity' : 'Recent Notifications'}</span>
              {user && unreadNotificationsCount > 0 && <Badge variant="secondary">{unreadNotificationsCount} Unread</Badge>}
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

                        {(notification as any).description && <p className="text-xs text-muted-foreground/80 line-clamp-1">{(notification as any).description}</p>}
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
                <Eye className="mr-2 h-4 w-4" /> View All {notificationsLinkText}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt={user?.displayName || "User"} data-ai-hint="person avatar" />
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
            {user && role !== 'admin' && (
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
             {user && role !== 'admin' && (<DropdownMenuItem asChild>
              <Link href={notificationsLink}>
                <NotificationsLinkIconComponent className="mr-2 h-4 w-4" />
                <span>{notificationsLinkText}</span>
                {unreadNotificationsCount > 0 && <Badge variant="destructive" className="ml-auto">{unreadNotificationsCount}</Badge>}
              </Link>
            </DropdownMenuItem>)}
            {user && subscriptionSettingsLink && role !== 'admin' && (
                <DropdownMenuItem asChild>
                <Link href={subscriptionSettingsLink}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Subscription</span>
                </Link>
                </DropdownMenuItem>
            )}
             {user && role !== 'admin' && (
                <DropdownMenuItem asChild>
                  <Link href={referralsLink}>
                    <Gift className="mr-2 h-4 w-4" />
                    <span>Referrals</span>
                  </Link>
                </DropdownMenuItem>
            )}
             {role === 'admin' && (
                 <DropdownMenuItem asChild>
                 <Link href="/admin/settings#referralProgramActive">
                    <Gift className="mr-2 h-4 w-4" />
                    <span>Referral Settings</span>
                 </Link>
                 </DropdownMenuItem>
             )}
             {user && role !== 'admin' && (
                <DropdownMenuItem asChild>
                <Link href={supportLink}>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Support</span>
                </Link>
                </DropdownMenuItem>
             )}
             {role === 'admin' && (
                 <DropdownMenuItem asChild>
                 <Link href="/admin/support">
                     <LifeBuoy className="mr-2 h-4 w-4" />
                     <span>Support Center</span>
                 </Link>
                 </DropdownMenuItem>
             )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
