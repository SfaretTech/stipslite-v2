
"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Paperclip, Send, User, MessageSquare, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";


interface Message {
  id: string;
  text: string;
  sender: "user" | "support" | "va" | "admin";
  senderName?: string; // For displaying "Student" or "VA Name"
  timestamp: string;
  avatar?: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: "New" | "Ongoing" | "Resolved";
  lastUpdate: string;
  category: "new" | "ongoing" | "old"; // For tab filtering
  from?: string; // e.g., "Student John Doe", "Admin", "VA Aisha B."
  to?: string; // e.g., "Admin Support", "VA Aisha B."
  taskId?: string; // If task-specific
}

const getMockStudentTickets = (): Ticket[] => [
    { id: "TKT_S001", subject: "Task Submission Issue", status: "Ongoing", lastUpdate: "10:32 AM", category: "ongoing", from: "You", to: "Admin Support" },
    { id: "TKT_S002", subject: "Payment Problem", status: "New", lastUpdate: "Yesterday", category: "new", from: "You", to: "Admin Support" },
    { id: "TKT_S003", subject: "Query on Task TSK001", status: "Ongoing", lastUpdate: "2 hours ago", category: "ongoing", from: "You", to: "VA Aisha B.", taskId: "TSK001" },
    { id: "TKT_S004", subject: "Referral Earnings Query", status: "Resolved", lastUpdate: "3 days ago", category: "old", from: "You", to: "Admin Support" },
];

const getMockVaTickets = (): Ticket[] => [
    { id: "TKT_V001", subject: "Query from Student (Task TSK102)", status: "New", lastUpdate: "1 hour ago", category: "new", from: "Student Chinedu O.", to: "You", taskId: "TSK102" },
    { id: "TKT_V002", subject: "My Payment Query - July", status: "Ongoing", lastUpdate: "Today 9:00 AM", category: "ongoing", from: "You", to: "Admin Support" },
    { id: "TKT_V003", subject: "Admin Announcement: New Policy", status: "New", lastUpdate: "Yesterday", category: "new", from: "Admin", to: "You" },
    { id: "TKT_V004", subject: "Issue with Student (Task TSK099)", status: "Resolved", lastUpdate: "2 days ago", category: "old", from: "You", to: "Admin Support", taskId: "TSK099"},
];

const getMockMessagesForTicket = (ticketId: string, userRole: 'student' | 'va'): Message[] => {
    const commonSupportAvatar = "https://placehold.co/40x40.png?text=S";
    const userAvatar = "https://placehold.co/40x40.png?text=U";
    const vaAvatar = "https://placehold.co/40x40.png?text=VA";
    const adminAvatar = "https://placehold.co/40x40.png?text=AD";

    if (userRole === 'student') {
        if (ticketId === "TKT_S001") return [
            { id: "s1m1", text: "Hello, I'm having trouble submitting my task.", sender: "user", senderName: "Student", timestamp: "10:30 AM", avatar: userAvatar },
            { id: "s1m2", text: "Hi there! I can help with that. Which step are you stuck on?", sender: "support", senderName: "Admin Support", timestamp: "10:31 AM", avatar: adminAvatar },
        ];
        if (ticketId === "TKT_S003") return [
            { id: "s3m1", text: "Hi VA, I have a question about Task TSK001 requirements.", sender: "user", senderName: "Student", timestamp: "11:00 AM", avatar: userAvatar },
            { id: "s3m2", text: "Hello! Sure, what's your question regarding TSK001?", sender: "va", senderName: "VA Aisha B.", timestamp: "11:05 AM", avatar: vaAvatar },
        ];
    }
    if (userRole === 'va') {
         if (ticketId === "TKT_V001") return [
            { id: "v1m1", text: "Hi, I have a question about the deadline for task TSK102 you are working on.", sender: "support", senderName: "Student Chinedu O.", timestamp: "10:00 AM", avatar: userAvatar },
            { id: "v1m2", text: "Hello Chinedu, the deadline is firm for now. Is there an issue?", sender: "user", senderName: "VA (You)", timestamp: "10:05 AM", avatar: vaAvatar },
        ];
        if (ticketId === "TKT_V002") return [
            { id: "v2m1", text: "Hi Admin, I haven't received my payment for July's tasks.", sender: "user", senderName: "VA (You)", timestamp: "9:00 AM", avatar: vaAvatar },
            { id: "v2m2", text: "Hi VA, we are looking into this. Payments are processed by EOD today.", sender: "admin", senderName: "Admin Support", timestamp: "9:15 AM", avatar: adminAvatar },
        ];
    }
    return [{ id: "fallback", text: `No messages found for ticket ${ticketId} or role ${userRole}. Select another ticket.`, sender: "support", timestamp: "N/A", avatar: commonSupportAvatar }];
};


