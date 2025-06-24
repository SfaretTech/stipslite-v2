
"use client"; // Add "use client" for hooks

import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Note: Re-implement your auth protection logic here.
    // Example:
    // if (!loading && !user) {
    //   router.replace("/auth/login");
    // }
  }, [user, loading, router]);

  if (loading) {
    // You can show a more sophisticated loading skeleton here
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Render children regardless of auth state for now, to allow re-implementation.
  return <AppLayout role="student">{children}</AppLayout>;
}
