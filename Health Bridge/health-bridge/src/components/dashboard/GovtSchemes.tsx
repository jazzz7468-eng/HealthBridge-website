import React from "react";
import { Landmark, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

const schemes = [
  {
    name: "Ayushman Bharat",
    description: "National Health Protection Scheme providing coverage up to 5 lakh per family per year.",
    tags: ["Insurance", "Central Govt"],
  },
  {
    name: "ASHA Program",
    description: "Accredited Social Health Activist program for community health support.",
    tags: ["Community", "Support"],
  },
  {
    name: "Janani Suraksha Yojana",
    description: "Safe motherhood intervention under the National Rural Health Mission.",
    tags: ["Maternity", "Financial Aid"],
  },
];

export const GovtSchemes = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-primary" />
          Govt Schemes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {schemes.map((scheme, index) => (
          <div key={index} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-3 text-left font-medium text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {scheme.name}
              {openIndex === index ? (
                <ChevronUp className="h-4 w-4 text-slate-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-500" />
              )}
            </button>
            {openIndex === index && (
              <div className="p-3 pt-0 text-sm text-slate-600 bg-slate-50 border-t border-slate-100">
                <p className="mb-2">{scheme.description}</p>
                <div className="flex gap-2">
                  {scheme.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs bg-white">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
