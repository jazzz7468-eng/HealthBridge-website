import React, { useEffect, useState } from "react";
import { QuickSchedule } from "../components/dashboard/QuickSchedule";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Calendar, Clock, User, FileText } from "lucide-react";

export const Appointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(data.appointments || []);
      } else {
        setError(data.error || "Failed to fetch appointments");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    
    // Listen for new appointment created event from QuickSchedule
    const handleNewAppointment = () => {
        fetchAppointments();
    };
    window.addEventListener('notification', handleNewAppointment); // Re-fetch on any notification (simpler)
    
    return () => window.removeEventListener('notification', handleNewAppointment);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: List of Appointments */}
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-700">Upcoming Appointments</h2>
            
            {loading ? (
                <div className="text-slate-500">Loading appointments...</div>
            ) : error ? (
                <div className="text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>
            ) : appointments.length === 0 ? (
                <Card>
                    <CardContent className="py-8 text-center text-slate-500">
                        No appointments scheduled yet.
                    </CardContent>
                </Card>
            ) : (
                appointments.map((appt) => (
                    <Card key={appt.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                {appt.doctor}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Calendar className="h-4 w-4" />
                                <span>{appt.time}</span>
                            </div>
                            {appt.notes && (
                                <div className="flex items-start gap-2 text-slate-500 bg-slate-50 p-2 rounded">
                                    <FileText className="h-4 w-4 mt-0.5" />
                                    <p>{appt.notes}</p>
                                </div>
                            )}
                            {appt.created_at && (
                                <div className="text-xs text-slate-400 mt-2 text-right">
                                    Booked on: {new Date(appt.created_at).toLocaleDateString()}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>

        {/* Right Column: Quick Schedule Form */}
        <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Book New Appointment</h2>
            <QuickSchedule />
        </div>
      </div>
    </div>
  );
};
