import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MapPin, Pill, Landmark, Calendar, User, LogOut } from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: MapPin, label: "Find Hospitals", path: "/hospitals" },
  { icon: Pill, label: "Medicine Database", path: "/medicines" },
  { icon: Landmark, label: "Govt Schemes", path: "/schemes" },
  { icon: Calendar, label: "My Appointments", path: "/appointments" },
];

export const Sidebar = () => {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  const checkUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white transition-transform">
      <div className="flex h-16 items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <span className="text-lg">+</span>
          </div>
          Health Bridge
        </div>
      </div>

      <div className="flex flex-col justify-between h-[calc(100vh-4rem)] p-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 pt-4">
          <Link 
            to="/profile"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-slate-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 overflow-hidden">
               {user ? (
                 <div className="bg-primary/10 text-primary w-full h-full flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                 </div>
               ) : (
                 <User className="h-5 w-5" />
               )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user ? user.name : "Guest User"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user ? "View Profile" : "Login / Register"}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
};
