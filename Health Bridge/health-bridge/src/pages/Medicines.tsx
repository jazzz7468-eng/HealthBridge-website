import React from "react";
import { MedicineDirectory } from "../components/dashboard/MedicineDirectory";

export const Medicines = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Medicine Database</h1>
      <MedicineDirectory />
    </div>
  );
};
