// This layout applies to all auth routes
// For this UI-only implementation, we won't use a specific layout component here,
// as each auth page will directly use a common structure or AuthLayout component.
// If we were to use a route group specific layout, it would be:
// import { AuthLayout } from "@/components/layout/AuthLayout";
// export default AuthLayout;
// However, to comply with "simple routing", individual pages will structure themselves.

export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
