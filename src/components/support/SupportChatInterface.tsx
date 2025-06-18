
"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Paperclip, Send, User, MessageSquare, ChevronDown, Briefcase, Printer } from "lucide-react"; // Added Briefcase, Printer
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";


interface Message {
  id: string;
  text: string;
  sender: "user" | "support" | "va" | "admin" | "student" | "print-center"; 
  senderName?: string; 
  timestamp: string;
  avatar?: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: "New" | "Ongoing" | "Resolved";
  lastUpdate: string;
  category: "new" | "ongoing" | "old"; 
  from?: string; 
  to?: string; 
  taskId?: string; 
  jobId?: string; 
}

const getMockStudentTickets = (): Ticket[] => [
    { id: "TKT_S001", subject: "Task Submission Issue", status: "Ongoing", lastUpdate: "10:32 AM", category: "ongoing", from: "You", to: "Admin Support" },
    { id: "TKT_S002", subject: "Payment Problem", status: "New", lastUpdate: "Yesterday", category: "new", from: "You", to: "Admin Support" },
    { id: "TKT_S003", subject: "Query on Task TSK001", status: "Ongoing", lastUpdate: "2 hours ago", category: "ongoing", from: "You", to: "VA Aisha B.", taskId: "TSK001" },
    { id: "TKT_S_FROM_VA", subject: "Update on your Task TSK123", status: "New", lastUpdate: "Just now", category: "new", from: "VA David A.", to: "You (Student)", taskId: "TSK123" },
    { id: "TKT_S004", subject: "Referral Earnings Query", status: "Resolved", lastUpdate: "3 days ago", category: "old", from: "You", to: "Admin Support" },
];

const getMockVaTickets = (): Ticket[] => [
    { id: "TKT_V001", subject: "Query from Student (Task TSK102)", status: "New", lastUpdate: "1 hour ago", category: "new", from: "Student Chinedu O.", to: "You", taskId: "TSK102" },
    { id: "TKT_V002", subject: "My Payment Query - July", status: "Ongoing", lastUpdate: "Today 9:00 AM", category: "ongoing", from: "You", to: "Admin Support" },
    { id: "TKT_V003", subject: "Admin Announcement: New Policy", status: "New", lastUpdate: "Yesterday", category: "new", from: "Admin", to: "You" },
    { id: "TKT_V004", subject: "Issue with Student (Task TSK099)", status: "Resolved", lastUpdate: "2 days ago", category: "old", from: "You", to: "Admin Support", taskId: "TSK099"},
];

const getMockPrintCenterTickets = (): Ticket[] => [
    { id: "TKT_PC001", subject: "Query from Student (Job JOB123)", status: "New", lastUpdate: "30 mins ago", category: "new", from: "Student John D.", to: "You (Shop)", jobId: "JOB123" },
    { id: "TKT_PC002", subject: "Shop Payout Query - July", status: "Ongoing", lastUpdate: "Today 11:00 AM", category: "ongoing", from: "You (Shop)", to: "Admin Support" },
    { id: "TKT_PC003", subject: "Admin Info: Upcoming Maintenance", status: "New", lastUpdate: "2 hours ago", category: "new", from: "Admin", to: "You (Shop)" },
    { id: "TKT_PC004", subject: "Issue with Job JOB100 Payment", status: "Resolved", lastUpdate: "1 day ago", category: "old", from: "You (Shop)", to: "Admin Support", jobId: "JOB100"},
];

