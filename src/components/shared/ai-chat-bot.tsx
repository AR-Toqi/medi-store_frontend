/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Minimize2, 
  Maximize2,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiService } from "@/services/ai.service";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "bot";
  content: string;
}

export function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! I'm your Medistore AI assistant. How can I help you today? I can find medicines, check prices, or explain health products for you!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      // Map history for the API
      const history = messages.map(m => ({
        role: m.role === "bot" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const botResponse = await aiService.chat(userMsg, history);
      setMessages(prev => [...prev, { role: "bot", content: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "bot", content: "Hello again! How can I help you now?" }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div 
          className={cn(
            "bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 flex flex-col transition-all duration-500 ease-in-out mb-4 overflow-hidden",
            isMinimized ? "h-17.5 w-75" : "h-150 w-100 max-w-[calc(100vw-48px)]"
          )}
        >
          {/* Header */}
          <div className="p-4 bg-linear-to-r from-[#00bc8c] to-[#00d4a1] text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-tighter">Medistore AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Always Online</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50 dark:bg-slate-950/50 scroll-smooth"
              >
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      msg.role === "user" ? "bg-slate-200 dark:bg-slate-700" : "bg-[#00bc8c] text-white"
                    )}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-slate-500 dark:text-slate-300" /> : <Bot className="w-4 h-4" />}
                    </div>
                    
                    <div className={cn(
                      "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                      msg.role === "user" 
                        ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tr-none shadow-sm border border-slate-100 dark:border-slate-700" 
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700"
                    )}>
                      <div className="prose prose-sm prose-slate dark:prose-invert wrap-break-word max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-xl bg-[#00bc8c]/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-[#00bc8c]" />
                    </div>
                    <div className="bg-[#00bc8c]/5 dark:bg-[#00bc8c]/10 p-4 rounded-2xl rounded-tl-none border border-[#00bc8c]/10 dark:border-[#00bc8c]/20">
                      <Loader2 className="w-4 h-4 text-[#00bc8c] animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <form 
                  onSubmit={handleSend}
                  className="relative flex items-center"
                >
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="h-12 pl-4 pr-12 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 focus:ring-[#00bc8c]/20"
                    disabled={isLoading}
                  />
                  <button 
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 p-2 bg-[#00bc8c] text-white rounded-lg hover:bg-[#00a37b] disabled:opacity-50 disabled:hover:bg-[#00bc8c] transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between mt-3 px-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <Sparkles className="w-3 h-3 text-[#00bc8c]" />
                    AI Powered Assistance
                  </div>
                  <button 
                    onClick={clearChat}
                    className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-rose-500 uppercase tracking-widest flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear Chat
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Trigger Button */}
      <button 
        onClick={() => {
          if (isOpen && isMinimized) {
            setIsMinimized(false);
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,188,140,0.4)] transition-all duration-300 hover:scale-110 active:scale-90",
          isOpen ? "bg-white dark:bg-slate-800 text-[#00bc8c]" : "bg-[#00bc8c] text-white"
        )}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>
    </div>
  );
}
