
"use client";

import { useState } from "react";
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
import { UploadCloud, Send, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PrintCenter } from "./PrintCenterList"; // Import the type

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  const handleSubmitJob = (event: React.FormEvent) => {
    event.preventDefault();
    if (!printCenter || !fileName || !numPages.trim()) {
      toast({
        title: "Missing Information",
        description: "Please upload a document and specify the number of pages.",
        variant: "destructive",
      });
      return;
    }

    // Simulate job submission
    console.log({
      printCenterId: printCenter.id,
      printCenterName: printCenter.name,
      document: fileName,
      pages: numPages,
      notes,
      paymentPreference,
    });

    toast({
      title: "Print Job Submitted (Simulated)",
      description: `Your print job for "${fileName}" has been sent to ${printCenter.name}. They will provide a quote or confirm details shortly. Payment preference: ${paymentPreference === "platform" ? "Online via Platform" : "Offline to Shop"}.`,
      duration: 7000,
    });
    onClose(); // Close the dialog
    // Reset form fields for next time
    setNumPages("");
    setNotes("");
    setPaymentPreference("platform");
    setFileName(null);
    // Reset the file input visually if possible (tricky with controlled file inputs)
    const fileInput = document.getElementById('print-doc-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  if (!printCenter) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmitJob}>
          <DialogHeader>
            <DialogTitle>Submit Print Job to: {printCenter.name}</DialogTitle>
            <DialogDescription>
              Upload your document and provide details for your print request.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
                      <Input id="print-doc-upload" type="file" className="hidden" onChange={handleFileChange} required />
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
                    className="flex gap-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="platform" id="pay-platform" />
                        <Label htmlFor="pay-platform" className="font-normal">Pay via Platform (Online)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="offline" id="pay-offline" />
                        <Label htmlFor="pay-offline" className="font-normal">Pay directly to Shop (Offline)</Label>
                    </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                    The shop will provide payment details or a quote based on your selection.
                </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Send className="mr-2 h-4 w-4" /> Submit Print Job
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
