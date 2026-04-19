"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCancelOrder, useOrderDetails } from "@/hooks/use-order";
import { Loader2, Ban } from "lucide-react";
import { useRouter } from "next/navigation";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const { mutate: cancelOrder, isPending } = useCancelOrder();
  const router = useRouter();

  const { data: order, isLoading } = useOrderDetails(orderId);
  const [showConfirm, setShowConfirm] = useState(false);

  const executeCancel = () => {
    cancelOrder(orderId, {
      onSuccess: () => {
         setShowConfirm(false);
         router.push("/orders");
      }
    });
  };

  // Don't fully block render while loading unless we absolutely have no data, 
  // but we can show a skeleton or disabled state.
  if (isLoading && !order) {
    return (
      <Button variant="outline" disabled className="mt-6 border-slate-200 h-12 w-full rounded-2xl gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading
      </Button>
    );
  }

  // If order is not PLACED, show a disabled button explaining why
  if (order && order.status !== "PLACED") {
    return (
      <Button variant="outline" disabled className="mt-6 border-slate-200 text-slate-400 h-12 w-full rounded-2xl font-bold gap-2">
       <Ban className="w-5 h-5" /> Cancel (Already {order.status})
      </Button>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setShowConfirm(true)}
        className="mt-6 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-12 w-full rounded-2xl font-bold gap-2 cursor-pointer transition-colors"
      >
        <Ban className="w-5 h-5" />
        Cancel Order
      </Button>

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
                   className="flex-1 rounded-xl h-12 font-bold hover:bg-slate-50" 
                   onClick={() => setShowConfirm(false)}
                 >
                   Nevermind
                 </Button>
                 <Button 
                   onClick={executeCancel} 
                   disabled={isPending} 
                   className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl h-12 font-bold shadow-lg shadow-red-500/20"
                 >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes, Cancel"}
                 </Button>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
