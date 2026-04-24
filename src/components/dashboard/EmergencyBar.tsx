import React, { useState } from "react";
import { Siren, Wifi, X, Phone } from "lucide-react";
import { Button } from "../ui/button";

export const EmergencyBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportStatus, setReportStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [responseLog, setResponseLog] = useState<string[]>([]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportStatus("sending");
    setResponseLog([]);

    try {
      // Simulate getting location
      const location = await Promise.race([
        new Promise<{lat: number, lng: number}>((resolve, reject) => {
          if (!navigator.geolocation) {
            resolve({ lat: 0, lng: 0 });
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => { console.warn("Geo Error:", err); resolve({ lat: 0, lng: 0 }); }
          );
        }),
        new Promise<{lat: number, lng: number}>((resolve) => setTimeout(() => resolve({ lat: 0, lng: 0 }), 5000))
      ]);

      const type = (e.target as any).querySelector('select').value;
      const details = (e.target as any).querySelector('textarea').value;

      const res = await fetch('/api/emergency-report', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          type,
          details,
          location: `${location.lat}, ${location.lng}`
        })
      });

      const data = await res.json();
      
      if (data.status === 'reported') {
        setResponseLog(data.transport_log || []);
        setReportStatus("sent");
        setTimeout(() => {
          setIsModalOpen(false);
          setReportStatus("idle");
        }, 5000); // Increased timeout to read logs
      } else {
        throw new Error("Report failed");
      }
      
    } catch (error) {
      console.error(error);
      setReportStatus("error");
    }
  };

  return (
    <>
      <div className="w-full rounded-2xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200 p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <Siren className="h-6 w-6 relative z-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-900">Emergency Assistance Required?</h3>
            <p className="text-sm text-red-700">Immediate help via hybrid connectivity (Nostr + Mesh)</p>
          </div>
        </div>
        
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="lg"
                className="hidden md:flex border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => window.location.href = "tel:112"}
            >
                <Phone className="mr-2 h-4 w-4" /> Call 112
            </Button>
            <Button 
            variant="destructive" 
            size="lg" 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto text-base px-8 h-12 shadow-lg hover:shadow-xl bg-red-600 hover:bg-red-700 transition-all transform hover:-translate-y-0.5 animate-pulse"
            >
            <Wifi className="mr-2 h-5 w-5" />
            Request Emergency Assistance
            </Button>
        </div>
      </div>

      {/* Emergency Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-red-600 p-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Siren className="h-5 w-5" /> Emergency Report
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {reportStatus === "idle" && (
                <form onSubmit={handleRequest} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <a href="tel:102" className="flex flex-col items-center justify-center p-3 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-colors">
                        <span className="text-xl font-bold text-red-600">102</span>
                        <span className="text-xs text-red-400">Ambulance</span>
                    </a>
                    <a href="tel:108" className="flex flex-col items-center justify-center p-3 bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-colors">
                        <span className="text-xl font-bold text-red-600">108</span>
                        <span className="text-xs text-red-400">Emergency</span>
                    </a>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Type</label>
                    <select className="w-full rounded-lg border-slate-300 p-2.5 text-sm bg-slate-50 border focus:ring-2 focus:ring-red-500 outline-none">
                      <option value="severe">Severe Injury / Bleeding</option>
                      <option value="chest">Chest Pain / Heart Attack</option>
                      <option value="breathing">Breathing Difficulty</option>
                      <option value="unconscious">Unconscious</option>
                      <option value="accident">Road Accident</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Details (Optional)</label>
                    <textarea 
                      rows={3}
                      className="w-full rounded-lg border-slate-300 p-2.5 text-sm bg-slate-50 border focus:ring-2 focus:ring-red-500 outline-none resize-none"
                      placeholder="Describe the situation briefly..."
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 flex gap-2">
                    <Wifi className="h-4 w-4 shrink-0" />
                    <p>Your location and status will be broadcasted to nearby responders via Internet, Nostr, and Mesh networks.</p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    SEND EMERGENCY ALERT
                  </Button>
                </form>
              )}

              {reportStatus === "sending" && (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <div className="relative h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Broadcasting Alert...</h3>
                    <p className="text-slate-500 text-sm">Connecting to Mesh & Nostr Relays</p>
                  </div>
                </div>
              )}

              {reportStatus === "sent" && (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4 animate-in fade-in zoom-in">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                    <Wifi className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Alert Sent Successfully!</h3>
                    <p className="text-slate-600 text-sm mt-1">Responders have been notified of your location.</p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-lg p-3 text-xs text-slate-500 text-left space-y-1 mt-4">
                    <p className="font-semibold mb-1">Transmission Log:</p>
                    {responseLog.length > 0 ? (
                      responseLog.map((log, i) => (
                        <p key={i} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                          {log}
                        </p>
                      ))
                    ) : (
                      <p>Waiting for transport logs...</p>
                    )}
                  </div>
                </div>
              )}

              {reportStatus === "error" && (
                <div className="text-center py-6">
                  <p className="text-red-600 font-medium mb-4">Failed to send alert. Please try again or call 112.</p>
                  <Button onClick={() => setReportStatus("idle")} variant="outline">Try Again</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
