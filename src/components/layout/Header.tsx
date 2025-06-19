
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
import { Bell, LifeBuoy, LogOut, Settings, UserCircle, Sparkles, CheckCircle, Users as UsersIcon, CreditCard, DollarSign as DollarIcon, Eye, Briefcase, Printer, MessageSquare as MessageSquareIcon, AlertCircle as AlertCircleIcon, Gift, LayoutDashboard, Activity, Megaphone } from "lucide-react"; // Removed PanelLeft, Search
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AiSearchDialog } from "@/components/ai/AiSearchDialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { cn } from "@/lib/utils"; 
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { auth } from "@/lib/firebase"; // Import auth for signOut
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

// Mock notifications for the dropdown - ideally fetch this or share from a context
const mockStudentNotifications = [
  { id: "N001", title: "Task 'Research Paper Q1' Approved", timestamp: "2 hours ago", read: false, link: "/dashboard/tasks/TSK001", icon: CheckCircle },
  { id: "N002", title: "New Referral: Jane Doe", timestamp: "1 day ago", read: false, link: "/dashboard/referrals", icon: UsersIcon },
  { id: "N003", title: "Subscription Renewal Soon", timestamp: "3 days ago", read: true, link: "/dashboard/subscription", icon: CreditCard },
  { id: "N004", title: "Payment Received", timestamp: "5 days ago", read: true, link: "/dashboard/tasks/TSK00X", icon: DollarIcon },
  { id: "N005_ANNOUNCEMENT", title: "New Platform Announcement!", description: "Check out the latest updates for all users.", timestamp: "Just now", read: false, link: "/dashboard/notifications", icon: Megaphone },
];

const mockVaNotifications = [
  { id: "VAN001", title: "New Task Assigned", timestamp: "1 hour ago", read: false, link: "/va/business-tasks/BST001", icon: Briefcase },
  { id: "VAN002", title: "Payment Processed", timestamp: "2 days ago", read: true, link: "/va/payouts", icon: DollarIcon }, 
  { id: "VAN003", title: "New Student Referral: Mark P.", timestamp: "3 hours ago", read: false, link: "/va/referrals", icon: Gift },
  { id: "VAN004_ANNOUNCEMENT", title: "Important VA Update", description: "A new announcement regarding VA policies is available.", timestamp: "Just now", read: false, link: "/va/notifications", icon: Megaphone },
];

const mockPrintCenterNotifications = [
  { id: "PCN001", title: "New Print Job Received: #JOB123", description: "From Student John Doe - 'Math_Assignment.pdf'", timestamp: "30 mins ago", read: false, link: "/print-center/jobs/JOB123", icon: Printer },
  { id: "PCN002", title: "Payment Confirmed for Job #JOB120", description: "Student Alice S. has paid ₦50.00.", timestamp: "2 hours ago", read: false, link: "/print-center/jobs/JOB120", icon: DollarIcon },
  { id: "PCN003", title: "Admin Message: Holiday Schedule", description: "Please update your holiday hours in your profile.", timestamp: "2 days ago", read: true, link: "/print-center/profile", icon: MessageSquareIcon },
  { id: "PCN004", title: "Low Paper Stock Alert", description: "Your A4 paper stock seems low.", timestamp: "3 days ago", read: true, category: "Shop Alert", icon: AlertCircleIcon },
  { id: "PCN005", title: "New Print Center Referral: Alpha Prints", timestamp: "1 day ago", read: false, link: "/print-center/referrals", icon: Gift },
  { id: "PCN006_ANNOUNCEMENT", title: "Notice for Print Centers", description: "Check for important operational updates.", timestamp: "Just now", read: false, link: "/print-center/notifications", icon: Megaphone },
];

const mockAdminNotifications = [
    { id: "AN001", title: "New User 'Jane S.' Awaiting Approval", timestamp: "15 mins ago", read: false, link: "/admin/approvals", icon: UsersIcon },
    { id: "AN002", title: "Task 'TSK105' Submitted by 'John D.'", timestamp: "1 hour ago", read: false, link: "/admin/tasks", icon: Briefcase },
    { id: "AN003", title: "Support Ticket #STK034 Opened", timestamp: "3 hours ago", read: false, link: "/admin/dashboard", icon: LifeBuoy }, 
    { id: "AN004", title: "Platform Update Deployed Successfully", timestamp: "1 day ago", read: true, link: "/admin/settings", icon: Settings },
    { id: "AN005_SENT_ANNOUNCEMENT", title: "Announcement 'Holiday Hours' Sent", description: "Sent to Students, VAs, Print Centers.", timestamp: "20 mins ago", read: false, link: "/admin/announcements", icon: Megaphone },
];


