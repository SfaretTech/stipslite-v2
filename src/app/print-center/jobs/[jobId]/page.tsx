
"use client";

import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PrinterIcon, DollarSign, MessageSquare, Download, FileText, CalendarDays, User, Edit, CheckCircle, Clock, AlertCircle, Send } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";


type PrintJobStatusPc = "Pending Confirmation" | "Quote Sent" | "Awaiting Payment" | "Payment Confirmed" | "Printing" | "Ready for Pickup" | "Completed" | "Cancelled";

const printJobStatusColors: Record<PrintJobStatusPc, string> = {
  "Pending Confirmation": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Quote Sent": "bg-blue-100 text-blue-700 border-blue-300",
  "Awaiting Payment": "bg-orange-100 text-orange-700 border-orange-300",
  "Payment Confirmed": "bg-teal-100 text-teal-700 border-teal-300",
  "Printing": "bg-indigo-100 text-indigo-700 border-indigo-300",
  "Ready for Pickup": "bg-purple-100 text-purple-700 border-purple-300",
  "Completed": "bg-green-100 text-green-700 border-green-300",
  "Cancelled": "bg-red-100 text-red-700 border-red-300",
};

const printJobStatusIcons: Record<PrintJobStatusPc, React.ElementType> = {
  "Pending Confirmation": AlertCircle,
  "Quote Sent": DollarSign,
  "Awaiting Payment": Clock,
  "Payment Confirmed": CheckCircle,
  "Printing": PrinterIcon,
  "Ready for Pickup": FileText,
  "Completed": CheckCircle,
  "Cancelled": AlertCircle,
};

const mockJobDetailsData = {
  JOB123: { 
    id: "JOB123", 
    studentName: "John Doe", 
    studentEmail: "john.doe@example.com",
    documentName: "Math_Assignment_Final_Version.pdf",
    pages: 10, 
    submittedDate: "2024-07-25 10:15 AM", 
    status: "Pending Confirmation" as PrintJobStatusPc, 
    printOptions: "Color, Double-sided, 80gsm Paper",
    studentNotes: "Please ensure the graphs on page 5 are very clear. Bind with a black spiral.",
    price: "", // To be set by Print Center
    paymentStatus: "Unpaid",
    paymentPreference: "Platform", // 'Platform' or 'Offline'
    attachments: [{ name: "Math_Assignment_Final_Version.pdf", url: "#download-link" }]
  },
  JOB124: { 
    id: "JOB124", 
    studentName: "Alice Smith", 
    studentEmail: "alice.smith@example.com",
    documentName: "ENG_Thesis_Ch1_Revised.docx",
    pages: 25, 
    submittedDate: "2024-07-24 14:30 PM", 
    status: "Printing" as PrintJobStatusPc, 
    printOptions: "Black & White, Single-sided, 70gsm Paper",
    studentNotes: "Can I pick this up by 5 PM tomorrow?",
    price: "₦120.00",
    paymentStatus: "Paid (Platform)",
    paymentPreference: "Platform",
    attachments: [{ name: "ENG_Thesis_Ch1_Revised.docx", url: "#download-link" }]
  },
  // Add more mock jobs as needed
};

const availableStatuses: PrintJobStatusPc[] = [
    "Pending Confirmation", "Quote Sent", "Awaiting Payment", "Payment Confirmed", 
    "Printing", "Ready for Pickup", "Completed", "Cancelled"
];


