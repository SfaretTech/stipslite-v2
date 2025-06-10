"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
}                               from "@/components/ui/dialog";
import { Input }                from "@/components/ui/input";
import { Label }                from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea }           from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, Sparkles, AlertTriangle } from "lucide-react";
import { taskSearch, TaskSearchInput, TaskSearchOutput } from "@/ai/flows/task-search";
import { printLocationSearch, PrintLocationSearchInput, PrintLocationSearchOutput } from "@/ai/flows/print-location-search";

type SearchResult = { id: string; title: string; description: string; type: 'task' | 'print-location' };

export function AiSearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tasks" | "print-locations">("tasks");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setError(null);
    setResults([]);

    startTransition(async () => {
      try {
        if (activeTab === "tasks") {
          const input: TaskSearchInput = { query };
          const output: TaskSearchOutput = await taskSearch(input);
          // Mock result details as the flow only returns IDs
          const taskResults: SearchResult[] = output.results.map((id, index) => ({
            id,
            title: `Task Result ${index + 1}: ${id}`,
            description: `This is a mock description for task ID ${id} based on your query: "${query}".`,
            type: 'task',
          }));
          setResults(taskResults);
        } else {
          const input: PrintLocationSearchInput = { query };
          const output: PrintLocationSearchOutput = await printLocationSearch(input);
          // Mock result details as the flow only returns names
          const locationResults: SearchResult[] = output.results.map((name, index) => ({
            id: name.toLowerCase().replace(/\s+/g, '-'), // generate an ID
            title: `Print Location: ${name}`,
            description: `Details for print location "${name}" found through AI search for query: "${query}".`,
            type: 'print-location',
          }));
          setResults(locationResults);
        }
      } catch (e) {
        console.error("AI Search Error:", e);
        setError("An error occurred during the search. Please try again.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Sparkles className="h-5 w-5" />
          <span className="sr-only">AI Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-primary" />
            AI Powered Search
          </DialogTitle>
          <DialogDescription>
            Find tasks or print locations using natural language.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-2 my-4">
          <Input
            id="ai-search-query"
            placeholder="e.g., 'urgent programming tasks' or 'print shops near main campus'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow"
            onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
          <Button onClick={handleSearch} disabled={isPending || !query.trim()}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="ml-2">Search</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "tasks" | "print-locations")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="print-locations">Print Locations</TabsTrigger>
          </TabsList>
        </Tabs>

        {error && (
          <div className="my-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2"/> {error}
          </div>
        )}

        <ScrollArea className="flex-grow min-h-[200px] border rounded-md p-1">
          {isPending && !results.length && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Searching...</p>
             </div>
          )}
          {!isPending && !results.length && !error && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Search className="h-12 w-12 mb-4 text-gray-300" />
                <p>Enter a query and click search to see results.</p>
             </div>
          )}
          {results.length > 0 && (
            <div className="space-y-3 p-3">
              {results.map((result) => (
                <Card key={result.id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{result.title}</CardTitle>
                    <CardDescription className="text-xs pt-1">Type: {result.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{result.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-auto pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
