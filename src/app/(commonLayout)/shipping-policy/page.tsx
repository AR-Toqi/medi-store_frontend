import React from 'react';
import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
          
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-[#00bc8c]/10 p-3 rounded-2xl">
              <Truck className="w-8 h-8 text-[#00bc8c]" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Shipping Policy</h1>
              <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-1">Delivery Information & Guidelines</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-12">
            
            <section>
              <h2 className="flex items-center gap-3 text-2xl font-black text-slate-800">
                <Clock className="w-6 h-6 text-[#00bc8c]" />
                Delivery Times
              </h2>
              <p className="text-slate-600 leading-relaxed mt-4">
                We strive to process and deliver your medications as quickly as possible. Most orders are processed within 24 hours.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2 italic">Standard Delivery</h4>
                  <p className="text-sm text-slate-500">2-4 business days for major metropolitan areas.</p>
                </div>
                <div className="bg-[#00bc8c]/5 p-6 rounded-3xl border border-[#00bc8c]/10">
                  <h4 className="font-bold text-[#00bc8c] mb-2 italic">Express Delivery</h4>
                  <p className="text-sm text-slate-600">Same-day or next-day delivery available in selected cities.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-2xl font-black text-slate-800">
                <MapPin className="w-6 h-6 text-[#00bc8c]" />
                Shipping Coverage
              </h2>
              <p className="text-slate-600 leading-relaxed mt-4">
                MediStore currently delivers to all major regions. Some remote areas may experience slightly longer delivery times. We use specialized medical courier services to ensure your products are handled with care.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-2xl font-black text-slate-800">
                <ShieldCheck className="w-6 h-6 text-[#00bc8c]" />
                Safe Handling & Packaging
              </h2>
              <p className="text-slate-600 leading-relaxed mt-4">
                All medications are packed in tamper-evident, temperature-controlled packaging where necessary. We ensure that your privacy is maintained with discreet outer packaging.
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 mt-4 ml-2">
                <li>Professional medical-grade packaging</li>
                <li>Discreet delivery for privacy</li>
                <li>Temperature monitoring for sensitive medications</li>
                <li>Real-time tracking for every order</li>
              </ul>
            </section>

            <div className="pt-12 border-t border-slate-100 mt-12">
              <p className="text-slate-400 text-sm text-center">
                Last updated: May 2024. For further inquiries, please contact our support team.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
