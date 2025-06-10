import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function PrivacyPolicyPage() {
  return (
     <div className="min-h-screen bg-gradient-to-br from-background to-blue-100">
    <div className="container mx-auto py-12 px-4">
        <div className="flex justify-start mb-8">
            <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
      <PageHeader 
        title="Privacy Policy"
        description="Your privacy is important to us. This policy explains how we collect, use, and protect your information."
        icon={Shield}
      />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">STIPS Lite Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Introduction</h2>
          <p>STIPS Lite ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application and services (collectively, the "Service").</p>

          <h2>2. Information We Collect</h2>
          <p>We may collect personal information that you provide directly to us, such as:</p>
          <ul>
            <li>Account Information: Name, email address, password, and profile details (including optional passport information).</li>
            <li>Task Information: Details related to tasks you submit, including type, title, pages, duration, and attachments.</li>
            <li>Payment Information: While we use Flutterwave for payment processing, we may store transaction IDs or summaries. We do not store full credit card details.</li>
            <li>Referral Information: Details about users you refer and your mobile wallet information for withdrawals.</li>
            <li>Communication: Messages sent through our support chat or other communication channels.</li>
            <li>Usage Data: Information about how you use the Service, such as IP address, browser type, and pages visited (collected automatically).</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and maintain our Service.</li>
            <li>Process your task submissions and facilitate payments.</li>
            <li>Manage your account and subscriptions.</li>
            <li>Administer the referral program.</li>
            <li>Communicate with you, including responding to support requests.</li>
            <li>Improve and personalize the Service.</li>
            <li>Comply with legal obligations.</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <p>We may share your information in the following situations:</p>
          <ul>
            <li>With Service Providers: We may share information with third-party vendors who perform services on our behalf (e.g., payment processing with Flutterwave, hosting).</li>
            <li>For Legal Reasons: If required by law or in response to valid requests by public authorities.</li>
            <li>With Your Consent: We may disclose your personal information for any other purpose with your consent.</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
          
          <h2>5. Data Security</h2>
          <p>We implement reasonable security measures to protect your personal information. However, no electronic transmission or storage is 100% secure.</p>

          <h2>6. Your Data Rights</h2>
          <p>Depending on your jurisdiction, you may have rights regarding your personal data, such as the right to access, correct, or delete your information. Please contact us to exercise these rights.</p>

          <h2>7. Cookies and Tracking Technologies</h2>
          <p>We may use cookies and similar tracking technologies to track activity on our Service and hold certain information.</p>
          
          <h2>8. Children's Privacy</h2>
          <p>Our Service is not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13.</p>

          <p className="italic text-muted-foreground">[This is a placeholder Privacy Policy. Consult with a legal professional to draft a comprehensive policy tailored to your specific data practices and legal requirements.]</p>

          <h2>9. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@stipslite.com.</p>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
