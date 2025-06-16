
"use client";

import { useState } from "react"; 
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadCloud, Save, Store, List, Clock, Banknote, Info, Power } from "lucide-react"; // Added Power
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Switch } from "@/components/ui/switch"; 

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const mockShopProfileData = {
  shopName: "Speedy Prints CBD",
  email: "contact@speedyprints.com",
  phone: "0712 345678",
  address: "Reli Co-op House, 2nd Flr, Kimathi Street, Nairobi, Kenya",
  description: "Your one-stop shop for all printing, copying, and binding needs in the heart of Nairobi. We offer fast turnarounds and high-quality prints.",
  logoUrl: "https://placehold.co/150x150.png?text=Shop+Logo",
  bannerUrl: "https://placehold.co/800x200.png?text=Shop+Banner",
  services: "Color Printing, Black & White Printing, Photocopying, Binding (Spiral, Comb, Perfect), Lamination, Scanning, Typesetting, Large Format Printing",
  operatingHoursConfig: daysOfWeek.map(day => ({
    day,
    isOpen: !["Saturday", "Sunday"].includes(day), 
    from: "09:00",
    to: "17:00"
  })),
  specialClosuresNote: "Closed on all public holidays unless otherwise specified. Special hours for Christmas week will be announced.",
  isOfflinePaymentEnabled: true, // New flag
  offlineBankName: "Equity Bank",
  offlineAccountNumber: "0123456789012",
  offlineAccountName: "Speedy Prints Limited",
  offlineMobileMoneyProvider: "M-Pesa PayBill",
  offlineMobileMoneyNumber: "123456",
  offlinePaymentInstructions: "Use your Order ID (to be provided by us) as the account number when paying via M-Pesa PayBill. For bank deposits, please use your name as reference."
};

export default function PrintCenterProfilePage() {
  const { toast } = useToast();
  const [operatingHours, setOperatingHours] = useState(mockShopProfileData.operatingHoursConfig);
  const [isOfflinePaymentEnabled, setIsOfflinePaymentEnabled] = useState(mockShopProfileData.isOfflinePaymentEnabled);

  const handleOperatingHoursChange = (day: string, field: 'isOpen' | 'from' | 'to', value: string | boolean) => {
    setOperatingHours(currentHours =>
      currentHours.map(h =>
        h.day === day ? { ...h, [field]: value } : h
      )
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
                  <CardDescription>Set your weekly shop opening hours.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {operatingHours.map(hourConfig => (
                    <div key={hourConfig.day} className="grid grid-cols-1 sm:grid-cols-[100px_auto_1fr] items-center gap-3 p-3 border rounded-md">
                      <Label htmlFor={`open-${hourConfig.day}`} className="font-semibold col-span-1 sm:col-auto">{hourConfig.day}</Label>
                      <Switch
                        checked={hourConfig.isOpen}
                        onCheckedChange={(checked) => handleOperatingHoursChange(hourConfig.day, 'isOpen', checked)}
                        id={`open-${hourConfig.day}`}
                        aria-label={`Toggle ${hourConfig.day} open status`}
                      />
                      {hourConfig.isOpen ? (
                        <div className="flex items-center gap-2 flex-grow col-span-1 sm:col-auto">
                          <Input
                            type="time"
                            value={hourConfig.from}
                            onChange={(e) => handleOperatingHoursChange(hourConfig.day, 'from', e.target.value)}
                            className="w-full"
                            aria-label={`${hourConfig.day} open from`}
                          />
                          <span className="text-muted-foreground">-</span>
                          <Input
                            type="time"
                            value={hourConfig.to}
                            onChange={(e) => handleOperatingHoursChange(hourConfig.day, 'to', e.target.value)}
                            className="w-full"
                             aria-label={`${hourConfig.day} open until`}
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic col-span-1 sm:col-auto">Closed</span>
                      )}
                    </div>
                  ))}
                   <div className="space-y-1.5 pt-4 border-t mt-4">
                    <Label htmlFor="specialClosures">Special Closures / Holiday Notes</Label>
                    <Textarea 
                      id="specialClosures" 
                      defaultValue={mockShopProfileData.specialClosuresNote || ""} 
                      placeholder="e.g., Closed on Christmas Day (Dec 25th). Open half-day on New Year's Eve." 
                      rows={3} 
                    />
                  </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle className="font-headline flex items-center"><Banknote className="mr-2 h-5 w-5 text-primary"/>Offline Payment Details</CardTitle>
                    <CardDescription>Allow students to pay you directly.</CardDescription>
                </div>
                <Switch
                    id="toggleOfflinePayment"
                    checked={isOfflinePaymentEnabled}
                    onCheckedChange={setIsOfflinePaymentEnabled}
                    aria-label="Toggle offline payment details"
                />
              </CardHeader>
              {isOfflinePaymentEnabled && (
                <CardContent className="space-y-4 pt-4">
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
              )}
              {!isOfflinePaymentEnabled && (
                <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground italic flex items-center">
                        <Power className="h-4 w-4 mr-2 text-muted-foreground"/> Offline payment methods are currently disabled for your shop.
                    </p>
                </CardContent>
              )}
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

