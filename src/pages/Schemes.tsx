import React from "react";
import { GovtSchemes } from "../components/dashboard/GovtSchemes";

export const Schemes = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Government Schemes</h1>
      <GovtSchemes />
    </div>
  );
};
