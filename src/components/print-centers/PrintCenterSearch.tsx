
"use client";

import { useState } from "react"; // Added
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter } from "lucide-react"; // Removed MapPin as it's not used here

// New data structures
const topLevelRegionsData = [
  { value: "Nigeria", label: "Nigeria" },
  { value: "Kenya", label: "Kenya" },
  { value: "Ghana", label: "Ghana" },
  { value: "SouthAfrica", label: "South Africa" },
  { value: "Uganda", label: "Uganda" },
  { value: "Tanzania", label: "Tanzania" },
  // Add more representative countries for a broader "world" selection if needed
];

const subRegionData: Record<string, string[]> = {
  Nigeria: ["Lagos", "Abuja (FCT)", "Rivers", "Kano", "Oyo", "Kaduna", "Anambra", "Delta", "Edo", "Ogun", "Enugu", "Imo"],
  Kenya: [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
    "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
    "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
    "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River",
    "Tharaka Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
  ],
  Ghana: ["Greater Accra", "Ashanti", "Western", "Volta", "Eastern", "Central", "Northern", "Upper East", "Upper West"],
  SouthAfrica: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Limpopo", "Mpumalanga", "North West", "Free State", "Northern Cape"],
  Uganda: ["Central Region", "Eastern Region", "Northern Region", "Western Region"], // Uganda has Regions, then Districts
  Tanzania: ["Dar es Salaam", "Arusha", "Mwanza", "Zanzibar Urban/West", "Dodoma", "Kilimanjaro", "Tabora", "Morogoro"],
};


export function PrintCenterSearch({ onSearch }: { onSearch: (filters: any) => void }) {
  const [selectedTopLevel, setSelectedTopLevel] = useState<string | undefined>();
  const [currentSubRegions, setCurrentSubRegions] = useState<string[]>([]);
  const [selectedSubRegion, setSelectedSubRegion] = useState<string | undefined>();

  const handleTopLevelChange = (value: string) => {
    setSelectedTopLevel(value);
    setCurrentSubRegions(subRegionData[value] || []);
    setSelectedSubRegion(undefined); // Reset sub-region selection
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const filters = {
      countryOrRegion: formData.get('countryOrRegion'),
      stateOrSubRegion: formData.get('stateOrSubRegion'),
      locationName: formData.get('locationName'),
      shopName: formData.get('shopName'),
    };
    onSearch(filters);
  };

  const handleClearFilters = () => {
    setSelectedTopLevel(undefined);
    setCurrentSubRegions([]);
    setSelectedSubRegion(undefined);
    const form = document.getElementById("printCenterSearchForm") as HTMLFormElement;
    if (form) {
      form.reset();
    }
    onSearch({}); // Call onSearch with empty filters to reset list
  }

  return (
    <Card className="mb-8 shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} id="printCenterSearchForm" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="countryOrRegion">Country / Top-Level Region</Label>
              <Select 
                name="countryOrRegion"
                onValueChange={handleTopLevelChange}
                value={selectedTopLevel}
              >
                <SelectTrigger id="countryOrRegion">
                  <SelectValue placeholder="Select Country / Region" />
                </SelectTrigger>
                <SelectContent>
                  {topLevelRegionsData.map(region => (
                    <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stateOrSubRegion">State / County / Sub-Region</Label>
              <Select 
                name="stateOrSubRegion"
                disabled={!selectedTopLevel || currentSubRegions.length === 0}
                value={selectedSubRegion}
                onValueChange={setSelectedSubRegion}
              >
                <SelectTrigger id="stateOrSubRegion">
                  <SelectValue placeholder="Select State / Sub-Region" />
                </SelectTrigger>
                <SelectContent>
                  {currentSubRegions.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="locationName">Specific Location / Town</Label>
              <Input id="locationName" name="locationName" placeholder="e.g., Ikeja, Nairobi CBD" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shopName">Shop Center Name</Label>
              <Input id="shopName" name="shopName" placeholder="e.g., STIPS Prints" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClearFilters}>
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
