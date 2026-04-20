import React from "react";
import { Metadata } from "next";
import { OnboardingForm } from "@/components/seller/onboarding-form";
import { Store, ShieldCheck, Zap, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Become a Seller | MediStore",
  description: "Join the largest pharmacy network and start selling your medicines online today.",
};

export default function BecomeASellerPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 md:py-20 lg:py-24">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00bc8c]/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00bc8c]/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Pitch Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00bc8c]/10 border border-[#00bc8c]/10">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00bc8c]">Partnership Program</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Grow Your Pharmacy <br />
                <span className="text-[#00bc8c]">With MediStore</span>
              </h1>
              <p className="text-lg text-slate-600 font-medium max-w-lg leading-relaxed">
                Join thousands of verified pharmacies reaching millions of customers across the nation. Get the tools you need to succeed in digital healthcare.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pb-4">
              <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-[#00bc8c]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Swift Setup</h3>
                  <p className="text-sm text-slate-500">Go live in minutes with our streamlined onboarding.</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#00bc8c]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Secure Payments</h3>
                  <p className="text-sm text-slate-500">Reliable and automated payouts for every order.</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Store className="w-5 h-5 text-[#00bc8c]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Inventory Management</h3>
                  <p className="text-sm text-slate-500">Powerful tools to track stock and manage listings.</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-[#00bc8c]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Greater Reach</h3>
                  <p className="text-sm text-slate-500">Access customers outside your physical location.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="relative">
            {/* Background glass effect */}
            <div className="absolute -inset-4 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] -z-10 border border-white/50" />
            <OnboardingForm />
          </div>

        </div>
      </div>
    </div>
  );
}
