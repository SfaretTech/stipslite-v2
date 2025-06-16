
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Clock, Star, ExternalLink, PrinterIcon } from "lucide-react";
import Image from "next/image";
import { PrintJobDialog } from "./PrintJobDialog"; 

export interface PrintCenter {
  id: string;
  name: string;
  county: string;
  state: string;
  location: string;
  address: string;
  phone?: string;
  hours?: string;
  rating?: number;
  services: string[];
  imageUrl?: string;
  isOfflinePaymentEnabled: boolean; // Added this flag
  offlinePaymentDetails?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    mobileMoneyProvider?: string;
    mobileMoneyNumber?: string;
    instructions?: string;
  };
}

const mockPrintCenters: PrintCenter[] = [
  { 
    id: "PC001", 
    name: "Speedy Prints CBD", 
    county: "Nairobi", 
    state: "CBD", 
    location: "Kimathi Street", 
    address: "Reli Co-op House, 2nd Flr", 
    phone: "0712 345678", 
    hours: "Mon-Sat: 8am-6pm", 
    rating: 4.5, 
    services: ["Color Printing", "Binding", "Lamination", "Scanning"], 
    imageUrl: "https://placehold.co/600x400.png?text=Speedy+Prints",
    isOfflinePaymentEnabled: true,
    offlinePaymentDetails: {
      bankName: "Equity Bank",
      accountNumber: "0123456789012",
      accountName: "Speedy Prints Limited",
      mobileMoneyProvider: "M-Pesa PayBill",
      mobileMoneyNumber: "123456",
      instructions: "Use your Order ID (to be provided by shop) as the account number or reference."
    }
  },
  { 
    id: "PC002", 
    name: "Westlands Quick Copy", 
    county: "Nairobi", 
    state: "Westlands", 
    location: "The Mall", 
    address: "The Mall, Ground Flr, Shop G12", 
    phone: "0722 987654", 
    hours: "Mon-Sun: 9am-7pm", 
    rating: 4.2, 
    services: ["Photocopy", "Large Format", "Typesetting"], 
    imageUrl: "https://placehold.co/600x400.png?text=Quick+Copy",
    isOfflinePaymentEnabled: false, // This shop does not accept offline
     offlinePaymentDetails: { // Keep details for potential re-enablement
      bankName: "KCB Bank",
      accountNumber: "9876543210987",
      accountName: "Westlands Quick Copy Ltd",
    }
  },
  { 
    id: "PC003", 
    name: "Nyali Print Hub", 
    county: "Mombasa", 
    state: "Nyali", 
    location: "City Mall", 
    address: "City Mall, 1st Flr", 
    hours: "Mon-Sat: 9am-5pm", 
    rating: 4.0, 
    services: ["Color Printing", "Binding"], 
    imageUrl: "https://placehold.co/600x400.png?text=Nyali+Hub",
    isOfflinePaymentEnabled: true,
    offlinePaymentDetails: {
      mobileMoneyProvider: "Airtel Money",
      mobileMoneyNumber: "0733112233",
      instructions: "Please include your name in the payment reference."
    }
  },
];

export function PrintCenterList({ filters }: { filters: any }) {
  const [selectedPrintCenter, setSelectedPrintCenter] = useState<PrintCenter | null>(null);
  const [isPrintDialogVisible, setIsPrintDialogVisible] = useState(false);

  // In a real app, filter mockPrintCenters based on `filters` prop
  const filteredCenters = mockPrintCenters; // Placeholder

  const handleOpenPrintDialog = (center: PrintCenter) => {
    setSelectedPrintCenter(center);
    setIsPrintDialogVisible(true);
  };

  const handleClosePrintDialog = () => {
    setSelectedPrintCenter(null);
    setIsPrintDialogVisible(false);
  };

  if (filteredCenters.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No Print Centers Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCenters.map(center => (
          <Card key={center.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            {center.imageUrl && (
              <div className="relative h-48 w-full">
                <Image 
                  src={center.imageUrl} 
                  alt={center.name} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint="print shop storefront"
                />
              </div>
            )}
            <CardHeader className="pb-3">
              <CardTitle className="font-headline text-xl">{center.name}</CardTitle>
              <CardDescription className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1.5 text-muted-foreground" /> {center.location}, {center.state}, {center.county}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm flex-grow">
              <p className="text-muted-foreground">{center.address}</p>
              {center.phone && (
                <p className="flex items-center"><Phone className="h-4 w-4 mr-2 text-primary/70" /> {center.phone}</p>
              )}
              {center.hours && (
                <p className="flex items-center"><Clock className="h-4 w-4 mr-2 text-primary/70" /> {center.hours}</p>
              )}
              {center.rating && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-400" /> 
                  <span>{center.rating.toFixed(1)} / 5.0</span>
                </div>
              )}
              <div className="pt-2">
                <h4 className="font-medium mb-1">Services:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {center.services.map(service => (
                    <Badge key={service} variant="secondary" className="text-xs">{service}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="w-full sm:flex-1" asChild>
                <a href={`https://maps.google.com/?q=${center.address}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> View on Map
                </a>
              </Button>
              <Button 
                size="sm" 
                className="w-full sm:flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => handleOpenPrintDialog(center)}
              >
                <PrinterIcon className="mr-2 h-4 w-4" /> Print with Shop
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {selectedPrintCenter && (
        <PrintJobDialog 
          isOpen={isPrintDialogVisible}
          onClose={handleClosePrintDialog}
          printCenter={selectedPrintCenter}
        />
      )}
    </>
  );
}