const getMockAdminTickets = (): Ticket[] => [
    { id: "TKT_S001", subject: "Task Submission Issue (Student Query)", status: "Ongoing", lastUpdate: "10:32 AM", category: "ongoing", from: "Student John Doe", to: "You (Admin)" },
    { id: "TKT_V002", subject: "VA Payment Query - July", status: "Ongoing", lastUpdate: "Today 9:00 AM", category: "ongoing", from: "VA Aisha B.", to: "You (Admin)" },
    { id: "TKT_PC002", subject: "Print Center Payout Query - July", status: "Ongoing", lastUpdate: "Today 11:00 AM", category: "ongoing", from: "PC Speedy Prints", to: "You (Admin)" },
    { id: "TKT_A001", subject: "General Platform Feedback", status: "New", lastUpdate: "Yesterday", category: "new", from: "Student Jane Smith", to: "You (Admin)" },
    { id: "TKT_A002", subject: "Account Approval Request - VA", status: "New", lastUpdate: "2 hours ago", category: "new", from: "VA David Lee (Pending)", to: "You (Admin)" },
    { id: "TKT_A003", subject: "Resolved: Referral Earnings", status: "Resolved", lastUpdate: "3 days ago", category: "old", from: "Student Bob K.", to: "You (Admin)" },
];


