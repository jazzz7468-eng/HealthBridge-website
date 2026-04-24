import React, { useState } from "react";
import { Video, MessageCircle, MessageSquare, X, Send, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const CommunicationHub = () => {
  const [modalType, setModalType] = useState<"sms" | "whatsapp" | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "simulated" | "error">("idle");

  const handleVideoCall = () => {
    const room = 'health-bridge-' + Math.floor(Date.now()/1000);
    window.open('https://meet.jit.si/' + room, '_blank');
  };

  const handleMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    const target = e.target as any;
    const to = target.to.value;
    const text = target.text.value;
    const endpoint = modalType === 'whatsapp' ? '/api/send-whatsapp' : '/api/send-sms';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ to, text })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (data.status === 'simulated') {
            setStatus("simulated");
        } else {
            setStatus("sent");
        }
        
        setTimeout(() => {
          setStatus("idle");
          setModalType(null);
        }, 3000);
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <Card className="h-full relative">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Communication Hub
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Button 
          size="lg" 
          onClick={handleVideoCall}
          className="w-full justify-start gap-3 bg-blue-600 hover:bg-blue-700 h-14 rounded-xl shadow-md transition-transform hover:-translate-y-0.5"
        >
          <div className="bg-white/20 p-2 rounded-lg">
            <Video className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-white">Secure Video Call</div>
            <div className="text-xs text-blue-100 font-normal">Connect with a doctor instantly</div>
          </div>
        </Button>
        
        <Button 
          size="lg" 
          onClick={() => setModalType("whatsapp")}
          className="w-full justify-start gap-3 bg-green-600 hover:bg-green-700 h-14 rounded-xl shadow-md transition-transform hover:-translate-y-0.5"
        >
          <div className="bg-white/20 p-2 rounded-lg">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-white">WhatsApp</div>
            <div className="text-xs text-green-100 font-normal">Chat with support</div>
          </div>
        </Button>
        
        <Button 
          size="lg" 
          onClick={() => setModalType("sms")}
          className="w-full justify-start gap-3 bg-slate-600 hover:bg-slate-700 h-14 rounded-xl shadow-md transition-transform hover:-translate-y-0.5"
        >
          <div className="bg-white/20 p-2 rounded-lg">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-white">SMS</div>
            <div className="text-xs text-slate-200 font-normal">Send offline alert</div>
          </div>
        </Button>
      </CardContent>

      {/* Message Modal */}
      {modalType && (
        <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg capitalize flex items-center gap-2">
                {modalType === 'whatsapp' ? <MessageCircle className="text-green-600"/> : <MessageSquare className="text-slate-600"/>}
                Send {modalType}
              </h3>
              <Button size="icon" variant="ghost" onClick={() => setModalType(null)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {status === 'sent' && (
              <div className="text-center py-8 text-green-600 font-medium">
                ✓ Message Sent Successfully!
              </div>
            )}
            
            {status === 'simulated' && (
              <div className="text-center py-6">
                <div className="flex justify-center mb-2">
                    <AlertTriangle className="h-10 w-10 text-yellow-500" />
                </div>
                <h4 className="font-bold text-slate-800">Simulation Mode</h4>
                <p className="text-sm text-slate-600 mt-1 mb-4">
                  Backend API keys are missing. Message logged but not actually sent.
                </p>
                <div className="bg-slate-100 p-2 rounded text-xs text-slate-500 font-mono text-left mx-auto max-w-[200px]">
                  To: ...{((document.querySelector('input[name="to"]') as HTMLInputElement)?.value || '').slice(-4)}<br/>
                  Status: Simulated
                </div>
              </div>
            )}

            {(status === 'idle' || status === 'sending' || status === 'error') && (
              <form onSubmit={handleMessage} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-500">Recipient Number</label>
                  <Input name="to" placeholder="+1234567890" required className="bg-white" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Message</label>
                  <Input name="text" placeholder="Type your message..." required className="bg-white" />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending...' : (
                    <>
                      <Send className="h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
                {status === 'error' && <p className="text-xs text-red-500 text-center">Failed to send. Try again.</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
