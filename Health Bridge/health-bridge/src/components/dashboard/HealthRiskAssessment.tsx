import React from "react";
import { useForm } from "react-hook-form";
import { Activity, Thermometer, Wind, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

export const HealthRiskAssessment = () => {
  const { register, handleSubmit } = useForm();
  const [risk, setRisk] = React.useState<{ level: string; score: number } | null>(null);

  const onSubmit = (data: any) => {
    // Mock calculation
    const score = Math.floor(Math.random() * 100);
    let level = "Low";
    if (score > 30) level = "Medium";
    if (score > 70) level = "High";
    if (score > 90) level = "Critical";
    setRisk({ level, score });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Health Risk Assessment
        </CardTitle>
        <CardDescription>Enter vital signs to check risk level</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <User className="h-3 w-3" /> Age
              </label>
              <Input type="number" placeholder="Years" {...register("age")} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Thermometer className="h-3 w-3" /> Temp (°C)
              </label>
              <Input type="number" step="0.1" placeholder="37.0" {...register("temperature")} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Wind className="h-3 w-3" /> SpO2 (%)
              </label>
              <Input type="number" placeholder="98" {...register("spo2")} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Symptoms</label>
            <div className="grid grid-cols-2 gap-2">
              {["Cough", "Fever", "Breathlessness", "Fatigue"].map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input type="checkbox" value={s} {...register("symptoms")} className="rounded border-slate-300 text-primary focus:ring-primary" />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full mt-2">
            Calculate Risk
          </Button>

          {risk && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
              <span className="text-sm font-medium text-slate-700">Result:</span>
              <Badge variant={risk.level === "Critical" ? "destructive" : risk.level === "High" ? "destructive" : risk.level === "Medium" ? "warning" : "success"}>
                {risk.level} Risk ({risk.score}%)
              </Badge>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
