import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Printer, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold font-headline">STIPS Lite</Link>
          <nav className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/auth/register">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 text-center bg-gradient-to-b from-background to-blue-50">
          <div className="container mx-auto">
            <h1 className="text-5xl font-bold font-headline mb-6 text-primary">Welcome to STIPS Lite</h1>
            <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
              Your all-in-one platform for managing academic tasks, finding print centers, and earning rewards.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/auth/register">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <div className="mt-16">
              <Image 
                src="https://placehold.co/800x400.png" 
                alt="STIPS Lite Platform Showcase" 
                width={800} 
                height={400} 
                className="rounded-lg shadow-xl mx-auto"
                data-ai-hint="education platform interface"
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold font-headline text-center mb-12 text-primary/90">Core Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Briefcase className="h-10 w-10 text-accent mb-3" />
                  <CardTitle className="font-headline">E-Task Submission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Easily submit your academic tasks with all necessary details and track their approval.</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Printer className="h-10 w-10 text-accent mb-3" />
                  <CardTitle className="font-headline">Print Center Directory</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Find the nearest print centers quickly with our comprehensive and searchable directory.</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Users className="h-10 w-10 text-accent mb-3" />
                  <CardTitle className="font-headline">Referral System</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Refer friends and earn rewards. Track your earnings and manage withdrawals easily.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary/10 text-primary/80 py-8 text-center">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} STIPS Lite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