export function SupportChatInterface({ userRole }: { userRole: 'student' | 'va' }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const initialTickets = userRole === 'student' ? getMockStudentTickets() : getMockVaTickets();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(
    initialTickets.find(t => t.category === 'ongoing')?.id || initialTickets[0]?.id || null
  );
  
  const [isCreateTicketDialogOpen, setIsCreateTicketDialogOpen] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [studentQueryType, setStudentQueryType] = useState<string | undefined>();
  const [relevantTaskId, setRelevantTaskId] = useState("");
  const [vaQueryType, setVaQueryType] = useState<string | undefined>();

  const { toast } = useToast();

  useEffect(() => {
    if (activeTicketId) {
        setMessages(getMockMessagesForTicket(activeTicketId, userRole));
    } else {
        setMessages([]);
    }
  }, [activeTicketId, userRole]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !activeTicketId) return;

    const currentTicket = tickets.find(t => t.id === activeTicketId);
    if (!currentTicket) return;

    const msg: Message = {
      id: String(Date.now()),
      text: newMessage,
      sender: "user", // 'user' here refers to the current user of this interface (student or VA)
      senderName: userRole === 'student' ? "Student (You)" : "VA (You)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "https://placehold.co/40x40.png?text=U"
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage("");

    // Simulate reply
    setTimeout(() => {
      let replyText = "Thanks for your message. We are looking into it";
      let replySender: "support" | "admin" | "va" = "support";
      let replySenderName = "Support";

      if (userRole === 'student') {
        if (currentTicket.to?.startsWith("VA")) {
            replyText = `Message received for ${currentTicket.to}. They will respond shortly.`;
            replySender = "va"; // Actually from the system, but simulating VA will see it
            replySenderName = currentTicket.to || "Assigned VA";
        } else {
            replyText = `An admin is reviewing your query for ticket ${activeTicketId}.`;
            replySender = "admin";
            replySenderName = "Admin Support";
        }
      } else { // VA is user
         replyText = `Your message to Admin Support for ticket ${activeTicketId} has been sent.`;
         replySender = "admin"; // Simulating admin sees it
         replySenderName = "Admin Support";
      }

      const replyMsg: Message = {
        id: String(Date.now() + 1),
        text: replyText,
        sender: replySender,
        senderName: replySenderName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: "https://placehold.co/40x40.png?text=S"
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1500);
  };

  const handleCreateNewTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a subject and a message for your ticket.",
        variant: "destructive",
      });
      return;
    }

    let recipient = "Admin Support";
    let toastMessage = `Your new ticket "${newTicketSubject}" has been submitted to Admin Support.`;

    if (userRole === 'student') {
        if (!studentQueryType) {
            toast({ title: "Query Type Required", description: "Please select a query type.", variant: "destructive"});
            return;
        }
        if (studentQueryType === "task_specific" && relevantTaskId) {
            recipient = `VA for Task ${relevantTaskId}`; // Simulated
            toastMessage = `Your query about Task ${relevantTaskId} has been sent to the assigned VA.`;
        } else if (studentQueryType === "task_specific" && !relevantTaskId) {
            toast({ title: "Task ID Recommended", description: "Please provide a Task ID for task-specific questions if possible, or choose a general query type.", variant: "destructive" });
            // Allow to proceed but ideally, they should provide it or choose general
        }
    } else { // userRole === 'va'
        if (!vaQueryType) {
            toast({ title: "Query Type Required", description: "Please select a query type for your ticket to Admin.", variant: "destructive"});
            return;
        }
        toastMessage = `Your ticket "${newTicketSubject}" regarding '${vaQueryType.replace(/_/g, ' ')}' has been sent to Admin Support.`;
    }


    const newTicketId = `${userRole === 'student' ? 'S' : 'V'}${String(Date.now()).slice(-5)}`;
    const newTicket: Ticket = {
      id: newTicketId,
      subject: newTicketSubject,
      status: "New",
      lastUpdate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: "new",
      from: "You",
      to: recipient,
      taskId: userRole === 'student' && studentQueryType === "task_specific" ? relevantTaskId : undefined,
    };
    setTickets(prevTickets => [newTicket, ...prevTickets]);

    const initialUserMessage: Message = {
      id: String(Date.now()),
      text: newTicketMessage,
      sender: "user",
      senderName: userRole === 'student' ? "Student (You)" : "VA (You)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "https://placehold.co/40x40.png?text=U",
    };
    setMessages([initialUserMessage]); 
    
    setActiveTicketId(newTicketId);
    setNewTicketSubject("");
    setNewTicketMessage("");
    setStudentQueryType(undefined);
    setRelevantTaskId("");
    setVaQueryType(undefined);
    setIsCreateTicketDialogOpen(false);

    toast({
      title: "Support Ticket Created!",
      description: toastMessage,
      duration: 7000,
    });
  };

  const renderChatArea = () => (
    <Card className="flex flex-col h-full shadow-xl">
        <CardHeader className="border-b">
            <CardTitle className="font-headline flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-primary" />
                Chat {activeTicketId && `(Ticket: ${activeTicketId})`}
            </CardTitle>
            <CardDescription>
                {activeTicketId ? `Regarding: ${tickets.find(t=>t.id === activeTicketId)?.subject}` : "Select a ticket or start a new query."}
                {activeTicketId && tickets.find(t=>t.id === activeTicketId)?.to && <span className="block text-xs">To: {tickets.find(t=>t.id === activeTicketId)?.to}</span>}
            </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-0">
            <ScrollArea className="h-[calc(100vh-380px)] p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex items-end space-x-2 group", msg.sender === "user" ? "justify-end" : "")}>
                    {msg.sender !== "user" && (
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatar} data-ai-hint={`${msg.senderName} avatar`} />
                        <AvatarFallback>{msg.senderName?.substring(0,1) || msg.sender.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    )}
                    <div className={cn(
                        "max-w-[70%] rounded-lg px-4 py-2 text-sm shadow-md",
                        msg.sender === "user" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
                    )}>
                        {msg.sender !== "user" && msg.senderName && <p className="text-xs font-semibold mb-0.5">{msg.senderName}</p>}
                        <p>{msg.text}</p>
                        <p className={cn("text-xs mt-1", msg.sender === "user" ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70")}>
                        {msg.timestamp}
                        </p>
                    </div>
                    {msg.sender === "user" && (
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatar} data-ai-hint="user avatar"/>
                        <AvatarFallback>{msg.senderName?.substring(0,1) || "U"}</AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                </div>
            </ScrollArea>
        </CardContent>
        <form onSubmit={handleSendMessage} className="border-t p-4 flex items-center space-x-3 bg-background">
            <Button variant="ghost" size="icon" type="button" disabled={!activeTicketId}>
                <Paperclip className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Attach file</span>
            </Button>
            <Input
                placeholder={activeTicketId ? "Type your message..." : "Select a ticket to reply"}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow"
                disabled={!activeTicketId}
            />
            <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={!activeTicketId || !newMessage.trim()}>
                <Send className="h-5 w-5" />
                <span className="sr-only">Send message</span>
            </Button>
        </form>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
        <Card className="lg:col-span-1 shadow-xl h-full flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline">Support Tickets</CardTitle>
                <CardDescription>Manage your {userRole} support queries.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-0">
                <Tabs defaultValue="new" className="flex flex-col h-full">
                    <TabsList className="grid w-full grid-cols-3 px-2 pt-0 pb-2">
                        <TabsTrigger value="new">New ({tickets.filter(t => t.category === 'new').length})</TabsTrigger>
                        <TabsTrigger value="ongoing">Ongoing ({tickets.filter(t => t.category === 'ongoing').length})</TabsTrigger>
                        <TabsTrigger value="old">Old ({tickets.filter(t => t.category === 'old').length})</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="flex-grow">
                        {["new", "ongoing", "old"].map(category => (
                            <TabsContent key={category} value={category} className="m-0">
                                <div className="space-y-2 p-2">
                                    {tickets.filter(t => t.category === category).map(ticket => (
                                        <Button 
                                            key={ticket.id} 
                                            variant={activeTicketId === ticket.id ? "secondary" : "ghost"}
                                            className="w-full justify-start h-auto py-2 px-3 text-left"
                                            onClick={() => setActiveTicketId(ticket.id)}
                                        >
                                            <div>
                                                <p className="font-medium text-sm">{ticket.subject}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    ID: {ticket.id} - {ticket.status}
                                                </p>
                                                 <p className="text-xs text-muted-foreground">
                                                    {ticket.from !== "You" && `From: ${ticket.from} | `}
                                                    To: {ticket.to} | 
                                                    Updated: {ticket.lastUpdate}
                                                </p>
                                            </div>
                                        </Button>
                                    ))}
                                    {tickets.filter(t => t.category === category).length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">No {category} tickets.</p>
                                    )}
                                </div>
                            </TabsContent>
                        ))}
                    </ScrollArea>
                </Tabs>
            </CardContent>
             <CardFooter className="border-t pt-4">
                <Dialog open={isCreateTicketDialogOpen} onOpenChange={setIsCreateTicketDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                            <User className="mr-2 h-4 w-4" /> Create New Ticket
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <form onSubmit={handleCreateNewTicket}>
                            <DialogHeader>
                                <DialogTitle>Create New Support Ticket</DialogTitle>
                                <DialogDescription>
                                Describe your issue below.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {userRole === 'student' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="student-query-type">Query Type</Label>
                                        <Select onValueChange={setStudentQueryType} value={studentQueryType}>
                                            <SelectTrigger id="student-query-type">
                                                <SelectValue placeholder="Select query type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="general_platform">General Platform Issue (to Admin)</SelectItem>
                                                <SelectItem value="task_specific">Task-Specific Question (to VA)</SelectItem>
                                                <SelectItem value="referral_query">Referral Program Query (to Admin)</SelectItem>
                                                <SelectItem value="subscription_query">Subscription Query (to Admin)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                {userRole === 'student' && studentQueryType === 'task_specific' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="relevant-task-id">Relevant Task ID (Optional)</Label>
                                        <Input 
                                            id="relevant-task-id" 
                                            placeholder="e.g., TSK001" 
                                            value={relevantTaskId}
                                            onChange={(e) => setRelevantTaskId(e.target.value)}
                                        />
                                    </div>
                                )}
                                {userRole === 'va' && (
                                     <div className="space-y-2">
                                        <Label htmlFor="va-query-type">Query Type (to Admin)</Label>
                                        <Select onValueChange={setVaQueryType} value={vaQueryType}>
                                            <SelectTrigger id="va-query-type">
                                                <SelectValue placeholder="Select query type for Admin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="platform_issue">Platform Issue</SelectItem>
                                                <SelectItem value="payment_query">Payment Query</SelectItem>
                                                <SelectItem value="student_interaction">Student Interaction Issue</SelectItem>
                                                <SelectItem value="task_clarification_admin">Task Clarification (Admin)</SelectItem>
                                                <SelectItem value="other_admin">Other (to Admin)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="ticket-subject">Subject</Label>
                                    <Input 
                                        id="ticket-subject" 
                                        placeholder="e.g., Issue with payment" 
                                        value={newTicketSubject}
                                        onChange={(e) => setNewTicketSubject(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ticket-message">Initial Message</Label>
                                    <Textarea 
                                        id="ticket-message" 
                                        placeholder="Please describe your problem in detail..." 
                                        rows={5}
                                        value={newTicketMessage}
                                        onChange={(e) => setNewTicketMessage(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Submit Ticket</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>

        <div className="lg:col-span-2 h-full">
            {activeTicketId ? renderChatArea() : (
                <Card className="h-full flex flex-col items-center justify-center text-center shadow-xl">
                    <CardContent>
                        <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">No Ticket Selected</h3>
                        <p className="text-muted-foreground">Please select a ticket from the list or create a new one to start chatting.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
