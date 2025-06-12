
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";

interface VaSearchFilters {
  name?: string;
  skills?: string;
  specialization?: string;
}

interface VaSearchProps {
  onSearch: (filters: VaSearchFilters) => void;
}

export function VaSearch({ onSearch }: VaSearchProps) {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [specialization, setSpecialization] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch({ name, skills, specialization });
  };

  const handleClearFilters = () => {
    setName("");
    setSkills("");
    setSpecialization("");
    onSearch({});
  };

  return (
    <Card className="mb-8 shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} id="vaSearchForm" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="vaName">VA Name</Label>
              <Input 
                id="vaName" 
                name="vaName" 
                placeholder="e.g., Jane Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vaSkills">Skills</Label>
              <Input 
                id="vaSkills" 
                name="vaSkills" 
                placeholder="e.g., Writing, Research" 
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vaSpecialization">Specialization</Label>
              <Input 
                id="vaSpecialization" 
                name="vaSpecialization" 
                placeholder="e.g., Academic, Technical" 
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Search className="mr-2 h-4 w-4" /> Search VAs
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
