
"use client"; // Add "use client" for hooks

import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuth();

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

  // The AuthProvider now handles the user state, so we can directly render the layout.
  // The UI will update once the simulated auth check completes.
  return <AppLayout role="student">{children}</AppLayout>;
}
