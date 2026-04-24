import React from "react";
import { EmergencyBar } from "../components/dashboard/EmergencyBar";
import { HealthRiskAssessment } from "../components/dashboard/HealthRiskAssessment";
import { AIHealthAssistant } from "../components/dashboard/AIHealthAssistant";
import { HospitalLocator } from "../components/dashboard/HospitalLocator";
import { MedicineDirectory } from "../components/dashboard/MedicineDirectory";
import { CommunicationHub } from "../components/dashboard/CommunicationHub";
import { GovtSchemes } from "../components/dashboard/GovtSchemes";
import { QuickSchedule } from "../components/dashboard/QuickSchedule";

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Zone A: Emergency Bar */}
      <EmergencyBar />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Zone B: Left Column - Diagnostics & Health */}
        <div className="space-y-6 flex flex-col">
          <div className="flex-none">
            <HealthRiskAssessment />
          </div>
          <div className="flex-1 min-h-[400px]">
            <AIHealthAssistant />
          </div>
        </div>

        {/* Zone C: Middle Column - Resources */}
        <div className="space-y-6 flex flex-col">
          <div className="flex-none h-[300px]">
            <HospitalLocator />
          </div>
          <div className="flex-1 min-h-[400px]">
            <MedicineDirectory />
          </div>
        </div>

        {/* Zone D: Right Column - Admin & Tools */}
        <div className="space-y-6 flex flex-col">
          <div className="flex-none">
            <CommunicationHub />
          </div>
          <div className="flex-none">
            <GovtSchemes />
          </div>
          <div className="flex-none">
            <QuickSchedule />
          </div>
        </div>
      </div>
    </div>
  );
};
