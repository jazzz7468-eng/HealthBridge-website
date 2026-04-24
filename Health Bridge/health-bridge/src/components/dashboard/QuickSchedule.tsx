import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const QuickSchedule = () => {
  const [formData, setFormData] = useState({
    doctor: "Dr. Sarah Smith (Cardiology)",
    date: "",
    time: "",
    notes: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
        setErrorMessage("Please log in to book an appointment.");
        setStatus("error");
        return;
    }

    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      // Handle non-JSON responses (like 404 or 500 HTML pages)
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server error: Endpoint not found or server is down.");
      }

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        // Trigger notification update
        window.dispatchEvent(new CustomEvent("notification", { 
            detail: { type: "appointment", message: `Appointment booked with ${formData.doctor}` }
        }));
        
        setTimeout(() => {
            setStatus("idle");
            setFormData(prev => ({ ...prev, date: "", time: "", notes: "" }));
        }, 3000);
      } else {
        throw new Error(data.error || "Booking failed");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Network error. Please check your connection.");
      setStatus("error");
    }
  };

  if (status === "success") {
      return (
        <Card className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle className="h-8 w-8" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-900">Appointment Booked!</h3>
                <p className="text-sm text-slate-500">You will receive a confirmation shortly.</p>
            </div>
        </Card>
      );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Quick Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Doctor</label>
            <select 
                className="flex h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                value={formData.doctor}
                onChange={(e) => setFormData({...formData, doctor: e.target.value})}
            >
                <option>Dr. Sarah Smith (Cardiology)</option>
                <option>Dr. John Doe (General)</option>
                <option>Dr. Emily Chen (Pediatrics)</option>
            </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">Date</label>
                <div className="relative">
                <Input 
                    type="date" 
                    className="pl-3" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500">Time</label>
                <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input 
                    type="time" 
                    className="pl-9" 
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
                </div>
            </div>
            </div>

            <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Notes</label>
            <textarea 
                className="flex min-h-[80px] w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Reason for visit..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
            </div>

            <Button className="w-full" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Booking..." : "Book Appointment"}
            </Button>
            
            {status === "error" && (
                <p className="text-xs text-red-500 text-center font-medium bg-red-50 p-2 rounded-lg">
                    {errorMessage}
                </p>
            )}
        </form>
      </CardContent>
    </Card>
  );
};
