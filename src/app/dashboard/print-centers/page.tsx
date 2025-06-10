"use client"; // Required because PrintCenterSearch and List will have client interactions

import { PageHeader } from "@/components/shared/PageHeader";
import { PrintCenterSearch } from "@/components/print-centers/PrintCenterSearch";
import { PrintCenterList } from "@/components/print-centers/PrintCenterList";
import { Printer } from "lucide-react";
import { useState } from "react";

export default function PrintCentersPage() {
  const [searchFilters, setSearchFilters] = useState({});

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
    // Here you would typically fetch data based on filters
    console.log("Searching with filters:", filters);
  };

  return (
    <div>
      <PageHeader 
        title="Print Center Directory"
        description="Find printing services near you. Search by county, state, location, or shop name."
        icon={Printer}
      />
      <PrintCenterSearch onSearch={handleSearch} />
      <PrintCenterList filters={searchFilters} />
    </div>
  );
}
