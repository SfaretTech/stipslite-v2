
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Megaphone, Eye, Trash2, MoreHorizontal, Send, Users, Briefcase, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area"; // Added import

type TargetAudience = "student" | "va" | "print-center";

interface Announcement {
  id: string;
  title: string;
  message: string;
  targets: TargetAudience[];
  dateSent: string;
}

const initialAnnouncements: Announcement[] = [
  { id: "ANC001", title: "Platform Maintenance Scheduled", message: "Please be advised that STIPS Lite will undergo scheduled maintenance on July 30th, 2024, from 2:00 AM to 4:00 AM. Services may be temporarily unavailable.", targets: ["student", "va", "print-center"], dateSent: "2024-07-26" },
  { id: "ANC002", title: "New Feature: AI Search", message: "We're excited to launch our new AI-powered search! Find tasks and print centers faster than ever.", targets: ["student"], dateSent: "2024-07-25" },
];

const targetOptions: { id: TargetAudience; label: string; icon: React.ElementType }[] = [
  { id: "student", label: "Students", icon: Users },
  { id: "va", label: "Virtual Assistants", icon: Briefcase },
  { id: "print-center", label: "Print Centers", icon: Printer },
];

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);
  const [announcementToView, setAnnouncementToView] = useState<Announcement | null>(null);
  
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedTargets, setSelectedTargets] = useState<TargetAudience[]>([]);

  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleTargetChange = (targetId: TargetAudience, checked: boolean) => {
    setSelectedTargets(prev => 
      checked ? [...prev, targetId] : prev.filter(t => t !== targetId)
    );
  };

  const handleSelectAllTargets = (checked: boolean) => {
    if (checked) {
      setSelectedTargets(targetOptions.map(opt => opt.id));
    } else {
      setSelectedTargets([]);
    }
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim() || selectedTargets.length === 0) {
        toast({title: "Missing Information", description: "Please provide a title, message, and select at least one target audience.", variant: "destructive"});
        return;
    }
    const newAnnouncement: Announcement = {
      id: `ANC${String(Date.now()).slice(-4)}`,
      title: newTitle,
      message: newMessage,
      targets: selectedTargets,
      dateSent: format(new Date(), "yyyy-MM-dd"),
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    toast({ title: "Announcement Sent!", description: `"${newTitle}" has been sent to the selected audience(s). (Simulated: Users would receive a notification)` });
    setIsCreateDialogOpen(false);
    setNewTitle(""); setNewMessage(""); setSelectedTargets([]);
  };

  const openViewDialog = (announcement: Announcement) => {
    setAnnouncementToView(announcement);
    setIsViewDialogOpen(true);
  };

  const confirmDeleteAnnouncement = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
  };

  const handleDeleteAnnouncement = () => {
    if (!announcementToDelete) return;
    setAnnouncements(prev => prev.filter(ann => ann.id !== announcementToDelete.id));
    toast({ title: "Announcement Deleted", description: `Announcement "${announcementToDelete.title}" has been removed.`, variant: "destructive" });
    setAnnouncementToDelete(null);
  };
  
  const allTargetsSelected = selectedTargets.length === targetOptions.length;
  const someTargetsSelected = selectedTargets.length > 0 && selectedTargets.length < targetOptions.length;

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Manage Announcements"
        description="Create and distribute platform-wide announcements to various user groups."
        icon={Megaphone}
        actions={
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Send className="mr-2 h-4 w-4"/> Create New Announcement
            </Button>
        }
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSendAnnouncement}>
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>Compose your message and select the target audience.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-3">
              <div className="space-y-1.5">
                <Label htmlFor="newAnnouncementTitle">Title</Label>
                <Input id="newAnnouncementTitle" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Important Update" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="newAnnouncementMessage">Message</Label>
                <Textarea id="newAnnouncementMessage" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Enter your announcement details here..." rows={6} required />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Target Audience</Label>
                <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/30">
                    <Checkbox 
                        id="target-all" 
                        checked={allTargetsSelected}
                        onCheckedChange={handleSelectAllTargets}
                        data-state={someTargetsSelected ? 'indeterminate' : (allTargetsSelected ? 'checked' : 'unchecked')}
                    />
                    <Label htmlFor="target-all" className="font-semibold text-sm">All User Groups</Label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {targetOptions.map(opt => (
                        <div key={opt.id} className="flex items-center space-x-2 p-2 border rounded-md">
                            <Checkbox 
                                id={`target-${opt.id}`} 
                                checked={selectedTargets.includes(opt.id)}
                                onCheckedChange={(checked) => handleTargetChange(opt.id, !!checked)}
                            />
                            <Label htmlFor={`target-${opt.id}`} className="font-normal text-sm flex items-center">
                                <opt.icon className="h-4 w-4 mr-1.5 text-muted-foreground"/>{opt.label}
                            </Label>
                        </div>
                    ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="submit">Send Announcement</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{announcementToView?.title || "Announcement Details"}</DialogTitle>
            <DialogDescription>
              Sent on: {isClient && announcementToView?.dateSent ? format(new Date(announcementToView.dateSent), "PPP") : announcementToView?.dateSent || 'N/A'} | To: {announcementToView?.targets.join(', ')}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] my-4">
            <div className="whitespace-pre-wrap p-2 bg-muted/30 rounded-md text-sm">
              {announcementToView?.message}
            </div>
          </ScrollArea>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline">Sent Announcements ({announcements.length})</CardTitle>
          <CardDescription>View and manage previously sent announcements.</CardDescription>
        </CardHeader>
        <CardContent>
            {announcements.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    <Megaphone className="mx-auto h-12 w-12 mb-3"/>
                    <p>No announcements sent yet.</p>
                </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Target Audience</TableHead>
                      <TableHead>Date Sent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {announcements.map(ann => (
                      <TableRow key={ann.id}>
                        <TableCell className="font-medium max-w-xs truncate">{ann.title}</TableCell>
                        <TableCell className="space-x-1">
                            {ann.targets.map(target => <Badge key={target} variant="secondary">{target.charAt(0).toUpperCase() + target.slice(1)}</Badge>)}
                        </TableCell>
                        <TableCell>{isClient ? format(new Date(ann.dateSent), "PPP") : ann.dateSent}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" /><span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openViewDialog(ann)}>
                                <Eye className="mr-2 h-4 w-4" /> View Message
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => confirmDeleteAnnouncement(ann)} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
        </CardContent>
      </Card>

      <AlertDialog open={!!announcementToDelete} onOpenChange={() => setAnnouncementToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the announcement: <strong>{announcementToDelete?.title}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAnnouncementToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAnnouncement} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