export default function PrintJobDetailPage() {
  const paramsFromHook = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const params = { jobId: paramsFromHook.jobId as string };
  const jobId = params.jobId;

  // @ts-ignore
  const initialJob = mockJobDetailsData[jobId];
  const [job, setJob] = useState(initialJob);
  const [priceInput, setPriceInput] = useState(initialJob?.price?.replace('₦', '') || "");
  const [isSetPriceDialogOpen, setIsSetPriceDialogOpen] = useState(false);

  if (!job) {
    return (
      <div>
        <PageHeader title="Print Job Not Found" description="The requested print job could not be found." />
        <Card>
          <CardContent className="pt-6">
            <p>Sorry, we couldn't find details for print job ID: {jobId}.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/print-center/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Jobs
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = printJobStatusIcons[job.status];

  const handleUpdateStatus = (newStatus: PrintJobStatusPc) => {
    setJob(prev => prev ? {...prev, status: newStatus} : null);
    toast({
        title: "Job Status Updated",
        description: `Job ${job.id} status changed to "${newStatus}". Student will be notified.`,
    });
  };

  const handleSetPrice = () => {
    if (!priceInput.trim()) {
        toast({ title: "Price Required", description: "Please enter a price.", variant: "destructive"});
        return;
    }
    const numericPrice = parseFloat(priceInput);
    if (isNaN(numericPrice) || numericPrice < 0) {
        toast({ title: "Invalid Price", description: "Please enter a valid positive price.", variant: "destructive"});
        return;
    }
    setJob(prev => prev ? {...prev, price: `₦${numericPrice.toFixed(2)}`, status: prev.status === "Pending Confirmation" ? "Quote Sent" : prev.status} : null);
    toast({
        title: "Price Set/Updated",
        description: `Price for job ${job.id} set to ₦${numericPrice.toFixed(2)}. Status updated to "Quote Sent" if applicable.`,
    });
    setIsSetPriceDialogOpen(false);
  };

  const handleContactStudent = () => {
     if (typeof window !== 'undefined') {
        localStorage.setItem('stipsLiteContactStudentJobId', job.id); 
        localStorage.setItem('stipsLiteContactStudentNameForJob', job.studentName);
    }
    router.push('/print-center/support'); 
  };


  return (
    <div className="space-y-8">
      <PageHeader 
        title={`Print Job: ${job.id}`}
        description={`Details for job submitted by ${job.studentName}`}
        icon={FileText}
        actions={
            <Button asChild variant="outline">
              <Link href="/print-center/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Jobs
              </Link>
            </Button>
        }
      />

      <Dialog open={isSetPriceDialogOpen} onOpenChange={setIsSetPriceDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Set/Update Price for Job: {job.id}</DialogTitle>
                <DialogDescription>
                    Enter the total price for this print job. This will be sent as a quote to the student if the job is in 'Pending Confirmation'.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-1.5">
                    <Label htmlFor="jobPrice">Price (NGN)</Label>
                    <div className="relative">
                        <span className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground font-semibold">₦</span>
                        <Input 
                            id="jobPrice" 
                            type="number" 
                            value={priceInput}
                            onChange={(e) => setPriceInput(e.target.value)}
                            placeholder="e.g., 50.00" 
                            className="pl-8"
                        />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={handleSetPrice}>Set Price & Send Quote</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Document: {job.documentName}</CardTitle>
              <div className="text-sm text-muted-foreground">
                Submitted by: <span className="font-medium text-primary">{job.studentName}</span> ({job.studentEmail})
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold text-primary/90 mb-1">Print Options & Details:</h4>
                    <p><span className="font-medium">Pages:</span> {job.pages}</p>
                    <p><span className="font-medium">Options:</span> {job.printOptions || "Standard"}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-primary/90 mb-1">Student Notes:</h4>
                    <p className="text-foreground/80 whitespace-pre-wrap p-3 bg-muted/30 rounded-md">
                        {job.studentNotes || "No specific notes provided."}
                    </p>
                </div>
                {job.attachments && job.attachments.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-primary/90 mb-1">Attachments:</h4>
                        <ul className="space-y-1">
                        {job.attachments.map((att, index) => (
                            <li key={index}>
                                <Button variant="link" asChild className="p-0 h-auto">
                                    <a href={att.url} download className="text-accent">
                                        <Download className="mr-1.5 h-4 w-4" />{att.name}
                                    </a>
                                </Button>
                            </li>
                        ))}
                        </ul>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Job Status & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <StatusIcon className={`h-5 w-5 mr-2 ${printJobStatusColors[job.status].split(' ')[1]}`} />
                <Badge variant="outline" className={`text-sm ${printJobStatusColors[job.status]}`}>{job.status}</Badge>
              </div>
              <p className="text-sm"><span className="font-medium text-muted-foreground">Submitted:</span> {job.submittedDate}</p>
              
              <div className="border-t pt-3">
                <p className="text-sm"><span className="font-medium text-muted-foreground">Price:</span> 
                    <span className="font-semibold text-primary ml-1">{job.price || (job.status === "Pending Confirmation" ? "Not Set" : "N/A")}</span>
                </p>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-1" 
                    onClick={() => setIsSetPriceDialogOpen(true)}
                >
                    <DollarSign className="mr-2 h-4 w-4"/> {job.price ? "Update Price" : "Set Price / Quote"}
                </Button>
              </div>
              <p className="text-sm"><span className="font-medium text-muted-foreground">Payment Status:</span> {job.paymentStatus}</p>
              <p className="text-sm"><span className="font-medium text-muted-foreground">Student Payment Preference:</span> {job.paymentPreference}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Manage Job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-1.5">
                    <Label htmlFor="updateStatus">Update Job Status</Label>
                    <Select onValueChange={(value) => handleUpdateStatus(value as PrintJobStatusPc)} defaultValue={job.status}>
                        <SelectTrigger id="updateStatus">
                            <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                        {availableStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleContactStudent} variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" /> Contact Student
                </Button>
                <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700" onClick={() => handleUpdateStatus("Cancelled")}>
                    Cancel Job
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
