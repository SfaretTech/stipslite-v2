
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, MoreHorizontal, CheckCircle, Clock, AlertCircle, PrinterIcon, DollarSign, Eye } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PrintJobStatus = "Pending Confirmation" | "Quote Sent" | "Awaiting Payment" | "Payment Confirmed" | "Printing" | "Ready for Pickup" | "Completed" | "Cancelled";

interface PrintJob {
  id: string;
  studentName: string;
  documentName: string;
  pages: number;
  submittedDate: string;
  status: PrintJobStatus;
  price?: string;
}

const mockPrintJobs: PrintJob[] = [
  { id: "JOB123", studentName: "John Doe", documentName: "Math_Assignment.pdf", pages: 10, submittedDate: "2024-07-25", status: "Pending Confirmation" },
  { id: "JOB124", studentName: "Alice Smith", documentName: "ENG_Thesis_Ch1.docx", pages: 25, submittedDate: "2024-07-24", status: "Printing", price: "₦120.00" },
  { id: "JOB120", studentName: "Bob K.", documentName: "Presentation_Slides.pptx", pages: 30, submittedDate: "2024-07-23", status: "Ready for Pickup", price: "₦150.00" },
  { id: "JOB119", studentName: "Eve L.", documentName: "Lab_Report_Final.pdf", pages: 8, submittedDate: "2024-07-22", status: "Completed", price: "₦40.00" },
  { id: "JOB118", studentName: "Mike P.", documentName: "Urgent_Request.pdf", pages: 5, submittedDate: "2024-07-25", status: "Awaiting Payment", price: "₦25.00" },
];

const statusColors: Record<PrintJobStatus, string> = {
  "Pending Confirmation": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Quote Sent": "bg-blue-100 text-blue-700 border-blue-300",
  "Awaiting Payment": "bg-orange-100 text-orange-700 border-orange-300",
  "Payment Confirmed": "bg-teal-100 text-teal-700 border-teal-300",
  "Printing": "bg-indigo-100 text-indigo-700 border-indigo-300",
  "Ready for Pickup": "bg-purple-100 text-purple-700 border-purple-300",
  "Completed": "bg-green-100 text-green-700 border-green-300",
  "Cancelled": "bg-red-100 text-red-700 border-red-300",
};

const statusIcons: Record<PrintJobStatus, React.ElementType> = {
  "Pending Confirmation": AlertCircle,
  "Quote Sent": DollarSign,
  "Awaiting Payment": Clock,
  "Payment Confirmed": CheckCircle,
  "Printing": PrinterIcon,
  "Ready for Pickup": FileText,
  "Completed": CheckCircle,
  "Cancelled": AlertCircle,
};


export default function PrintCenterJobsPage() {
  const [jobs, setJobs] = useState<PrintJob[]>(mockPrintJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PrintJobStatus | "all">("all");

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
        job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.documentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Print Jobs"
        description="View and manage all incoming and ongoing print jobs for your shop."
        icon={FileText}
      />
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="font-headline">All Print Jobs ({filteredJobs.length})</CardTitle>
              <CardDescription>Filter and manage print requests.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Input 
                    placeholder="Search by ID, Student, Document..." 
                    className="w-full md:w-64" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PrintJobStatus | "all")}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {Object.keys(statusColors).map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-3" />
              <p>No print jobs match your current filters or no jobs received yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => {
                  const StatusIcon = statusIcons[job.status];
                  return (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.id}</TableCell>
                      <TableCell>{job.studentName}</TableCell>
                      <TableCell className="truncate max-w-xs">{job.documentName}</TableCell>
                      <TableCell>{job.pages}</TableCell>
                      <TableCell>{job.submittedDate}</TableCell>
                      <TableCell>{job.price || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${statusColors[job.status]}`}>
                          <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Job Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/print-center/jobs/${job.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </Link>
                            </DropdownMenuItem>
                            {/* Add more actions like 'Update Status', 'Set Price' directly here if needed */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
