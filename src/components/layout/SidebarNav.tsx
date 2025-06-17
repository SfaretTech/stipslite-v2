
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
  Signal, 
  Target, 
  ListChecks,
  Banknote, 
  Store, 
  FileText, 
  Gift,
  Activity,
  UserCog, 
  ShieldOff, // Added ShieldOff
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
  { href: "/dashboard/referrals", label: "Referrals", icon: Gift },
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
   { href: "/admin/manage-admins", label: "Manage Admins", icon: UserCog }, 
   { href: "/admin/notifications", label: "Activity Log", icon: Activity }, // Changed label and icon
   { href: "/admin/settings", label: "Platform Settings", icon: Settings },
];

const vaNavItemsBase = [
  { href: "/va/dashboard", label: "VA Dashboard", icon: LayoutDashboard },
  { href: "/va/live-tasks", label: "Live Tasks", icon: Signal },
  { href: "/va/my-tasks", label: "My Tasks", icon: ListChecks },
  { 
    href: "/va/subscription", 
    activeHref: "/va/business-tasks", 
    label: "Business Service Tasks", 
    icon: Target,
    status: "locked" as "locked" | "active",
  },
  { href: "/va/profile", label: "My VA Profile", icon: UserCircle },
  { href: "/va/payouts", label: "Payouts", icon: Banknote }, 
  { href: "/va/referrals", label: "Referrals", icon: Gift },
  { href: "/va/notifications", label: "Notifications", icon: Bell },
  { href: "/va/subscription", label: "My Subscription", icon: CreditCard }, 
  { href: "/va/support", label: "Support", icon: MessageSquare },
];

const printCenterNavItems = [
  { href: "/printcenter/dashboard", label: "PC Dashboard", icon: LayoutDashboard },
  { href: "/printcenter/jobs", label: "Print Jobs", icon: FileText },
  { href: "/printcenter/profile", label: "Shop Profile", icon: Store },
  { href: "/printcenter/earnings", label: "Earnings & Payouts", icon: Banknote },
  { href: "/printcenter/referrals", label: "Referrals", icon: Gift },
  { href: "/printcenter/notifications", label: "Notifications", icon: Bell },
  { href: "/printcenter/subscription", label: "Subscription", icon: CreditCard }, // Added subscription
  { href: "/printcenter/support", label: "Support", icon: MessageSquare },
];


export function SidebarNav({ role = "student" }: { role?: "student" | "admin" | "va" | "print-center" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { open, isMobile, state: sidebarState } = useSidebar();

  const [studentNavItems, setStudentNavItems] = useState(studentNavItemsBase);
  const [vaNavItems, setVaNavItems] = useState(vaNavItemsBase);
  const [hasMounted, setHasMounted] = useState(false);
  const [isSubscribedToStudentVaPlan, setIsSubscribedToStudentVaPlan] = useState(false);
  const [isVaSubscribedToProPlan, setIsVaSubscribedToProPlan] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      const studentPlanStatus = localStorage.getItem('stipsLiteActivePlanId'); 
      if (studentPlanStatus === 'expert_va') {
        setIsSubscribedToStudentVaPlan(true);
      }
      const vaProPlanStatus = localStorage.getItem('stipsLiteVaProPlanActive'); 
      if (vaProPlanStatus === 'true') {
        setIsVaSubscribedToProPlan(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    const planActivatedQuery = searchParams.get('plan_activated');
    
    const isStudentVaPlanCurrentlyActive = 
      planActivatedQuery === 'expert_va' || 
      pathname.startsWith('/dashboard/find-va') ||
      isSubscribedToStudentVaPlan;

    if (planActivatedQuery === 'expert_va') { 
        if (!isSubscribedToStudentVaPlan) setIsSubscribedToStudentVaPlan(true);
        if (typeof window !== 'undefined' && localStorage.getItem('stipsLiteVaPlanActive') !== 'true') {
            localStorage.setItem('stipsLiteVaPlanActive', 'true');
        }
    }

    setStudentNavItems(prevItems =>
      prevItems.map(item =>
        item.label === "VA Plus" ? { ...item, status: isStudentVaPlanCurrentlyActive ? "active" : "locked" } : item
      )
    );

    const isVaProPlanCurrentlyActive =
        planActivatedQuery === 'va_professional_business' || 
        pathname.startsWith('/va/business-tasks') ||
        isVaSubscribedToProPlan;
    
    if (planActivatedQuery === 'va_professional_business') {
        if (!isVaSubscribedToProPlan) setIsVaSubscribedToProPlan(true);
        if (typeof window !== 'undefined' && localStorage.getItem('stipsLiteVaProPlanActive') !== 'true') {
            localStorage.setItem('stipsLiteVaProPlanActive', 'true');
        }
    }

    setVaNavItems(prevItems => 
        prevItems.map(item => 
            item.label === "Business Service Tasks" ? { ...item, status: isVaProPlanCurrentlyActive ? "active" : "locked" } : item
        )
    );

  }, [pathname, searchParams, hasMounted, isSubscribedToStudentVaPlan, isVaSubscribedToProPlan]);


  const navItemsToRender = 
    role === "admin" ? adminNavItems : 
    role === "va" ? vaNavItems : 
    role === "print-center" ? printCenterNavItems :
    studentNavItems;
  
  const accountNavItems = role === "student" ? accountNavItemsStudent : [];
  const logoutHref = 
    role === "va" ? "/va/login" :
    role === "print-center" ? "/printcenter/login" :
    role === "admin" ? "/admin/login" : 
    "/auth/login";


  return (
    <SidebarMenu className="flex-1">
      {navItemsToRender.map((item) => {
        const isDynamicStatusItem = item.label === "VA Plus" || item.label === "Business Service Tasks";
        // @ts-ignore
        const isItemLocked = isDynamicStatusItem && item.status === "locked";
        // @ts-ignore
        const activeHref = item.activeHref;
        // @ts-ignore
        const currentHref = isDynamicStatusItem ? (isItemLocked ? item.href : activeHref) : item.href;


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
              {isDynamicStatusItem && isItemLocked && open && <Lock className="h-3.5 w-3.5 ml-1 text-muted-foreground shrink-0" />}
            </>
          );

          let tooltipText = item.label;
          if (isDynamicStatusItem) {
            tooltipText = isItemLocked
              ? `Subscribe to unlock ${item.label}`
              : (item.label === "VA Plus" ? "Find a Virtual Assistant" : item.label);
          }
          
          const finalHref = currentHref!;


          return (
            <SidebarMenuItem key={item.label}>
              <Link href={finalHref}>
                <SidebarMenuButton
                  isActive={pathname === finalHref && !(isDynamicStatusItem && isItemLocked)} 
                  className={cn(
                    "justify-start w-full",
                    isDynamicStatusItem && isItemLocked && "opacity-70 hover:bg-sidebar-accent/70"
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
         <Link href={logoutHref}>
            <SidebarMenuButton className="justify-start text-red-500 hover:bg-red-100 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300" tooltip="Logout">
                <LogOut className="h-5 w-5" />
                <span className={cn(open ? "opacity-100" : "opacity-0 delay-200", "transition-opacity duration-200")}>Logout</span>
            </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}


    