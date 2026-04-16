"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function Newsletter() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="relative w-full bg-[#f0f9f7] rounded-[3.5rem] p-10 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 group overflow-hidden border border-[#00bc8c]/5">
        
        {/* Animated Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[100%] bg-[#00bc8c]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#00bc8c]/10 transition-all duration-1000" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[100%] bg-[#00bc8c]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#00bc8c]/10 transition-all duration-1000" />
        
        <div className="relative z-10 max-w-xl text-center lg:text-left space-y-5">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Stay Healthy & <span className="text-[#00bc8c]">Updated</span>
          </h2>
          <p className="text-slate-500 font-bold text-lg leading-relaxed max-w-md">
            Subscribe to our newsletter for weekly health tips, new product arrivals, and exclusive discounts.
          </p>
        </div>

        <div className="relative z-10 w-full max-w-xl">
          <form 
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-4 p-3 bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,188,140,0.1)] focus-within:shadow-[0_20px_50px_-10px_rgba(0,188,140,0.2)] focus-within:border-[#00bc8c]/20 transition-all duration-500"
          >
             <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 bg-transparent border-none text-slate-900 px-6 font-bold placeholder:text-slate-400 focus:ring-0 outline-none h-14"
             />
             <Button className="bg-[#00bc8c] hover:bg-[#00a37b] rounded-2xl h-14 px-10 font-black text-white uppercase tracking-widest shadow-xl shadow-[#00bc8c]/20 flex items-center gap-3 active:scale-95 transition-all">
                Subscribe
             </Button>
          </form>
          <div className="flex items-center justify-center lg:justify-start gap-2 mt-6 opacity-40">
             <div className="w-1.5 h-1.5 rounded-full bg-[#00bc8c]" />
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                Your health data is safe with us
             </p>
          </div>
        </div>

      </div>
    </section>
  );
}
