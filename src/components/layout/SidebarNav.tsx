
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
  Bell, // Added Bell icon
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
  SidebarGroupLabel, // Added import
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

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
];

const accountNavItems = [
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell }, // Added Notifications link
  { href: "/dashboard/support", label: "Support Chat", icon: MessageSquare },
];

// Placeholder for admin navigation
const adminNavItems = [
   { href: "/admin/dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
   { href: "/admin/approvals", label: "Account Approvals", icon: ShieldCheck },
   { href: "/admin/tasks", label: "Task Approvals", icon: ClipboardList },
   { href: "/admin/users", label: "Manage Users", icon: BookUser },
   { href: "/admin/settings", label: "Site Settings", icon: Settings },
];


export function SidebarNav({ role = "student" }: { role?: "student" | "admin" }) {
  const pathname = usePathname();
  const { open } = useSidebar(); // To conditionally render labels for icons

  const navItems = role === "admin" ? adminNavItems : studentNavItems;

  return (
    <SidebarMenu className="flex-1">
      {navItems.map((item) =>
        item.subItems ? (
          <SidebarMenuItem key={item.label} className="relative">
            <SidebarMenuButton
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
        ) : (
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
        )
      )}

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

    