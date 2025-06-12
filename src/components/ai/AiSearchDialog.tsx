// "use client";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Search, Sparkles, AlertTriangle, Copy } from "lucide-react";
import { internetSearch, InternetSearchInput, InternetSearchOutput } from "@/ai/flows/internet-search-flow"; // Updated import
import { printLocationSearch, PrintLocationSearchInput, PrintLocationSearchOutput } from "@/ai/flows/print-location-search";
import { useToast } from "@/hooks/use-toast";

type SearchResult = { id: string; title: string; description: string; type: 'internet-search' | 'print-location' }; // Updated type

export function AiSearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'internet-search' | 'print-locations'>("internet-search"); // Updated activeTab state and default
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setError(null);
    setResults([]);

    startTransition(async () => {
      try {
        if (activeTab === "internet-search") { // Updated tab check
          const input: InternetSearchInput = { query };
          const output: InternetSearchOutput = await internetSearch(input);
          const searchResults: SearchResult[] = [{
            id: 'internet-search-result-1',
            title: `AI Search Result for: "${query}"`,
            description: output.answer, // Use the AI's direct answer
            type: 'internet-search',
          }];
          setResults(searchResults);
        } else { // print-locations tab
          const input: PrintLocationSearchInput = { query };
          const output: PrintLocationSearchOutput = await printLocationSearch(input);
          const locationResults: SearchResult[] = output.results.map((name, index) => ({
            id: `${name.toLowerCase().replace(/\s+/g, '-')}-${index}`, 
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

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "The search result details have been copied.",
        });
      })
      .catch(err => {
        console.error("Failed to copy text: ", err);
        toast({
          title: "Copy failed",
          description: "Could not copy details to clipboard. Please try again.",
          variant: "destructive",
        });
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
            Use AI to search the internet or find print locations. Internet search can provide information on a wide range of topics.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-2 my-4">
          <Input
            id="ai-search-query"
            placeholder="e.g., 'history of renewable energy' or 'print shops near library'"
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

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "internet-search" | "print-locations")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="internet-search">Internet Search</TabsTrigger> {/* Updated tab label and value */}
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
                    <CardDescription className="text-xs pt-1">Type: {result.type === 'internet-search' ? 'Internet Search Result' : 'Print Location'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.description}</p>
                  </CardContent>
                  <CardFooter className="pt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCopy(result.type === 'internet-search' ? result.description : `${result.title}\n\nDescription:\n${result.description}`)}
                      className="w-full"
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copy {result.type === 'internet-search' ? 'Answer' : 'Details'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-auto pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
