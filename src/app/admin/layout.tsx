
"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/admin/login';

    if (isAuthPage) {
        // For admin auth page, render children directly.
        // This page (e.g., /admin/login/page.tsx) should use AuthLayout internally.
        return <>{children}</>;
    }

    // For all other admin pages (e.g., /admin/dashboard), use AppLayout
    return <AppLayout role="admin" defaultOpen={true}>{children}</AppLayout>;
}

function AdminLayoutSkeleton() {
    return (
        <div className="flex h-screen bg-background text-foreground">
            <div className="hidden md:flex flex-col w-64 border-r bg-card">
                <div className="p-4 border-b">
                    <Skeleton className="h-8 w-3/4" />
                </div>
                <div className="flex-1 p-2 space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <header className="flex h-16 items-center border-b px-6 justify-end">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                </header>
                <main className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <Skeleton className="h-8 w-8" />
                        <div>
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-80 mt-1" />
                        </div>
                    </div>
                    <Skeleton className="h-[500px] w-full" />
                </main>
            </div>
        </div>
    );
}

export default function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AdminLayoutSkeleton />}>
        <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
