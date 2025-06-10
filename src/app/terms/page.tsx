import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-100">
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-start mb-8">
        <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
        </Button>
      </div>
      <PageHeader 
        title="Terms of Service"
        description="Please read these terms carefully before using STIPS Lite."
        icon={FileText}
      />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">STIPS Lite Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using STIPS Lite (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.</p>

          <h2>2. Description of Service</h2>
          <p>STIPS Lite provides a platform for students to manage academic tasks, find print centers, and participate in a referral program. Features include e-task submission, a print center directory, user profile management, and support chat.</p>
          
          <h2>3. User Accounts</h2>
          <p>To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process. All new accounts require admin approval.</p>

          <h2>4. User Responsibilities</h2>
          <p>You are responsible for all activities that occur under your account. You agree not to use the Service for any illegal or unauthorized purpose.</p>

          <h2>5. E-Task Submission and Payment</h2>
          <p>When submitting tasks, you agree to provide accurate details. Payment for tasks is required upon approval by our administrators. All payments are processed through Flutterwave.</p>

          <h2>6. Print Center Directory</h2>
          <p>The print center directory is provided for informational purposes. STIPS Lite is not responsible for the services provided by third-party print centers listed.</p>

          <h2>7. Referral Program</h2>
          <p>Our referral program allows you to earn rewards under specific conditions outlined in the referral section of the platform. STIPS Lite reserves the right to modify or terminate the referral program at any time.</p>
          
          <h2>8. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of STIPS Lite and its licensors.</p>

          <h2>9. Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

          <h2>10. Limitation of Liability</h2>
          <p>In no event shall STIPS Lite, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages...</p>
          <p className="italic text-muted-foreground">[This is a placeholder Terms of Service. Consult with a legal professional to draft comprehensive terms for your application.]</p>

          <h2>11. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.</p>

          <h2>12. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at support@stipslite.com.</p>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