const getMockMessagesForTicket = (ticketId: string, userRole: 'student' | 'va' | 'print-center' | 'admin'): Message[] => {
    const commonSupportAvatar = "https://placehold.co/40x40.png?text=S";
    const userAvatar = "https://placehold.co/40x40.png?text=U";
    const vaAvatar = "https://placehold.co/40x40.png?text=VA";
    const adminAvatar = "https://placehold.co/40x40.png?text=AD";
    const studentAvatar = "https://placehold.co/40x40.png?text=ST";
    const printCenterAvatar = "https://placehold.co/40x40.png?text=PC";

    if (userRole === 'student') {
        if (ticketId === "TKT_S001") return [
            { id: "s1m1", text: "Hello, I'm having trouble submitting my task.", sender: "user", senderName: "Student (You)", timestamp: "10:30 AM", avatar: userAvatar },
            { id: "s1m2", text: "Hi there! I can help with that. Which step are you stuck on?", sender: "admin", senderName: "Admin Support", timestamp: "10:31 AM", avatar: adminAvatar },
        ];
        if (ticketId === "TKT_S003") return [
            { id: "s3m1", text: "Hi VA, I have a question about Task TSK001 requirements.", sender: "user", senderName: "Student (You)", timestamp: "11:00 AM", avatar: userAvatar },
            { id: "s3m2", text: "Hello! Sure, what's your question regarding TSK001?", sender: "va", senderName: "VA Aisha B.", timestamp: "11:05 AM", avatar: vaAvatar },
        ];
        if (ticketId === "TKT_S_FROM_VA") return [
            { id: "s_va_m1", text: "Hi Student, just an update on your task TSK123: I'm making good progress and expect to submit it by tomorrow EOD.", sender: "va", senderName: "VA David A.", timestamp: "Just now", avatar: vaAvatar },
            { id: "s_va_m2", text: "Great, thanks for the update David!", sender: "user", senderName: "You (Student)", timestamp: "A moment later", avatar: userAvatar },
        ];
    }
    if (userRole === 'va') {
         if (ticketId === "TKT_V001") return [
            { id: "v1m1", text: "Hi VA, I have a question about the deadline for task TSK102 you are working on. Can it be extended by a day?", sender: "student", senderName: "Student Chinedu O.", timestamp: "1 hour ago", avatar: studentAvatar }, 
            { id: "v1m2", text: "Hello Chinedu, I'll check if an extension is possible and let you know. What's the reason for the request?", sender: "user", senderName: "VA (You)", timestamp: "55 mins ago", avatar: vaAvatar },
        ];
        if (ticketId === "TKT_V002") return [
            { id: "v2m1", text: "Hi Admin, I haven't received my payment for July's tasks.", sender: "user", senderName: "VA (You)", timestamp: "9:00 AM", avatar: vaAvatar },
            { id: "v2m2", text: "Hi VA, we are looking into this. Payments are processed by EOD today. Please check again later.", sender: "admin", senderName: "Admin Support", timestamp: "9:15 AM", avatar: adminAvatar },
        ];
         if (ticketId === "TKT_V003") return [
            { id: "v3m1", text: "Hello VAs, please note the updated policy on task revisions. Details can be found on the announcements page.", sender: "admin", senderName: "Admin", timestamp: "Yesterday", avatar: adminAvatar },
            { id: "v3m2", text: "Okay, thanks for the update.", sender: "user", senderName: "VA (You)", timestamp: "This morning", avatar: vaAvatar },
        ];
    }
    if (userRole === 'print-center') {
        if (ticketId === "TKT_PC001") return [
            { id: "pc1m1", text: "Hi Shop, I submitted job JOB123 but haven't received a quote yet. Can you check?", sender: "student", senderName: "Student John D.", timestamp: "30 mins ago", avatar: studentAvatar },
            { id: "pc1m2", text: "Hello John, apologies for the delay. We're a bit busy. The quote for JOB123 will be sent in the next 15 minutes. Thanks for your patience!", sender: "user", senderName: "Print Center (You)", timestamp: "25 mins ago", avatar: printCenterAvatar },
        ];
        if (ticketId === "TKT_PC002") return [
            { id: "pc2m1", text: "Hi Admin, my payout for July seems lower than expected. Can you clarify?", sender: "user", senderName: "Print Center (You)", timestamp: "11:00 AM", avatar: printCenterAvatar },
            { id: "pc2m2", text: "Hi Print Center, we'll review your July earnings statement and get back to you by EOD. Could you provide specific job IDs if you have concerns about particular ones?", sender: "admin", senderName: "Admin Support", timestamp: "11:15 AM", avatar: adminAvatar },
        ];
        if (ticketId === "TKT_PC003") return [
            { id: "pc3m1", text: "Dear Print Centers, there will be a short platform maintenance on July 30th from 2 AM to 3 AM. Services might be briefly unavailable.", sender: "admin", senderName: "Admin", timestamp: "2 hours ago", avatar: adminAvatar },
            { id: "pc3m2", text: "Noted, thank you for the heads up!", sender: "user", senderName: "Print Center (You)", timestamp: "1 hour ago", avatar: printCenterAvatar },
        ];
    }
    if (userRole === 'admin') {
         if (ticketId === "TKT_S001") return [ // Student query to admin
            { id: "adm_s1m1", text: "Hello, I'm having trouble submitting my task. It keeps giving an error.", sender: "student", senderName: "Student John Doe", timestamp: "10:30 AM", avatar: studentAvatar },
            { id: "adm_s1m2", text: "Hi John, thanks for reaching out. Can you tell me which task ID you're trying to submit and what error message you see?", sender: "user", senderName: "Admin (You)", timestamp: "10:31 AM", avatar: adminAvatar },
        ];
        if (ticketId === "TKT_V002") return [ // VA query to admin
            { id: "adm_v2m1", text: "Hi Admin, I haven't received my payment for July's tasks. My VA ID is VA002.", sender: "va", senderName: "VA Aisha B.", timestamp: "9:00 AM", avatar: vaAvatar },
            { id: "adm_v2m2", text: "Hi Aisha, we're processing VA payments today. You should see it reflected by end of day. We'll follow up if there are any issues.", sender: "user", senderName: "Admin (You)", timestamp: "9:15 AM", avatar: adminAvatar },
        ];
         if (ticketId === "TKT_A001") return [ // General feedback to admin
            { id: "adm_a1m1", text: "The new referral dashboard is great! Very easy to use.", sender: "student", senderName: "Student Jane Smith", timestamp: "Yesterday", avatar: studentAvatar },
            { id: "adm_a1m2", text: "Thanks for the feedback, Jane! We're glad you like it.", sender: "user", senderName: "Admin (You)", timestamp: "This morning", avatar: adminAvatar },
        ];
    }
    return [{ id: "fallback", text: `No messages found for ticket ${ticketId} or role ${userRole}. Select another ticket or create a new one.`, sender: "support", timestamp: "N/A", avatar: commonSupportAvatar }];
};


