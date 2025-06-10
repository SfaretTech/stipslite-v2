import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

type AppLayoutProps = {
  children: React.ReactNode;
  defaultOpen?: boolean;
  role?: "student" | "admin";
};

export function AppLayout({ children, defaultOpen = true, role = "student" }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4 border-b">
          <Link href={role === "admin" ? "/admin/dashboard" : "/dashboard"} className="text-2xl font-bold text-primary font-headline">
            STIPS Lite {role === "admin" && <span className="text-sm text-muted-foreground font-normal">Admin</span>}
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <SidebarNav role={role} />
        </SidebarContent>
        <SidebarFooter className="p-2 border-t">
           {/* Placeholder for footer content or actions */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-6 bg-background overflow-auto">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
