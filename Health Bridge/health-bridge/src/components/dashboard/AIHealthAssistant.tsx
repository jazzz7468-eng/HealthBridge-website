import React from "react";
import { Send, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const AIHealthAssistant = () => {
  const [messages, setMessages] = React.useState([
    { role: "bot", text: "Hello! I'm your AI health assistant. How can I help you today?" },
  ]);
  const [input, setInput] = React.useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "I understand. Please consult a doctor for accurate diagnosis." },
      ]);
    }, 1000);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex-none">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Health Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-xl min-h-0">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 flex-none">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} className="rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
