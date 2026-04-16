"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";

export function Hero() {
  return (
    <div className="px-4">
      <section className="relative w-full h-[550px] md:h-[650px] overflow-hidden rounded-[2.5rem] shadow-2xl">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ 
            backgroundImage: `url('/hero-bg.png')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/30 to-transparent" />
        </div>

        <div className="relative h-full flex items-center container mx-auto px-8 md:px-16">
          <div className="max-w-2xl space-y-7 animate-in fade-in slide-in-from-left-10 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00bc8c]/15 border border-[#00bc8c]/20 backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00bc8c]">
                Pharmacy Redefined
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
              Reliable Healthcare, <br />
              <span className="text-[#00bc8c]">Direct to You</span>
            </h1>

            <p className="text-base md:text-lg text-slate-200 font-medium leading-relaxed max-w-lg">
              Get up to 25% off on chronic medication and wellness supplements. Experience professional care with same-day delivery on essential items.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="bg-[#00bc8c] hover:bg-[#00a37b] h-14 px-10 rounded-2xl text-base font-bold shadow-xl shadow-[#00bc8c]/30 transition-all active:scale-95">
                Shop Now
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/20 text-white h-14 px-10 rounded-2xl text-base font-bold transition-all active:scale-95">
                Health Tips
              </Button>
            </div>
          </div>

          {/* Floating Badge */}
          <div className="hidden lg:flex absolute bottom-12 right-12 bg-white/90 backdrop-blur-xl p-5 rounded-3xl items-center gap-4 shadow-2xl animate-in zoom-in duration-1000 delay-300 fill-mode-both">
            <div className="bg-[#00bc8c] p-2 rounded-xl">
              <BadgeCheck className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Pharmacists</p>
                <p className="text-slate-700 font-bold">Available for consultation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
