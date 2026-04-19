import React from "react";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CancelOrderButton } from "./cancel-button";

interface OrderSuccessProps {
  params: Promise<{ id: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-2xl min-h-[70vh] flex flex-col items-center justify-center">
      <div className="bg-white border border-slate-100 rounded-[3rem] p-10 md:p-14 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] w-full relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#00bc8c] to-transparent opacity-50" />
        
        <div className="bg-[#00bc8c]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border-[6px] border-white shadow-xl shadow-[#00bc8c]/20 relative z-10">
          <CheckCircle2 className="w-12 h-12 text-[#00bc8c]" />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
          Order Placed!
        </h1>
        
        <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
          Thank you for choosing MediStore. Your order has been successfully placed as Cash on Delivery and is now being processed.
        </p>

        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between text-left gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-white p-2.5 rounded-xl shadow-sm">
               <Package className="w-6 h-6 text-[#00bc8c]" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
               <p className="text-slate-800 font-mono font-bold text-sm bg-white px-2 py-1 rounded inline-block border border-slate-200">{id}</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Link href="/orders" className="flex-1">
             <Button variant="outline" className="w-full h-14 rounded-2xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
                View My Orders
             </Button>
           </Link>
           <Link href="/shop" className="flex-1">
             <Button className="w-full bg-[#00bc8c] hover:bg-[#00a37b] h-14 rounded-2xl font-bold text-white shadow-lg shadow-[#00bc8c]/20 gap-2 group cursor-pointer">
                Continue Shopping <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Button>
           </Link>
        </div>

        <div className="max-w-xs mx-auto">
          <CancelOrderButton orderId={id} />
        </div>

      </div>
    </div>
  );
}
