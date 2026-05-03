import React from 'react';
import { RefreshCcw, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ReturnRefundPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-700">
          
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-rose-500/10 dark:bg-rose-500/20 p-3 rounded-2xl">
              <RefreshCcw className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Return & Refund</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium uppercase text-[10px] tracking-widest mt-1">Our Commitment to Your Satisfaction</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-12">
            
            <section className="bg-rose-50/30 dark:bg-rose-500/10 p-8 rounded-[2rem] border border-rose-100 dark:border-rose-500/20">
              <h2 className="flex items-center gap-3 text-2xl font-black text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-6 h-6" />
                Medical Safety Policy
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4 font-medium">
                Due to health and safety regulations, medications (both OTC and prescription) generally cannot be returned once they have left our pharmacy. This is to ensure that no compromised medication is ever sold to another customer.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-2xl font-black text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-6 h-6 text-[#00bc8c]" />
                Eligible Returns
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                We accept returns and provide full refunds or replacements in the following cases:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Damaged Products</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">If your order arrives with broken seals or damaged packaging.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Wrong Item Sent</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">If the product delivered does not match your order confirmation.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-2xl font-black text-slate-800 dark:text-slate-200">
                <AlertCircle className="w-6 h-6 text-amber-500" />
                Refund Process
              </h2>
              <ol className="list-decimal list-inside space-y-4 text-slate-600 dark:text-slate-400 mt-4 ml-2">
                <li className="font-medium">
                  <span className="text-slate-900 dark:text-slate-100">Notify us:</span> Contact our support within 48 hours of delivery.
                </li>
                <li className="font-medium">
                  <span className="text-slate-900 dark:text-slate-100">Verification:</span> Provide photos of the damaged or incorrect item.
                </li>
                <li className="font-medium">
                  <span className="text-slate-900 dark:text-slate-100">Approval:</span> Once approved, we will initiate the refund to your original payment method.
                </li>
                <li className="font-medium">
                  <span className="text-slate-900 dark:text-slate-100">Completion:</span> Refunds typically appear in your account within 5-10 business days.
                </li>
              </ol>
            </section>

            <div className="pt-12 border-t border-slate-100 dark:border-slate-700 mt-12">
              <p className="text-slate-400 dark:text-slate-500 text-sm text-center">
                Your health and safety are our top priorities. If you have any concerns about your order, please reach out to us immediately.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
