"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { 
  Package, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  Loader2, 
  Ban,
  Receipt
} from "lucide-react";
import { useOrderDetails, useCancelOrder } from "@/hooks/use-order";
import { Button } from "@/components/ui/button";

const StatusBadge = ({ status }: { status: string }) => {
  const settings = {
    PLACED: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
    PROCESSING: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Package },
    SHIPPED: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Truck },
    DELIVERED: { color: "bg-[#00bc8c]/20 text-[#00bc8c] border-[#00bc8c]/30", icon: CheckCircle2 },
    CANCELLED: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  }[status] || { color: "bg-slate-100 text-slate-800 border-slate-200", icon: Package };

  const Icon = settings.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border uppercase tracking-widest ${settings.color}`}>
      <Icon className="w-4 h-4" />
      {status}
    </span>
  );
};

interface OrderDetailsViewProps {
  params: Promise<{ id: string }>;
}

export function OrderDetailsView({ params }: OrderDetailsViewProps) {
  const { id } = use(params);
  const { data: order, isLoading, isError } = useOrderDetails(id);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  const [showConfirm, setShowConfirm] = useState(false);

  const executeCancel = () => {
    if (!order) return;
    cancelOrder(order.id, {
      onSuccess: () => setShowConfirm(false) // Just close modal, react-query will auto-update the page to CANCELLED
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#00bc8c]" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Order Not Found</h2>
        <p className="text-slate-500 mb-8">We couldn&apos;t find the order you&apos;re looking for.</p>
        <Link href="/orders">
          <Button className="bg-[#00bc8c] hover:bg-[#00a37b] h-12 px-8 rounded-2xl font-black cursor-pointer">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Link href="/orders" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#00bc8c] transition-colors mb-6 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Invoice Details <Receipt className="w-8 h-8 text-slate-300" />
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Order ID</span>
            <span className="text-slate-800 font-mono font-bold text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {order.id}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={order.status} />
          {order.status === "PLACED" && (
             <Button 
               variant="outline" 
               onClick={() => setShowConfirm(true)}
               className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-10 rounded-xl font-bold px-4 gap-2 cursor-pointer"
             >
               <Ban className="w-4 h-4" />
               Cancel Order
             </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Info Cards */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-1 md:col-span-1">
           <div className="flex items-center gap-2 mb-3">
             <Clock className="w-5 h-5 text-slate-400" />
             <h3 className="font-black text-slate-800">Date Placed</h3>
           </div>
           <p className="text-slate-600 font-medium" suppressHydrationWarning>{new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(new Date(order.createdAt))}</p>
           <p className="text-slate-400 text-sm mt-1" suppressHydrationWarning>{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(order.createdAt))}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-1 md:col-span-2 flex flex-col md:flex-row gap-6">
           <div className="flex-1">
             <div className="flex items-center gap-2 mb-3">
               <MapPin className="w-5 h-5 text-[#00bc8c]" />
               <h3 className="font-black text-slate-800">Shipping Address</h3>
             </div>
             <p className="text-slate-600 font-medium text-sm leading-relaxed">{order.shippingAddress}</p>
           </div>
           <div className="hidden md:block w-px bg-slate-100 self-stretch" />
           <div className="flex-1">
             <div className="flex items-center gap-2 mb-3">
               <Truck className="w-5 h-5 text-[#00bc8c]" />
               <h3 className="font-black text-slate-800">Payment Option</h3>
             </div>
             <p className="text-slate-600 font-medium">{order.paymentMethod}</p>
           </div>
        </div>
      </div>

      {/* Items List */}
      <h2 className="text-xl font-black text-slate-800 mb-4">Purchased Items</h2>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
        <div className="flex flex-col divide-y divide-slate-100">
          {order.items?.map((item: any) => (
            <Link 
              href={`/shop/${item.medicineId}`} 
              key={item.id} 
              className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
               <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0">
                 <img src={item.medicine?.imageUrl || "https://placehold.co/100"} alt="med" className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-800 truncate group-hover:text-[#00bc8c] transition-colors">{item.medicine?.name || "Unknown Item"}</h4>
                  <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-widest">{item.medicine?.seller?.shopName || "MediStore"}</p>
               </div>
               <div className="text-right flex items-center gap-6">
                  <div className="text-sm font-medium text-slate-500 hidden sm:block">
                     Qty: {item.quantity} × ${(typeof item.price === "string" ? parseFloat(item.price) : item.price).toFixed(2)}
                  </div>
                  <div className="font-black text-lg text-slate-800 w-20 text-right">
                    ${(item.quantity * (typeof item.price === "string" ? parseFloat(item.price) : item.price)).toFixed(2)}
                  </div>
               </div>
            </Link>
          ))}
        </div>
        
        {/* Footer Totals */}
        <div className="bg-slate-50 p-6 flex flex-col items-end border-t border-slate-200">
           <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between text-slate-500 font-medium">
                 <span>Subtotal</span>
                 <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                 <span>Shipping</span>
                 <span className="uppercase text-[#00bc8c] font-black">Free</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-2">
                 <span className="text-lg font-black text-slate-800">Grand Total</span>
                 <span className="text-3xl font-black text-[#00bc8c]">${order.totalAmount.toFixed(2)}</span>
              </div>
           </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
                 <Ban className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-center text-slate-800 mb-2">Cancel Order?</h3>
              <p className="text-center text-slate-500 text-sm mb-8 leading-relaxed">
                Are you sure you want to completely cancel this order? This action cannot be reversed and your items will be released.
              </p>
              
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                 <Button 
                   variant="outline" 
                   className="flex-1 rounded-xl h-12 font-bold hover:bg-slate-50 cursor-pointer" 
                   onClick={() => setShowConfirm(false)}
                 >
                   Nevermind
                 </Button>
                 <Button 
                   onClick={executeCancel} 
                   disabled={isCancelling} 
                   className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl h-12 font-bold shadow-lg shadow-red-500/20 cursor-pointer"
                 >
                    {isCancelling ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes, Cancel"}
                 </Button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
