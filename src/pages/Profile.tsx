import React, { useState, useEffect } from "react";
import { User, LogIn, LogOut, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ phone: "", password: "", name: "" });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: "" });

    const endpoint = isLogin ? "/api/login" : "/api/register";
    
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("token", data.token);
        // If name isn't returned in login, use phone or dummy
        const userData = { 
            name: data.name || formData.name || "User", 
            phone: formData.phone 
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setStatus({ type: 'success', msg: isLogin ? "Welcome back!" : "Account created successfully!" });
        
        // Trigger a custom event to update header/sidebar immediately
        window.dispatchEvent(new Event("storage"));
      } else {
        setStatus({ type: 'error', msg: data.error || "Authentication failed" });
      }
    } catch (error) {
      setStatus({ type: 'error', msg: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setFormData({ phone: "", password: "", name: "" });
    window.dispatchEvent(new Event("storage"));
  };

  if (user) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl text-primary font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-slate-500">{user.phone}</p>
              </div>
              
              <div className="w-full border-t border-slate-100 my-4"></div>
              
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500">Status</p>
                    <p className="font-semibold text-green-600 flex items-center justify-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Active
                    </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500">Member Since</p>
                    <p className="font-semibold text-slate-700">Feb 2024</p>
                </div>
              </div>

              <Button variant="destructive" onClick={handleLogout} className="w-full mt-4">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 text-center">
        {isLogin ? "Welcome Back" : "Create Account"}
      </h1>
      
      <Card>
        <CardHeader>
            <div className="flex justify-center space-x-1 bg-slate-100 p-1 rounded-xl mb-4">
                <button
                    onClick={() => { setIsLogin(true); setStatus({type:null, msg:""}); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                        isLogin ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Login
                </button>
                <button
                    onClick={() => { setIsLogin(false); setStatus({type:null, msg:""}); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                        !isLogin ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Register
                </button>
            </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="John Doe" 
                    required 
                />
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <Input 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="+91 98765 43210" 
                required 
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
                required 
              />
            </div>

            {status.msg && (
                <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                    status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                    {status.type === 'success' ? <CheckCircle className="h-4 w-4"/> : <AlertCircle className="h-4 w-4"/>}
                    {status.msg}
                </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : (isLogin ? "Login" : "Create Account")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
