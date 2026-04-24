import React from "react";
import { HospitalLocator } from "../components/dashboard/HospitalLocator";

export const Hospitals = () => {
  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <h1 className="text-2xl font-bold text-slate-900 flex-none">Hospital Locator</h1>
      <div className="flex-1 min-h-0">
        <HospitalLocator showList={true} />
      </div>
    </div>
  );
};
