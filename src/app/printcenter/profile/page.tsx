
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Using Avatar for logo placeholder
import { UploadCloud, Save, Store, List, Clock, Banknote, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

// Mock data for initial form values (in a real app, this would come from backend)
const mockShopProfileData = {
  shopName: "Speedy Prints CBD",
  email: "contact@speedyprints.com",
  phone: "0712 345678",
  address: "Reli Co-op House, 2nd Flr, Kimathi Street, Nairobi, Kenya",
  description: "Your one-stop shop for all printing, copying, and binding needs in the heart of Nairobi. We offer fast turnarounds and high-quality prints.",
  logoUrl: "https://placehold.co/150x150.png?text=Shop+Logo", // Placeholder for logo
  bannerUrl: "https://placehold.co/800x200.png?text=Shop+Banner", // Placeholder for banner
  services: "Color Printing, Black & White Printing, Photocopying, Binding (Spiral, Comb, Perfect), Lamination, Scanning, Typesetting, Large Format Printing",
  operatingHours: "Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM\nSunday & Public Holidays: Closed",
  offlineBankName: "Equity Bank",
  offlineAccountNumber: "0123456789012",
  offlineAccountName: "Speedy Prints Limited",
  offlineMobileMoneyProvider: "M-Pesa PayBill",
  offlineMobileMoneyNumber: "123456",
  offlinePaymentInstructions: "Use your Order ID (to be provided by us) as the account number when paying via M-Pesa PayBill. For bank deposits, please use your name as reference."
};

export default function PrintCenterProfilePage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // UI-only: Simulate profile update
    toast({
      title: "Shop Profile Updated!",
      description: "Your shop details have been saved successfully.",
    });
  };
  
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Your Shop Profile"
        description="Keep your shop information, services, and payment details up to date."
        icon={Store}
      />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Basic Info & Logo/Banner */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">Shop Identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="shopLogo">Shop Logo</Label>
                  <Avatar className="h-24 w-24 rounded-md border-2 border-muted">
                    <AvatarImage src={mockShopProfileData.logoUrl} alt="Shop Logo" data-ai-hint="shop logo business"/>
                    <AvatarFallback>LOGO</AvatarFallback>
                  </Avatar>
                  <Input id="shopLogo" type="file" className="text-xs" />
                   <p className="text-xs text-muted-foreground">Recommended: Square image, PNG/JPG.</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="shopBanner">Shop Banner (Optional)</Label>
                   <div className="aspect-[4/1] w-full bg-muted rounded-md overflow-hidden border">
                     <Image src={mockShopProfileData.bannerUrl} alt="Shop Banner" width={800} height={200} className="object-cover w-full h-full" data-ai-hint="storefront banner business"/>
                   </div>
                  <Input id="shopBanner" type="file" className="text-xs" />
                  <p className="text-xs text-muted-foreground">Recommended: 1200x300px, PNG/JPG.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Details Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Shop Information</CardTitle>
                    <CardDescription>Basic details about your print center.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="shopName">Shop Name</Label>
                        <Input id="shopName" defaultValue={mockShopProfileData.shopName} required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="shopEmail">Shop Email (Cannot be changed)</Label>
                        <Input id="shopEmail" type="email" defaultValue={mockShopProfileData.email} readOnly disabled />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="shopPhone">Shop Phone Number</Label>
                        <Input id="shopPhone" type="tel" defaultValue={mockShopProfileData.phone} placeholder="e.g., 0712345678" required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="shopAddress">Full Shop Address</Label>
                        <Textarea id="shopAddress" defaultValue={mockShopProfileData.address} placeholder="Street, Building, Floor, City, County" rows={3} required />
                    </div>
                     <div className="space-y-1.5">
                        <Label htmlFor="shopDescription">Shop Description / About Us</Label>
                        <Textarea id="shopDescription" defaultValue={mockShopProfileData.description} placeholder="Tell students about your shop, unique selling points, etc." rows={4} />
                    </div>
                </CardContent>
            </Card>
            
            <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center"><List className="mr-2 h-5 w-5 text-primary"/>Services Offered</CardTitle>
                  <CardDescription>List the printing and related services you provide.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1.5">
                        <Label htmlFor="shopServices">Services (comma-separated)</Label>
                        <Textarea id="shopServices" defaultValue={mockShopProfileData.services} placeholder="e.g., Color Printing, Binding, Lamination, Passport Photos" rows={3} />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center"><Clock className="mr-2 h-5 w-5 text-primary"/>Operating Hours</CardTitle>
                  <CardDescription>Let customers know when you are open.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1.5">
                        <Label htmlFor="operatingHours">Operating Hours Description</Label>
                        <Textarea id="operatingHours" defaultValue={mockShopProfileData.operatingHours} placeholder="e.g., Mon-Fri: 8am-6pm, Sat: 9am-1pm, Sun: Closed" rows={4} />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline flex items-center"><Banknote className="mr-2 h-5 w-5 text-primary"/>Offline Payment Details</CardTitle>
                <CardDescription>Provide details for students who prefer to pay you directly (offline).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                    <Label htmlFor="offlineBankName">Bank Name</Label>
                    <Input id="offlineBankName" defaultValue={mockShopProfileData.offlineBankName} placeholder="e.g., Equity Bank" />
                    </div>
                    <div className="space-y-1.5">
                    <Label htmlFor="offlineAccountNumber">Bank Account Number</Label>
                    <Input id="offlineAccountNumber" defaultValue={mockShopProfileData.offlineAccountNumber} placeholder="e.g., 001234567890" />
                    </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="offlineAccountName">Bank Account Name</Label>
                  <Input id="offlineAccountName" defaultValue={mockShopProfileData.offlineAccountName} placeholder="e.g., Your Shop Name Ltd" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                    <Label htmlFor="offlineMobileMoneyProvider">Mobile Money Provider</Label>
                    <Input id="offlineMobileMoneyProvider" defaultValue={mockShopProfileData.offlineMobileMoneyProvider} placeholder="e.g., M-Pesa PayBill, Airtel Money Till" />
                    </div>
                    <div className="space-y-1.5">
                    <Label htmlFor="offlineMobileMoneyNumber">Mobile Money Number / Till</Label>
                    <Input id="offlineMobileMoneyNumber" defaultValue={mockShopProfileData.offlineMobileMoneyNumber} placeholder="e.g., 123456" />
                    </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="offlinePaymentInstructions">Payment Instructions for Offline</Label>
                  <Textarea id="offlinePaymentInstructions" defaultValue={mockShopProfileData.offlinePaymentInstructions} placeholder="e.g., Use Order ID as reference. Send M-Pesa confirmation..." rows={3} />
                </div>
                <div className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700">
                    <Info className="h-5 w-5 mr-2 mt-0.5 shrink-0" />
                    <p>Providing clear offline payment details helps students pay you correctly and can speed up order processing.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex justify-end mt-8">
            <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Save className="mr-2 h-4 w-4" /> Save Shop Profile
            </Button>
        </div>
      </form>
    </div>
  );
}
