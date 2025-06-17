
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, Sparkles, AlertTriangle, User, Bot } from "lucide-react";
import { internetSearch, InternetSearchInput, InternetSearchOutput } from "@/ai/flows/internet-search-flow";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

const AZUMA_AI_WELCOME_MESSAGE: ChatMessage = {
  id: "azuma-welcome",
  sender: "ai",
  text: "Hello! I'm AZUMA AI, your friendly assistant. How can I help you today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export function AiSearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [conversationHistory]);

  useEffect(() => {
    if (isOpen && conversationHistory.length === 0) {
      setConversationHistory([AZUMA_AI_WELCOME_MESSAGE]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Only re-run if isOpen changes

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    setError(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: currentMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setConversationHistory(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage("");

    startTransition(async () => {
      try {
        const input: InternetSearchInput = { query: messageToSend };
        const output: InternetSearchOutput = await internetSearch(input);
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: output.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setConversationHistory(prev => [...prev, aiMessage]);

      } catch (e) {
        console.error("AI Chat Error:", e);
        setError("An error occurred while getting a response. Please try again.");
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setConversationHistory(prev => [...prev, errorMessage]);
      }
    });
  };
  
  const handleOpenChange = (openState: boolean) => {
    setIsOpen(openState);
    if (!openState) {
      // Optionally reset more state when dialog closes, or just clear error.
      // For now, conversation history persists across closes within the same session.
      // setError(null); 
    } else if (openState && conversationHistory.length === 0) {
      // If opening and history is empty (e.g. first open or cleared history)
      setConversationHistory([AZUMA_AI_WELCOME_MESSAGE]);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Sparkles className="h-5 w-5" />
          <span className="sr-only">AZUMA AI Chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-primary" />
            AZUMA AI
          </DialogTitle>
          <DialogDescription>
            Ask questions and get informative responses from AZUMA AI.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow min-h-[200px] p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {conversationHistory.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex items-end space-x-2 group", 
                  msg.sender === "user" ? "justify-end" : ""
                )}
              >
                {msg.sender === "ai" && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src="https://placehold.co/40x40.png?text=AZ" alt="AZUMA AI Avatar" data-ai-hint="robot ai avatar" />
                    <AvatarFallback><Bot size={18}/></AvatarFallback>
                  </Avatar>
                )}
                <div 
                  className={cn(
                    "max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm",
                    msg.sender === "user" ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={cn("text-xs mt-1", msg.sender === "user" ? "text-primary-foreground/70 text-right" : "text-muted-foreground/80")}>
                    {msg.timestamp}
                  </p>
                </div>
                {msg.sender === "user" && (
                  <Avatar className="h-8 w-8 border">
                     <AvatarImage src="https://placehold.co/40x40.png?text=U" alt="User Avatar" data-ai-hint="person avatar" />
                    <AvatarFallback><User size={18}/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isPending && conversationHistory.some(m => m.sender === 'user' && m.id !== AZUMA_AI_WELCOME_MESSAGE.id) && (
              <div className="flex items-end space-x-2">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="https://placehold.co/40x40.png?text=AZ" alt="AZUMA AI Avatar" data-ai-hint="robot ai avatar" />
                  <AvatarFallback><Bot size={18}/></AvatarFallback>
                </Avatar>
                <div className="max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm bg-muted text-foreground rounded-bl-none">
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {error && (
          <div className="p-4 border-t">
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2"/> {error}
            </div>
          </div>
        )}

        <DialogFooter className="p-4 border-t bg-background">
          <div className="flex w-full gap-2 items-center">
            <Input
              id="ai-chat-message"
              placeholder="Type your message to AZUMA AI..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="flex-grow"
              onKeyPress={(e) => { if (e.key === 'Enter' && !isPending) handleSendMessage(); }}
              disabled={isPending}
            />
            <Button onClick={handleSendMessage} disabled={isPending || !currentMessage.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="ml-2 sr-only sm:not-sr-only">Send</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

