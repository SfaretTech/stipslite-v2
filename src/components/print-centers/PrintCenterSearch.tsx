"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, MapPin } from "lucide-react";

// Mock data for filters
const counties = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"];
const statesOrRegions = { // Assuming states are within counties for this example
  Nairobi: ["Westlands", "CBD", "Kilimani", "Ngong Road"],
  Mombasa: ["Nyali", "Town Center", "Likoni"],
  // ... and so on
};


export function PrintCenterSearch({ onSearch }: { onSearch: (filters: any) => void }) {
  // In a real app, these would be managed with useState and passed to onSearch
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const filters = {
      county: formData.get('county'),
      state: formData.get('state'),
      locationName: formData.get('locationName'),
      shopName: formData.get('shopName'),
    };
    onSearch(filters); // Placeholder for actual search logic
  };


  return (
    <Card className="mb-8 shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="county">County</Label>
              <Select name="county">
                <SelectTrigger id="county">
                  <SelectValue placeholder="Select County" />
                </SelectTrigger>
                <SelectContent>
                  {counties.map(county => <SelectItem key={county} value={county}>{county}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State/Region</Label>
              <Select name="state">
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select State/Region" />
                </SelectTrigger>
                <SelectContent>
                  {/* Dynamically populate based on selected county if needed */}
                  {statesOrRegions.Nairobi.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="locationName">Location Name</Label>
              <Input id="locationName" name="locationName" placeholder="e.g., Moi Avenue" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shopName">Shop Center Name</Label>
              <Input id="shopName" name="shopName" placeholder="e.g., XYZ Prints" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Search className="mr-2 h-4 w-4" /> Search Print Centers
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
