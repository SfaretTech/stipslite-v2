
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardList,
  FilePlus2,
  Printer,
  Users,
  UserCircle,
  MessageSquare,
  CreditCard,
  LogOut,
  ShieldCheck,
  Settings,
  BookUser,
  Bell,
  Star, // Added Star icon for Professional VA
  Lock, // Added Lock icon for locked state
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Added for custom tooltip on locked item


const studentNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Tasks",
    icon: ClipboardList,
    subItems: [
      { href: "/dashboard/tasks", label: "My Tasks", icon: ClipboardList },
      { href: "/dashboard/tasks/submit", label: "Submit New Task", icon: FilePlus2 },
    ],
  },
  { href: "/dashboard/print-centers", label: "Print Centers", icon: Printer },
  { href: "/dashboard/referrals", label: "Referrals", icon: Users },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  {
    href: "/dashboard/subscription", // Links to subscription page to activate/manage
    label: "Professional VA",
    icon: Star,
    status: "locked" as "locked" | "active", // Simulate 'locked' state
  },
];

const accountNavItems = [
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/support", label: "Support Chat", icon: MessageSquare },
];

const adminNavItems = [
   { href: "/admin/dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
   { href: "/admin/approvals", label: "Account Approvals", icon: ShieldCheck },
   { href: "/admin/tasks", label: "Task Approvals", icon: ClipboardList },
   { href: "/admin/users", label: "Manage Users", icon: BookUser },
   { href: "/admin/settings", label: "Site Settings", icon: Settings },
];


export function SidebarNav({ role = "student" }: { role?: "student" | "admin" }) {
  const pathname = usePathname();
  const { open, isMobile, state: sidebarState } = useSidebar(); // Added isMobile and sidebarState

  const navItems = role === "admin" ? adminNavItems : studentNavItems;

  return (
    <SidebarMenu className="flex-1">
      {navItems.map((item) => {
        // @ts-ignore - status is a custom prop for Professional VA item
        const isProVALocked = item.label === "Professional VA" && item.status === "locked";

        if (item.subItems) {
          return (
            <SidebarMenuItem key={item.label} className="relative">
              <SidebarMenuButton
                // @ts-ignore
                isActive={item.subItems.some(sub => pathname.startsWith(sub.href))}
                tooltip={item.label}
              >
                <item.icon className="h-5 w-5" />
                <span className={cn(open ? "opacity-100" : "opacity-0 delay-200", "transition-opacity duration-200")}>{item.label}</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                {item.subItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.href}>
                    <SidebarMenuSubButton
                      href={subItem.href} 
                      isActive={pathname === subItem.href}
                      className="justify-start"
                      size="sm"
                    >
                      {subItem.icon && <subItem.icon className="h-4 w-4 mr-2" />}
                      {subItem.label}
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </SidebarMenuItem>
          );
        } else {
          const buttonContent = (
            <>
              <item.icon className="h-5 w-5" />
              <span className={cn(open ? "opacity-100" : "opacity-0 delay-200", "transition-opacity duration-200 flex-grow truncate")}>{item.label}</span>
              {isProVALocked && open && <Lock className="h-3.5 w-3.5 ml-1 text-muted-foreground shrink-0" />}
            </>
          );

          const tooltipText = isProVALocked ? `${item.label} (Activate via Subscription)` : item.label;

          return (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  as="a"
                  // @ts-ignore
                  isActive={pathname === item.href && !isProVALocked}
                  className={cn(
                    "justify-start w-full",
                    isProVALocked && "opacity-70 hover:bg-sidebar-accent/70"
                  )}
                  tooltip={{
                    children: tooltipText,
                    side: "right",
                    align: "center",
                    hidden: sidebarState !== "collapsed" || isMobile,
                  }}
                >
                  {buttonContent}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        }
      })}

      {role === "student" && (
        <>
          <Separator className="my-4" />
          <SidebarGroupLabel className={cn(open ? "opacity-100" : "opacity-0 delay-200", "transition-opacity duration-200 pl-0")}>Account</SidebarGroupLabel>
          {accountNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  className="justify-start"
                  tooltip={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  <span className={cn(open ? "opacity-100" : "opacity-0 delay-200", "transition-opacity duration-200")}>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </>
      )}
      
      <Separator className="my-4" />
      <SidebarMenuItem>
         <Link href="/auth/login">
            <SidebarMenuButton className="justify-start text-red-500 hover:bg-red-100 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300" tooltip="Logout">
                <LogOut className="h-5 w-5" />
                <span className={cn(open ? "opacity-100" : "opacity-0 delay-200", "transition-opacity duration-200")}>Logout</span>
            </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
