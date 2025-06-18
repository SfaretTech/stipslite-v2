
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react"; // Removed unused ListFilter, MessageSquare
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"; // Removed unused Input
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from "react"; // Added useState for potential future state

// Mock data for admin view of tickets
const mockAdminOpenTickets = [
  { id: "TKT_S001", subject: "Task Submission Issue", user: "Student S001", status: "Open" as const, lastReply: "User", updated: "2h ago" },
  { id: "TKT_V002", subject: "My Payment Query - July", user: "VA V002", status: "Open" as const, lastReply: "Admin", updated: "1d ago" },
  { id: "TKT_PC001", subject: "Query from Student (Job JOB123)", user: "PC PC001", status: "Pending User" as const, lastReply: "Admin", updated: "5m ago" },
  { id: "TKT_A004", subject: "General Platform Feedback", user: "Student S008", status: "New" as const, lastReply: "User", updated: "15m ago" },
  { id: "TKT_A005", subject: "Difficulty Uploading VA Profile Picture", user: "VA V005", status: "In Progress" as const, lastReply: "Admin", updated: "30m ago" },
];

type TicketStatusAdmin = "Open" | "Pending User" | "In Progress" | "Resolved" | "Closed" | "New";

const statusColorsAdmin: Record<TicketStatusAdmin, string> = {
  "New": "bg-blue-100 text-blue-700 border-blue-300",
  "Open": "bg-orange-100 text-orange-700 border-orange-300",
  "In Progress": "bg-purple-100 text-purple-700 border-purple-300",
  "Pending User": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Resolved": "bg-green-100 text-green-700 border-green-300",
  "Closed": "bg-gray-100 text-gray-700 border-gray-300",
};


export default function AdminSupportPage() {
  // Placeholder for future state management, e.g., tickets data, filters
  // const [tickets, setTickets] = useState(mockAdminOpenTickets);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Support Center"
        description="Manage and respond to all user support tickets."
        icon={LifeBuoy}
      />
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Support Tickets Overview</CardTitle>
          <CardDescription>Review and manage active support conversations from all platform users.</CardDescription>
          {/* Add filter controls here in the future:
            <div className="flex gap-2 mt-4">
              <Input placeholder="Search tickets..." />
              <Select>...</Select>
            </div>
          */}
        </CardHeader>
        <CardContent>
          {mockAdminOpenTickets.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <LifeBuoy className="mx-auto h-12 w-12 mb-3" />
              <p>No support tickets found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Reply</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAdminOpenTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                      <TableCell className="font-medium max-w-sm truncate">{ticket.subject}</TableCell>
                      <TableCell>{ticket.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColorsAdmin[ticket.status as TicketStatusAdmin] || "border-gray-300 text-gray-700"}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.lastReply}</TableCell>
                      <TableCell>{ticket.updated}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View/Reply</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
       <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="font-headline text-lg">Future Admin Support Features</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm space-y-1">
            <p>- Full chat interface for admins to reply to tickets directly.</p>
            <p>- Ticket assignment to specific admin users or support roles.</p>
            <p>- Advanced filtering (by user role, status, date) and search for tickets.</p>
            <p>- Canned responses and knowledge base integration for faster replies.</p>
            <p>- SLA tracking and reporting for support performance.</p>
        </CardContent>
       </Card>
    </div>
  );
}
