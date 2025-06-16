
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UploadCloud, Send, FileText, Info, CheckCircle, Banknote, Smartphone, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PrintCenter } from "./PrintCenterList"; 
import { Card, CardContent } from "@/components/ui/card";

interface PrintJobDialogProps {
  isOpen: boolean;
  onClose: () => void;
  printCenter: PrintCenter | null;
}

export function PrintJobDialog({ isOpen, onClose, printCenter }: PrintJobDialogProps) {
  const { toast } = useToast();
  const [numPages, setNumPages] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentPreference, setPaymentPreference] = useState("platform");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileObject, setFileObject] = useState<File | null>(null); 

  const [showOfflinePaymentDetails, setShowOfflinePaymentDetails] = useState(false);
  const [offlinePaymentConfirmed, setOfflinePaymentConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen && printCenter && !printCenter.isOfflinePaymentEnabled && paymentPreference === "offline") {
      setPaymentPreference("platform"); // Reset to platform if offline is not enabled for the current shop
    }
    if (!isOpen) {
      setNumPages("");
      setNotes("");
      setPaymentPreference("platform");
      setFileName(null);
      setFileObject(null);
      setShowOfflinePaymentDetails(false);
      setOfflinePaymentConfirmed(false);
      const fileInput = document.getElementById('print-doc-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  }, [isOpen, printCenter, paymentPreference]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
      setFileObject(event.target.files[0]);
    } else {
      setFileName(null);
      setFileObject(null);
    }
  };

  const handleSubmitJob = (event: React.FormEvent) => {
    event.preventDefault();
    if (!printCenter || !fileObject || !numPages.trim()) {
      toast({
        title: "Missing Information",
        description: "Please upload a document and specify the number of pages.",
        variant: "destructive",
      });
      return;
    }

    if (paymentPreference === "platform") {
      toast({
        title: "Print Job Submitted (Simulated)",
        description: `Your print job for "${fileName}" has been sent to ${printCenter.name}. They will provide a quote or confirm details shortly. Payment preference: Online via Platform.`,
        duration: 7000,
      });
      onClose(); 
    } else { // Offline payment
      if (!printCenter.isOfflinePaymentEnabled || !printCenter.offlinePaymentDetails) {
         toast({
            title: "Offline Payment Not Available",
            description: `${printCenter.name} has not enabled offline payments or details are missing. Please choose 'Pay via Platform' or contact the shop directly.`,
            variant: "destructive",
            duration: 7000,
        });
        setPaymentPreference("platform"); // Revert to platform payment
        return;
      }
      setShowOfflinePaymentDetails(true);
    }
  };

  const handleConfirmOfflinePayment = () => {
    if (!printCenter || !fileName) return;
    setOfflinePaymentConfirmed(true);
    toast({
      title: "Payment Confirmation Sent",
      description: `Your confirmation for offline payment to ${printCenter.name} for printing "${fileName}" has been sent. The shop will verify and process your job.`,
      duration: 7000,
    });
  };

  if (!printCenter) return null;
  
  const renderInitialForm = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="print-doc-upload">Upload Document</Label>
        <div className="flex items-center justify-center w-full">
            <Label 
              htmlFor="print-doc-upload" 
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {fileName ? (
                      <>
                        <FileText className="w-8 h-8 mb-2 text-primary" />
                        <p className="text-sm text-primary font-semibold">{fileName}</p>
                        <p className="text-xs text-muted-foreground">Click to change file</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-1 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PDF, DOCX, PPTX (MAX. 10MB)</p>
                      </>
                    )}
                </div>
                <Input id="print-doc-upload" type="file" className="hidden" onChange={handleFileChange} required={!fileObject} />
            </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numPages">Number of Pages</Label>
        <Input 
          id="numPages" 
          type="number" 
          placeholder="e.g., 10" 
          value={numPages}
          onChange={(e) => setNumPages(e.target.value)}
          min="1"
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="printNotes">Notes for Print Shop (Optional)</Label>
        <Textarea 
          id="printNotes" 
          placeholder="e.g., Print in color, double-sided, specific paper type..." 
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="space-y-2">
          <Label>Payment Preference</Label>
          <RadioGroup 
              defaultValue="platform" 
              value={paymentPreference} 
              onValueChange={setPaymentPreference} 
              className="flex flex-col sm:flex-row gap-2 sm:gap-4"
          >
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value="platform" id="pay-platform" />
                  <Label htmlFor="pay-platform" className="font-normal">Pay via Platform (Online)</Label>
              </div>
              <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="offline" 
                    id="pay-offline" 
                    disabled={!printCenter.isOfflinePaymentEnabled}
                  />
                  <Label 
                    htmlFor="pay-offline" 
                    className={printCenter.isOfflinePaymentEnabled ? "font-normal" : "font-normal text-muted-foreground line-through"}
                  >
                    Pay directly to Shop (Offline)
                  </Label>
              </div>
          </RadioGroup>
           {!printCenter.isOfflinePaymentEnabled && (
            <p className="text-xs text-yellow-600 flex items-center mt-1">
                <AlertTriangle className="h-3.5 w-3.5 mr-1 shrink-0" /> This shop does not accept direct offline payments.
            </p>
           )}
          <p className="text-xs text-muted-foreground mt-1">
              The shop will provide payment details or a quote based on your selection.
          </p>
      </div>
    </>
  );

  const renderOfflinePaymentDetails = () => (
    <Card className="bg-muted/30 p-4">
        <CardContent className="space-y-3 text-sm">
            <p className="font-semibold text-primary">Pay to {printCenter.name} using these details:</p>
            {printCenter.offlinePaymentDetails?.bankName && (
                <div>
                    <p className="flex items-center"><Banknote className="h-4 w-4 mr-2 text-muted-foreground"/><strong>Bank:</strong> {printCenter.offlinePaymentDetails.bankName}</p>
                    <p><strong>Account Number:</strong> {printCenter.offlinePaymentDetails.accountNumber}</p>
                    <p><strong>Account Name:</strong> {printCenter.offlinePaymentDetails.accountName}</p>
                </div>
            )}
            {printCenter.offlinePaymentDetails?.mobileMoneyProvider && (
                 <div className="mt-2 pt-2 border-t">
                    <p className="flex items-center"><Smartphone className="h-4 w-4 mr-2 text-muted-foreground"/><strong>{printCenter.offlinePaymentDetails.mobileMoneyProvider}:</strong> {printCenter.offlinePaymentDetails.mobileMoneyNumber}</p>
                </div>
            )}
            {printCenter.offlinePaymentDetails?.instructions && (
                <p className="text-xs italic mt-2"><Info className="h-3 w-3 mr-1 inline-block"/>{printCenter.offlinePaymentDetails.instructions}</p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
                After sending payment, click "I've Sent Payment & Confirm" below.
            </p>
        </CardContent>
    </Card>
  );

  const renderOfflinePaymentConfirmed = () => (
    <div className="text-center py-6 space-y-3">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <p className="font-semibold text-lg">Payment Confirmation Sent!</p>
        <p className="text-muted-foreground text-sm">
            Your confirmation for printing "{fileName}" has been sent to {printCenter.name}. <br/>
            They will verify your payment and process your print job. You will be notified of any updates.
        </p>
    </div>
  );


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={!showOfflinePaymentDetails ? handleSubmitJob : (e) => { e.preventDefault(); handleConfirmOfflinePayment(); }}>
          <DialogHeader>
            <DialogTitle>
              {showOfflinePaymentDetails && !offlinePaymentConfirmed ? `Complete Offline Payment for ${printCenter.name}` 
               : showOfflinePaymentDetails && offlinePaymentConfirmed ? `Confirmation Sent to ${printCenter.name}`
               : `Submit Print Job to: ${printCenter.name}`
              }
            </DialogTitle>
            <DialogDescription>
              {!showOfflinePaymentDetails 
                ? "Upload your document and provide details for your print request."
                : !offlinePaymentConfirmed 
                ? `Please make your payment to ${printCenter.name} using the details below and then confirm.`
                : "Thank you! The shop will be in touch."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {!showOfflinePaymentDetails 
              ? renderInitialForm()
              : !offlinePaymentConfirmed 
              ? renderOfflinePaymentDetails()
              : renderOfflinePaymentConfirmed()
            }
          </div>

          <DialogFooter>
            {showOfflinePaymentDetails && offlinePaymentConfirmed ? (
                <DialogClose asChild>
                    <Button type="button" className="w-full">Close</Button>
                </DialogClose>
            ) : showOfflinePaymentDetails && !offlinePaymentConfirmed ? (
                <>
                    <Button type="button" variant="outline" onClick={() => {setShowOfflinePaymentDetails(false); }}>Back to Edit Job</Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="mr-2 h-4 w-4"/> I've Sent Payment & Confirm
                    </Button>
                </>
            ) : (
                 <>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Send className="mr-2 h-4 w-4" /> Submit Print Job
                    </Button>
                </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
