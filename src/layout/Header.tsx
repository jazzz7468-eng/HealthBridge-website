import React, { useState, useEffect } from "react";
import { Bell, Search, Wifi, Globe, LogIn, WifiOff, PhoneCall } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [networkStatus, setNetworkStatus] = useState({
    nostr: { connected: false, relays: 0 },
    mesh: { active: false, peers: 0 }
  });
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const res = await fetch('/api/network-status');
        if (res.ok) {
          const data = await res.json();
          setNetworkStatus(data);
        }
      } catch (error) {
        console.error("Network check failed:", error);
      }
    };

    // Check immediately and then every 10 seconds
    checkNetwork();
    const interval = setInterval(checkNetwork, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      // Listen for custom notification events
      const handleNotification = (e: Event) => {
          const detail = (e as CustomEvent).detail;
          setNotifications(prev => [detail.message, ...prev]);
          // Auto-show notifications for a few seconds
          setShowNotifications(true);
          setTimeout(() => setShowNotifications(false), 5000);
      };

      window.addEventListener('notification', handleNotification);
      return () => window.removeEventListener('notification', handleNotification);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (query.includes("hospital") || query.includes("doctor")) {
        navigate("/hospitals");
      } else if (query.includes("medicine") || query.includes("drug") || query.includes("pill")) {
        navigate("/medicines");
      } else if (query.includes("scheme") || query.includes("govt")) {
        navigate("/schemes");
      } else {
        alert(`Searching for: ${searchQuery}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4 flex-1">
        <form onSubmit={handleSearch} className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for doctors, medicines, or hospitals..."
            className="pl-10 bg-slate-50 border-transparent focus:bg-white focus:border-primary"
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        {/* Connectivity Status */}
        <div className="hidden lg:flex items-center gap-3 mr-4">
          {/* Nostr Status */}
          <div className={`flex items-center gap-2 rounded-full px-3 py-1 border transition-colors ${
            networkStatus.nostr.connected 
              ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}>
            <div className="relative flex h-2.5 w-2.5">
              {networkStatus.nostr.connected && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                networkStatus.nostr.connected ? "bg-emerald-500" : "bg-slate-400"
              }`}></span>
            </div>
            <span className="text-xs font-medium flex items-center gap-1">
              <Globe className="h-3 w-3" /> 
              {networkStatus.nostr.connected 
                ? `Nostr: ${networkStatus.nostr.relays} Relays` 
                : "Nostr Offline"}
            </span>
          </div>

          {/* Mesh Status */}
          <div className={`flex items-center gap-2 rounded-full px-3 py-1 border transition-colors ${
            networkStatus.mesh.active 
              ? "bg-blue-50 border-blue-100 text-blue-700" 
              : "bg-slate-50 border-slate-200 text-slate-500"
          }`}>
            <div className="relative flex h-2.5 w-2.5">
              {networkStatus.mesh.active && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                networkStatus.mesh.active ? "bg-blue-500" : "bg-slate-400"
              }`}></span>
            </div>
            <span className="text-xs font-medium flex items-center gap-1">
              {networkStatus.mesh.active ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {networkStatus.mesh.active 
                ? `Mesh: ${networkStatus.mesh.peers} Peers` 
                : "Mesh Inactive"}
            </span>
          </div>
        </div>

        <div className="relative">
            <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-slate-500 hover:text-primary"
                onClick={() => setShowNotifications(!showNotifications)}
            >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-urgent border border-white"></span>
                )}
            </Button>
            
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="p-3 border-b border-slate-100 font-semibold text-sm">Notifications</div>
                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((n, i) => (
                                <div key={i} className="p-3 text-sm text-slate-600 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                                    {n}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs text-slate-400">No new notifications</div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {user ? (
            <Button 
                variant="destructive" 
                className="gap-2 hidden sm:flex animate-pulse font-bold"
                onClick={() => window.open('tel:108', '_self')}
            >
                <PhoneCall className="h-4 w-4" />
                SOS: Call Ambulance (108)
            </Button>
        ) : (
            <Button 
                variant="default" 
                className="gap-2 hidden sm:flex"
                onClick={() => navigate('/profile')}
            >
                <LogIn className="h-4 w-4" />
                Login / Register
            </Button>
        )}
      </div>
    </header>
  );
};