export function Header({ role = "student" }: { role?: "student" | "admin" | "va" | "print-center" }) {
  const { isMobile } = useSidebar();
  const { user } = useAuth(); // Get user from AuthContext
  const router = useRouter();

  let userName = "Guest";
  let userEmail = "Not logged in";
  let profileLink = "/dashboard/profile";
  let notificationsLink = "/dashboard/notifications";
  let subscriptionSettingsLink = "/dashboard/subscription";
  let supportLink = "/dashboard/support";
  let logoutLink = "/auth/login";
  let referralsLink = "/dashboard/referrals";
  let currentNotifications = mockStudentNotifications;
  let notificationsLinkText = "Notifications";
  let NotificationsLinkIconComponent = Bell;

  if (user) { // If user is logged in
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
    logoutLink = "/va/login";
    referralsLink = "/va/referrals";
    currentNotifications = mockVaNotifications;
    NotificationsLinkIconComponent = Bell;
  } else if (role === "admin") {
    userName = "Admin User"; // Admin might not use Firebase Auth directly
    userEmail = "admin@stipslite.com"; 
    profileLink = "/admin/settings"; 
    notificationsLink = "/admin/notifications"; 
    subscriptionSettingsLink = ""; 
    supportLink = "/admin/dashboard"; 
    logoutLink = "/admin/login"; // Admin login is separate
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
    logoutLink = "/print-center/login";
    referralsLink = "/print-center/referrals";
    currentNotifications = mockPrintCenterNotifications;
    NotificationsLinkIconComponent = Bell;
  } else { // Student role (default)
     if (user) {
       profileLink = "/dashboard/profile";
       notificationsLink = "/dashboard/notifications";
       subscriptionSettingsLink = "/dashboard/subscription";
       supportLink = "/dashboard/support";
       logoutLink = "/auth/login";
       referralsLink = "/dashboard/referrals";
       currentNotifications = mockStudentNotifications;
       NotificationsLinkIconComponent = Bell;
     } else {
        // For logged out users, some links might not be relevant or should redirect to login
        profileLink = "/auth/login";
        notificationsLink = "/auth/login";
        subscriptionSettingsLink = "/auth/login";
        supportLink = "/auth/login";
        referralsLink = "/auth/login";
     }
  }
  
  const unreadNotificationsCount = currentNotifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener in AuthContext will handle user state update.
      // Redirect to login page based on role or a general landing page.
      const appropriateLogoutLink = role === "admin" ? "/admin/login" 
                                 : role === "va" ? "/va/login"
                                 : role === "print-center" ? "/print-center/login"
                                 : "/auth/login";
      router.push(appropriateLogoutLink);
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error (e.g., show toast)
    }
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
              <Bell className="h-5 w-5" />
              {user && unreadNotificationsCount > 0 && ( // Only show count if user is logged in
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
                <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt="User Avatar" data-ai-hint="person avatar" />
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
            {role === 'admin' && ( // Admin settings link
                <DropdownMenuItem asChild>
                <Link href={profileLink}> 
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Platform Settings</span>
                </Link>
                </DropdownMenuItem>
            )}
             {user && (<DropdownMenuItem asChild>
              <Link href={notificationsLink}>
                <NotificationsLinkIconComponent className="mr-2 h-4 w-4" />
                <span>{notificationsLinkText}</span>
                {unreadNotificationsCount > 0 && role !== 'admin' && <Badge variant="destructive" className="ml-auto">{unreadNotificationsCount}</Badge>}
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
             {role === 'admin' && ( // Admin referral settings link
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
             {role === 'admin' && ( // Admin dashboard overview
                 <DropdownMenuItem asChild>
                 <Link href="/admin/dashboard">
                     <LayoutDashboard className="mr-2 h-4 w-4" />
                     <span>Admin Overview</span>
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
