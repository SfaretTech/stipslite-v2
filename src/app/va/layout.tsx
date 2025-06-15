
"use client"; // Required for usePathname

import { AppLayout } from "@/components/layout/AppLayout";
import { usePathname } from 'next/navigation';

export default function VirtualAssistantSectionLayout({ // Renamed for clarity
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Define which VA paths should NOT use the AppLayout (i.e., the auth pages)
  const isAuthPage = pathname === '/va/login' ||
                     pathname === '/va/register' ||
                     pathname === '/va/forgot-password';

  if (isAuthPage) {
    // For VA auth pages, render children directly.
    // These pages (e.g., /va/login/page.tsx) should use AuthLayout internally.
    return <>{children}</>;
  }

  // For all other VA pages (e.g., /va/dashboard, /va/tasks), use AppLayout
  return <AppLayout role="va" defaultOpen={true}>{children}</AppLayout>;
}
