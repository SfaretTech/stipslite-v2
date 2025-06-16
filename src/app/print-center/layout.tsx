
"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { usePathname } from 'next/navigation';

export default function PrintCenterSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname === '/print-center/login' ||
                     pathname === '/print-center/register' ||
                     pathname === '/print-center/forgot-password';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AppLayout role="print-center" defaultOpen={true}>{children}</AppLayout>;
}
