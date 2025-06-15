
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  Star,
  Lock,
  Briefcase, 
  CalendarCheck, 
  DollarSign, 
  Broadcast, // Icon for Live Tasks
  Target, // Icon for Business Service Tasks
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
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";


const studentNavItemsBase = [
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
  {
    href: "/dashboard/subscription", 
    activeHref: "/dashboard/find-va", 
    label: "VA Plus",
    icon: Star,
    status: "locked" as "locked" | "active",
  },
];

const accountNavItemsStudent = [
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  { href: "/dashboard/support", label: "Support Chat", icon: MessageSquare },
];

const adminNavItems = [
   { href: "/admin/dashboard", label: "Admin Dashboard", icon: LayoutDashboard },
   { href: "/admin/approvals", label: "Account Approvals", icon: ShieldCheck },
   { href: "/admin/tasks", label: "Task Approvals", icon: ClipboardList },
   { href: "/admin/users", label: "Manage Users", icon: BookUser },
   { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

const vaNavItems = [
  { href: "/va/dashboard", label: "VA Dashboard", icon: LayoutDashboard },
  { href: "/va/live-tasks", label: "Live Tasks", icon: Broadcast },
  { href: "/va/business-tasks", label: "Business Service Tasks", icon: Target },
  { href: "/va/profile", label: "My VA Profile", icon: UserCircle },
  // { href: "/va/availability", label: "My Availability", icon: CalendarCheck }, // Potentially part of profile
  // { href: "/va/payouts", label: "Payouts", icon: DollarSign }, // Could be part of dashboard or a separate section
  { href: "/va/notifications", label: "Notifications", icon: Bell },
  { href: "/va/support", label: "Support", icon: MessageSquare },
];


export function SidebarNav({ role = "student" }: { role?: "student" | "admin" | "va" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { open, isMobile, state: sidebarState } = useSidebar();

  const [studentNavItems, setStudentNavItems] = useState(studentNavItemsBase);
  const [hasMounted, setHasMounted] = useState(false);
  const [isSubscribedToVaPlan, setIsSubscribedToVaPlan] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      const storedPlanStatus = localStorage.getItem('stipsLiteVaPlanActive');
      if (storedPlanStatus === 'true') {
        setIsSubscribedToVaPlan(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    const planActivatedQuery = searchParams.get('plan_activated');
    
    const isVaPlanCurrentlyActive = 
      planActivatedQuery === 'expert_va' ||
      planActivatedQuery === 'business_org_va' ||
      pathname.startsWith('/dashboard/find-va') ||
      isSubscribedToVaPlan;

    if (planActivatedQuery === 'expert_va' || planActivatedQuery === 'business_org_va') {
        if (!isSubscribedToVaPlan) setIsSubscribedToVaPlan(true);
        if (typeof window !== 'undefined' && localStorage.getItem('stipsLiteVaPlanActive') !== 'true') {
            localStorage.setItem('stipsLiteVaPlanActive', 'true');
        }
    }

    setStudentNavItems(prevItems =>
      prevItems.map(item =>
        item.label === "VA Plus" ? { ...item, status: isVaPlanCurrentlyActive ? "active" : "locked", activeHref: "/dashboard/find-va" } : item
      )
    );
  }, [pathname, searchParams, hasMounted, isSubscribedToVaPlan]);


  const navItemsToRender = 
    role === "admin" ? adminNavItems : 
    role === "va" ? vaNavItems : 
    studentNavItems;
  
  const accountNavItems = role === "student" ? accountNavItemsStudent : []; // VA will have profile in main nav

  return (
    <SidebarMenu className="flex-1">
      {navItemsToRender.map((item) => {
        const isVaPlusItem = item.label === "VA Plus";
        const isVaPlusLocked = isVaPlusItem && item.status === "locked";
        // Ensure activeHref exists before trying to access it
        const activeHref = (item as any).activeHref;
        const currentHref = isVaPlusItem ? (isVaPlusLocked ? item.href : activeHref) : item.href;


        if ((item as any).subItems) {
          const subItems = (item as any).subItems as { href?: string; label: string; icon?: React.ElementType }[];
          return (
            <SidebarMenuItem key={item.label} className="relative">
              <SidebarMenuButton
                isActive={subItems.some(sub => sub.href && pathname.startsWith(sub.href))}
                tooltip={item.label}
              >
                <item.icon className="h-5 w-5" />
                <span className={cn(open ? "opacity-100" : "opacity-0 delay-200", "transition-opacity duration-200")}>{item.label}</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                {subItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.href}>
                    <SidebarMenuSubButton
                      href={subItem.href!}
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
              {isVaPlusItem && isVaPlusLocked && open && <Lock className="h-3.5 w-3.5 ml-1 text-muted-foreground shrink-0" />}
            </>
          );

          let tooltipText = item.label;
          if (isVaPlusItem) {
            tooltipText = isVaPlusLocked
              ? `Subscribe to the Expert VA Plan to unlock`
              : (item.label === "VA Plus" ? "Find a Virtual Assistant" : item.label);
          }

          return (
            <SidebarMenuItem key={item.label}>
              <Link href={currentHref!}>
                <SidebarMenuButton
                  isActive={pathname === currentHref && !(isVaPlusItem && isVaPlusLocked)} 
                  className={cn(
                    "justify-start w-full",
                    isVaPlusItem && isVaPlusLocked && "opacity-70 hover:bg-sidebar-accent/70"
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

      {role === "student" && accountNavItems.length > 0 && (
        <>
          <Separator className="my-4" />
          <SidebarGroupLabel className={cn(open ? "opacity-100" : "opacity-0 delay-200", "transition-opacity duration-200 pl-0")}>Account</SidebarGroupLabel>
          {accountNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
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
         <Link href={ role === "va" ? "/va/login" : "/auth/login"}>
            <SidebarMenuButton className="justify-start text-red-500 hover:bg-red-100 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300" tooltip="Logout">
                <LogOut className="h-5 w-5" />
                <span className={cn(open ? "opacity-100" : "opacity-0 delay-200", "transition-opacity duration-200")}>Logout</span>
            </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
