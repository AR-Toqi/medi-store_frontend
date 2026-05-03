"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { BadgeCheck, Store } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";

export function Hero() {
  const { user } = useUser();

  const isSeller = user?.role === "SELLER";
  const isAdmin = user?.role === "ADMIN";

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

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
              Reliable Healthcare, <br />
              <span className="text-[#00bc8c]">Direct to You</span>
            </h1>

            <p className="text-base md:text-lg text-slate-200 font-medium leading-relaxed max-w-lg">
              Get up to 25% off on chronic medication and wellness supplements. Experience professional care with same-day delivery on essential items.
            </p>



            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/shop">
                <Button className="bg-[#00bc8c] hover:bg-[#00a37b] h-14 px-10 rounded-2xl text-base font-bold shadow-xl shadow-[#00bc8c]/30 transition-all active:scale-95">
                  Shop Now
                </Button>
              </Link>

              {isSeller ? (
                <Link href="/seller/dashboard">
                  <Button variant="outline" className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/20 text-white h-14 px-10 rounded-2xl text-base font-bold transition-all active:scale-95 flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Seller Dashboard
                  </Button>
                </Link>
              ) : isAdmin ? (
                <Link href="/admin">
                  <Button variant="outline" className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/20 text-white h-14 px-10 rounded-2xl text-base font-bold transition-all active:scale-95">
                    Admin Panel
                  </Button>
                </Link>
              ) : (
                <Link href="/become-a-seller">
                  <Button variant="outline" className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/20 text-white h-14 px-10 rounded-2xl text-base font-bold transition-all active:scale-95">
                    Become a Seller
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Floating Badge */}
          <div className="hidden lg:flex absolute bottom-12 right-12 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-5 rounded-3xl items-center gap-4 shadow-2xl animate-in zoom-in duration-1000 delay-300 fill-mode-both">
            <div className="bg-[#00bc8c] p-2 rounded-xl">
              <BadgeCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Verified Pharmacists</p>
              <p className="text-slate-700 dark:text-slate-200 font-bold">Available for consultation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
