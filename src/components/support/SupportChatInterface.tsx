
"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Paperclip, Send, User, MessageSquare } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";


interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: string;
  avatar?: string;
}

const mockMessages: Message[] = [
  { id: "1", text: "Hello, I'm having trouble submitting my task.", sender: "user", timestamp: "10:30 AM", avatar: "https://placehold.co/40x40.png?text=U" },
  { id: "2", text: "Hi there! I can help with that. Could you please tell me which step you are stuck on?", sender: "support", timestamp: "10:31 AM", avatar: "https://placehold.co/40x40.png?text=S" },
  { id: "3", text: "I can't seem to upload my file. It keeps giving an error.", sender: "user", timestamp: "10:32 AM", avatar: "https://placehold.co/40x40.png?text=U" },
];

interface Ticket {
  id: string;
  subject: string;
  status: "New" | "Ongoing" | "Resolved";
  lastUpdate: string;
  category: "new" | "ongoing" | "old";
}

const initialMockTickets: Ticket[] = [
    { id: "TKT001", subject: "Task Submission Issue", status: "Ongoing", lastUpdate: "10:32 AM", category: "ongoing" },
    { id: "TKT002", subject: "Payment Problem", status: "New", lastUpdate: "Yesterday", category: "new" },
    { id: "TKT003", subject: "Referral Earnings Query", status: "Resolved", lastUpdate: "3 days ago", category: "old" },
];


export function SupportChatInterface() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [tickets, setTickets] = useState<Ticket[]>(initialMockTickets);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(tickets.find(t => t.category === 'ongoing')?.id || null);
  
  const [isCreateTicketDialogOpen, setIsCreateTicketDialogOpen] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const { toast } = useToast();


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !activeTicketId) return;
    const msg: Message = {
      id: String(Date.now()),
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "https://placehold.co/40x40.png?text=U"
    };
    setMessages([...messages, msg]);
    setNewMessage("");

    setTimeout(() => {
      const replyMsg: Message = {
        id: String(Date.now() + 1),
        text: "Thanks for your message. We are looking into it for ticket " + activeTicketId + " and will get back to you shortly.",
        sender: "support",
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

    const newTicketId = `TKT${String(tickets.length + 1).padStart(3, '0')}`;
    const newTicket: Ticket = {
      id: newTicketId,
      subject: newTicketSubject,
      status: "New",
      lastUpdate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: "new",
    };
    setTickets(prevTickets => [newTicket, ...prevTickets]);

    const initialUserMessage: Message = {
      id: String(Date.now()),
      text: newTicketMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "https://placehold.co/40x40.png?text=U",
    };
    setMessages([initialUserMessage]); // Start chat with the user's first message for this new ticket
    
    setActiveTicketId(newTicketId);
    setNewTicketSubject("");
    setNewTicketMessage("");
    setIsCreateTicketDialogOpen(false);

    toast({
      title: "Support Ticket Created!",
      description: `Your new ticket "${newTicketSubject}" (ID: ${newTicketId}) has been submitted.`,
    });
  };

  const renderChatArea = () => (
    <Card className="flex flex-col h-full shadow-xl">
        <CardHeader className="border-b">
            <CardTitle className="font-headline flex items-center">
                <MessageSquare className="h-6 w-6 mr-2 text-primary" />
                Chat with Support {activeTicketId && `(Ticket: ${activeTicketId})`}
            </CardTitle>
            <CardDescription>
                {activeTicketId ? `Discussing: ${tickets.find(t=>t.id === activeTicketId)?.subject}` : "Select a ticket or start a new query."}
            </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-0">
            <ScrollArea className="h-[calc(100vh-380px)] p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex items-end space-x-2", msg.sender === "user" ? "justify-end" : "")}>
                    {msg.sender === "support" && (
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatar} data-ai-hint="support agent avatar"/>
                        <AvatarFallback>{msg.sender.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    )}
                    <div className={cn(
                        "max-w-[70%] rounded-lg px-4 py-2 text-sm",
                        msg.sender === "user" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
                    )}>
                        <p>{msg.text}</p>
                        <p className={cn("text-xs mt-1", msg.sender === "user" ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70")}>
                        {msg.timestamp}
                        </p>
                    </div>
                    {msg.sender === "user" && (
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatar} data-ai-hint="user avatar" />
                        <AvatarFallback>{msg.sender.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                </div>
            </ScrollArea>
        </CardContent>
        <form onSubmit={handleSendMessage} className="border-t p-4 flex items-center space-x-3 bg-background">
            <Button variant="ghost" size="icon" type="button">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Attach file</span>
            </Button>
            <Input
                placeholder="Type your message..."
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
                <CardDescription>Manage your support queries.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow p-0">
                <Tabs defaultValue="ongoing" className="flex flex-col h-full">
                    <TabsList className="grid w-full grid-cols-3 px-2 pt-0 pb-2">
                        <TabsTrigger value="new">New</TabsTrigger>
                        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                        <TabsTrigger value="old">Old</TabsTrigger>
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
                                            onClick={() => {
                                                setActiveTicketId(ticket.id);
                                                // TODO: Load messages specific to this ticket
                                                // For now, demo purposes, we can clear messages or load a generic set
                                                setMessages(mockMessages.filter(m => m.id === "1" || m.id === "2")); // Example
                                            }}
                                        >
                                            <div>
                                                <p className="font-medium text-sm">{ticket.subject}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    ID: {ticket.id} - Status: {ticket.status} - Last Update: {ticket.lastUpdate}
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
                                Describe your issue below. A support agent will get back to you.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
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

