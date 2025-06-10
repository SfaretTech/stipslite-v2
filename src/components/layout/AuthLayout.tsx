import Link from "next/link";
import Image from "next/image";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
};

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-blue-100 p-4">
       <Link href="/" className="mb-8 text-4xl font-bold text-primary font-headline">
        STIPS Lite
      </Link>
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary font-headline">{title}</h1>
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>
        {children}
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Need help? <Link href="/dashboard/support" className="underline hover:text-primary">Contact Support</Link>
      </p>
    </div>
  );
}
