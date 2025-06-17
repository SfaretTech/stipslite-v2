
"use client"; // Required for usePathname

import { AppLayout } from "@/components/layout/AppLayout";
import { usePathname } from 'next/navigation';

export default function AdminSectionLayout({ // Renamed for clarity
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define which admin paths should NOT use the AppLayout (i.e., the auth page)
  const isAuthPage = pathname === '/admin/login';

  if (isAuthPage) {
    // For admin auth page, render children directly.
    // This page (e.g., /admin/login/page.tsx) should use AuthLayout internally.
    return <>{children}</>;
  }

  // For all other admin pages (e.g., /admin/dashboard), use AppLayout
  return <AppLayout role="admin" defaultOpen={true}>{children}</AppLayout>;
}