export function SupportChatInterface({ userRole }: { userRole: 'student' | 'va' | 'print-center' | 'admin' }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const initialTickets = 
    userRole === 'student' ? getMockStudentTickets() : 
    userRole === 'va' ? getMockVaTickets() : 
    userRole === 'print-center' ? getMockPrintCenterTickets() :
    userRole === 'admin' ? getMockAdminTickets() : [];

  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(
    initialTickets.find(t => t.category === 'new' && (t.from !== "You" && (userRole === 'admin' ? true : t.to === "You" || t.to?.includes("You"))))?.id || initialTickets.find(t => t.category === 'ongoing')?.id || initialTickets[0]?.id || null
  );
  
  const [isCreateTicketDialogOpen, setIsCreateTicketDialogOpen] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [studentQueryType, setStudentQueryType] = useState<string | undefined>();
  const [relevantTaskId, setRelevantTaskId] = useState("");
  const [vaQueryType, setVaQueryType] = useState<string | undefined>();
  const [printCenterQueryType, setPrintCenterQueryType] = useState<string | undefined>();
  const [adminRecipientType, setAdminRecipientType] = useState<string | undefined>();
  const [adminRecipientId, setAdminRecipientId] = useState("");
  const [relevantJobId, setRelevantJobId] = useState("");


  const { toast } = useToast();

  useEffect(() => {
    if (activeTicketId) {
        setMessages(getMockMessagesForTicket(activeTicketId, userRole));
    } else {
        setMessages([]);
    }
  }, [activeTicketId, userRole]);

  useEffect(() => {
    if (userRole === 'va' && typeof window !== 'undefined') {
        const contactTaskId = localStorage.getItem('stipsLiteContactStudentTaskId');
        const contactStudentName = localStorage.getItem('stipsLiteContactStudentName');

        if (contactTaskId && contactStudentName) {
            setIsCreateTicketDialogOpen(true);
            setNewTicketSubject(`Query re: Task ${contactTaskId} for Student ${contactStudentName}`);
            setVaQueryType('communication_to_student'); 
            localStorage.removeItem('stipsLiteContactStudentTaskId');
            localStorage.removeItem('stipsLiteContactStudentName');
        }
    } else if (userRole === 'print-center' && typeof window !== 'undefined') {
        const contactStudentJobId = localStorage.getItem('stipsLiteContactStudentJobId');
        const contactStudentNameForJob = localStorage.getItem('stipsLiteContactStudentNameForJob');

        if (contactStudentJobId && contactStudentNameForJob) {
            setIsCreateTicketDialogOpen(true);
            setNewTicketSubject(`Regarding Print Job ${contactStudentJobId} for Student ${contactStudentNameForJob}`);
            setPrintCenterQueryType('communication_to_student_job'); 
            localStorage.removeItem('stipsLiteContactStudentJobId');
            localStorage.removeItem('stipsLiteContactStudentNameForJob');
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]); 


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
      sender: "user", 
      senderName: userRole === 'student' ? "Student (You)" : userRole === 'va' ? "VA (You)" : userRole === 'print-center' ? "Print Center (You)" : "Admin (You)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "https://placehold.co/40x40.png?text=U"
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage("");

    // Simulate a reply
    setTimeout(() => {
      let replyText = "Thanks for your message. We are looking into it.";
      let replySender: Message['sender'] = "support";
      let replySenderName = "Support";
      let replyAvatar = "https://placehold.co/40x40.png?text=S";

      if (userRole === 'student') {
        if (currentTicket.to?.startsWith("VA")) {
            replyText = `Message received for ${currentTicket.to}. They will respond shortly.`;
            replySender = "va";
            replySenderName = currentTicket.to || "Assigned VA";
            replyAvatar = "https://placehold.co/40x40.png?text=VA";
        } else { 
            replyText = `An admin is reviewing your query for ticket ${activeTicketId}.`;
            replySender = "admin";
            replySenderName = "Admin Support";
            replyAvatar = "https://placehold.co/40x40.png?text=AD";
        }
      } else if (userRole === 'va') {
         if (currentTicket.to?.includes("Student")) {
            replyText = `Your reply to ${currentTicket.from} regarding task ${currentTicket.taskId || ''} has been sent.`;
            replySender = "support"; 
            replySenderName = "System";
         } else if (currentTicket.subject.startsWith("Query re: Task") && currentTicket.subject.includes("for Student")){ 
            replyText = `Your message for student regarding task ${currentTicket.taskId || 'ID_UNKNOWN'} has been noted (simulated send via Admin).`;
            replySender = "admin"; 
            replySenderName = "Admin Relay";
            replyAvatar = "https://placehold.co/40x40.png?text=AD";
         }
         else { 
            replyText = `Your message to Admin Support for ticket ${activeTicketId} has been received.`;
            replySender = "admin"; 
            replySenderName = "Admin Support";
            replyAvatar = "https://placehold.co/40x40.png?text=AD";
         }
      } else if (userRole === 'print-center') {
          if (currentTicket.to?.includes("Student")) { 
            replyText = `Your reply to ${currentTicket.from} regarding job ${currentTicket.jobId || ''} has been sent.`;
            replySender = "support"; 
            replySenderName = "System";
          } else if (currentTicket.subject.startsWith("Regarding Print Job") && currentTicket.subject.includes("for Student")) { 
             replyText = `Your message for student regarding job ${currentTicket.jobId || 'ID_UNKNOWN'} has been noted (simulated send via Admin).`;
            replySender = "admin"; 
            replySenderName = "Admin Relay";
            replyAvatar = "https://placehold.co/40x40.png?text=AD";
          } else { 
            replyText = `Your message to Admin Support for ticket ${activeTicketId} has been received.`;
            replySender = "admin"; 
            replySenderName = "Admin Support";
            replyAvatar = "https://placehold.co/40x40.png?text=AD";
          }
      } else if (userRole === 'admin') {
        const senderRole = currentTicket.from?.includes("Student") ? "student" : currentTicket.from?.includes("VA") ? "va" : currentTicket.from?.includes("PC") ? "print-center" : "user";
        replyText = `Your reply as Admin to ${currentTicket.from || 'User'} has been sent.`;
        replySender = senderRole;
        replySenderName = currentTicket.from || 'User';
        if (senderRole === "student") replyAvatar = "https://placehold.co/40x40.png?text=ST";
        else if (senderRole === "va") replyAvatar = "https://placehold.co/40x40.png?text=VA";
        else if (senderRole === "print-center") replyAvatar = "https://placehold.co/40x40.png?text=PC";
        else replyAvatar = "https://placehold.co/40x40.png?text=U";
      }


      const replyMsg: Message = {
        id: String(Date.now() + 1),
        text: replyText,
        sender: replySender,
        senderName: replySenderName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: replyAvatar,
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
    let ticketTaskId: string | undefined = undefined;
    let ticketJobId: string | undefined = undefined;


    if (userRole === 'student') {
        if (!studentQueryType) {
            toast({ title: "Query Type Required", description: "Please select a query type.", variant: "destructive"});
            return;
        }
        if (studentQueryType === "task_specific") {
            recipient = `VA for Task ${relevantTaskId || 'General VA Queue'}`; 
            toastMessage = `Your query about Task ${relevantTaskId || 'N/A'} has been sent to the assigned VA.`;
            ticketTaskId = relevantTaskId || undefined; 
        }
    } else if (userRole === 'va') { 
        if (!vaQueryType) {
            toast({ title: "Query Type Required", description: "Please select a query type for your ticket.", variant: "destructive"});
            return;
        }
        if (vaQueryType === 'communication_to_student') {
            const studentNameMatch = newTicketSubject.match(/for Student (.*?)(?:\)| re:|$)/);
            const taskIdMatch = newTicketSubject.match(/Task (\S+)/);
            const studentName = studentNameMatch ? studentNameMatch[1] : "Student";
            ticketTaskId = taskIdMatch ? taskIdMatch[1] : undefined;
            recipient = `Student ${studentName} (Task: ${ticketTaskId || 'N/A'}) via Admin`; 
            toastMessage = `Your message for Student ${studentName} regarding task ${ticketTaskId || 'N/A'} is being processed (simulated send via Admin).`;
        } else { 
            toastMessage = `Your ticket "${newTicketSubject}" regarding '${vaQueryType.replace(/_/g, ' ')}' has been sent to Admin Support.`;
        }
    } else if (userRole === 'print-center') {
        if (!printCenterQueryType) {
            toast({ title: "Query Type Required", description: "Please select a query type for your ticket.", variant: "destructive"});
            return;
        }
        if (printCenterQueryType === 'communication_to_student_job') {
            const studentNameMatch = newTicketSubject.match(/for Student (.*?)(?:\)| re:|$)/);
            const jobIdMatch = newTicketSubject.match(/Job (\S+)/);
            const studentName = studentNameMatch ? studentNameMatch[1] : "Student";
            ticketJobId = jobIdMatch ? jobIdMatch[1] : undefined;
            recipient = `Student ${studentName} (Job: ${ticketJobId || 'N/A'}) via Admin`;
            toastMessage = `Your message for Student ${studentName} regarding print job ${ticketJobId || 'N/A'} is being processed (simulated send via Admin).`;
        } else {
            toastMessage = `Your ticket "${newTicketSubject}" regarding '${printCenterQueryType.replace(/_/g, ' ')}' has been sent to Admin Support.`;
        }
    } else if (userRole === 'admin') {
        if (!adminRecipientType) {
            toast({ title: "Recipient Type Required", description: "Please select who this message is for.", variant: "destructive"});
            return;
        }
        if (adminRecipientType !== 'internal_platform_log' && !adminRecipientId.trim()) {
            toast({ title: "Recipient ID Required", description: `Please enter the ${adminRecipientType} ID.`, variant: "destructive"});
            return;
        }
        recipient = adminRecipientType === 'internal_platform_log' ? "Internal Log" : `${adminRecipientType.charAt(0).toUpperCase() + adminRecipientType.slice(1)} ${adminRecipientId}`;
        toastMessage = `Message "${newTicketSubject}" logged or sent to ${recipient}.`;
    }


    const newTicketId = `${userRole.substring(0,1).toUpperCase()}${String(Date.now()).slice(-5)}`;
    const newGeneratedTicket: Ticket = {
      id: newTicketId,
      subject: newTicketSubject,
      status: "New",
      lastUpdate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: "new",
      from: "You",
      to: recipient,
      taskId: ticketTaskId,
      jobId: ticketJobId,
    };
    setTickets(prevTickets => [newGeneratedTicket, ...prevTickets]);

    const initialUserMessage: Message = {
      id: String(Date.now()),
      text: newTicketMessage,
      sender: "user",
      senderName: userRole === 'student' ? "Student (You)" : userRole === 'va' ? "VA (You)" : userRole === 'print-center' ? "Print Center (You)" : "Admin (You)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: "https://placehold.co/40x40.png?text=U",
    };
     const firstReply: Message = {
      id: String(Date.now() + 1),
      text: `Thanks for creating ticket ${newTicketId}. We'll get back to you soon.`,
      sender: recipient.includes("Admin") || userRole === 'admin' && recipient !== "Internal Log" ? "admin" : "support",
      senderName: recipient.includes("Admin") || userRole === 'admin' && recipient !== "Internal Log" ? "Admin Support" : "System",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: recipient.includes("Admin") || userRole === 'admin' && recipient !== "Internal Log" ? "https://placehold.co/40x40.png?text=AD" : "https://placehold.co/40x40.png?text=S",
    };
    setMessages([initialUserMessage, firstReply]); 
    
    setActiveTicketId(newTicketId);
    setNewTicketSubject("");
    setNewTicketMessage("");
    setStudentQueryType(undefined);
    setRelevantTaskId("");
    setVaQueryType(undefined);
    setPrintCenterQueryType(undefined);
    setAdminRecipientType(undefined);
    setAdminRecipientId("");
    setRelevantJobId("");
    setIsCreateTicketDialogOpen(false);

    toast({
      title: "Support Ticket Created/Message Sent!",
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
                                {userRole === 'admin' ? "Send a message or log an issue." : "Describe your issue below." }
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
                                        <Label htmlFor="va-query-type">Query Type</Label>
                                        <Select onValueChange={setVaQueryType} value={vaQueryType}>
                                            <SelectTrigger id="va-query-type">
                                                <SelectValue placeholder="Select query type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="communication_to_student">Message to Student (re: Task)</SelectItem>
                                                <SelectItem value="platform_issue">Platform Issue (to Admin)</SelectItem>
                                                <SelectItem value="payment_query">Payment Query (to Admin)</SelectItem>
                                                <SelectItem value="student_interaction_admin">Issue with Student (to Admin)</SelectItem>
                                                <SelectItem value="task_clarification_admin">Task Clarification (Admin)</SelectItem>
                                                <SelectItem value="other_admin">Other (to Admin)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                {userRole === 'print-center' && (
                                     <div className="space-y-2">
                                        <Label htmlFor="pc-query-type">Query Type</Label>
                                        <Select onValueChange={setPrintCenterQueryType} value={printCenterQueryType}>
                                            <SelectTrigger id="pc-query-type">
                                                <SelectValue placeholder="Select query type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="communication_to_student_job">Message to Student (re: Print Job)</SelectItem>
                                                <SelectItem value="platform_issue_pc">Platform Issue (to Admin)</SelectItem>
                                                <SelectItem value="payment_query_pc">Shop Payout Query (to Admin)</SelectItem>
                                                <SelectItem value="student_dispute_pc">Student Dispute (to Admin)</SelectItem>
                                                <SelectItem value="other_admin_pc">Other (to Admin)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                 {userRole === 'print-center' && printCenterQueryType === 'communication_to_student_job' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="relevant-job-id">Relevant Print Job ID (Optional)</Label>
                                        <Input 
                                            id="relevant-job-id" 
                                            placeholder="e.g., JOB123" 
                                            value={relevantJobId}
                                            onChange={(e) => setRelevantJobId(e.target.value)}
                                        />
                                    </div>
                                )}
                                {userRole === 'admin' && (
                                    <>
                                    <div className="space-y-2">
                                        <Label htmlFor="admin-recipient-type">Message For / Log Type</Label>
                                        <Select onValueChange={setAdminRecipientType} value={adminRecipientType}>
                                            <SelectTrigger id="admin-recipient-type">
                                                <SelectValue placeholder="Select recipient type or log" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="student">Student</SelectItem>
                                                <SelectItem value="va">Virtual Assistant</SelectItem>
                                                <SelectItem value="print-center">Print Center</SelectItem>
                                                <SelectItem value="internal_platform_log">Internal Platform Log</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {adminRecipientType && adminRecipientType !== 'internal_platform_log' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="admin-recipient-id">Recipient {adminRecipientType?.charAt(0).toUpperCase() + adminRecipientType!.slice(1)} ID</Label>
                                            <Input 
                                                id="admin-recipient-id" 
                                                placeholder={`Enter ${adminRecipientType} ID (e.g., STD001, VA002)`}
                                                value={adminRecipientId}
                                                onChange={(e) => setAdminRecipientId(e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}
                                    </>
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

