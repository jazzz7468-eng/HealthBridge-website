import React, { useState } from "react";
import { Pill, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

const medicines = [
  { name: "Paracetamol", category: "Fever", strength: "500mg" },
  { name: "Ibuprofen", category: "Pain", strength: "400mg" },
  { name: "Cetirizine", category: "Allergy", strength: "10mg" },
  { name: "Amoxicillin", category: "Antibiotic", strength: "500mg" },
  { name: "Aspirin", category: "Pain", strength: "75mg" },
  { name: "Azithromycin", category: "Antibiotic", strength: "500mg" },
  { name: "Loratadine", category: "Allergy", strength: "10mg" },
  { name: "Dextromethorphan", category: "Cold", strength: "10mg" },
];

export const MedicineDirectory = () => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filtered = medicines.filter(m => {
    const matchesFilter = filter === "All" || m.category === filter;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex-none">
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" />
          Medicine Directory
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        <div className="relative flex-none">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search medicines..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-none">
          {["All", "Pain", "Fever", "Cold", "Allergy", "Antibiotic"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                filter === f 
                  ? "bg-primary text-white shadow-sm" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-0">
          {filtered.length > 0 ? (
            filtered.map((med) => (
              <div key={med.name} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-primary-200 transition-colors">
                <div>
                  <p className="font-medium text-slate-900">{med.name}</p>
                  <p className="text-xs text-slate-500">{med.strength}</p>
                </div>
                <Badge variant="secondary" className="bg-white text-slate-600 border border-slate-200 shadow-sm">
                  {med.category}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              No medicines found matching your search.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
