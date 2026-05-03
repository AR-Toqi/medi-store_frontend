"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Package, 
  ChevronRight, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck,
  ArrowRight
} from "lucide-react";
import { useOrders } from "@/hooks/use-order";
import { Button } from "@/components/ui/button";

const StatusBadge = ({ status }: { status: string }) => {
  const settings = {
    PLACED: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
    PROCESSING: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Package },
    SHIPPED: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Truck },
    DELIVERED: { color: "bg-[#00bc8c]/20 text-[#00bc8c] border-[#00bc8c]/30", icon: CheckCircle2 },
    CANCELLED: { color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800/30", icon: XCircle },
  }[status] || { color: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700", icon: Package };

  const Icon = settings.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${settings.color}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

export function OrdersView() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders(page, 10);

  const orders = data?.data || [];
  const meta = data?.meta;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#00bc8c]" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <div className="bg-slate-50 dark:bg-slate-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-slate-300 dark:text-slate-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 dark:text-slate-200 mb-2">No Orders Yet</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
          You haven&apos;t placed any orders yet. Start exploring our pharmacy to find what you need.
        </p>
        <Link href="/shop">
          <Button className="bg-[#00bc8c] hover:bg-[#00a37b] h-14 px-8 rounded-2xl font-black shadow-lg shadow-[#00bc8c]/20 gap-2 cursor-pointer transition-transform hover:-translate-y-0.5">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Order <span className="text-[#00bc8c]">History</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Track and manage your recent purchases.
          </p>
        </div>
      </div>

      <div className="grid gap-5">
        {orders.map((order) => (
          <Link 
            href={`/orders/${order.id}`} 
            key={order.id}
            className="group bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-100 dark:border-slate-700/50 p-5 md:p-6 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] hover:border-[#00bc8c]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer"
          >
            {/* Left/Top Content */}
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-3">
                 <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-slate-400 dark:text-slate-500 group-hover:text-[#00bc8c] group-hover:bg-[#00bc8c]/10 transition-colors">
                   <Package className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Order Number</p>
                   <p className="text-slate-800 dark:text-slate-200 font-mono font-bold text-sm bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded inline-block border border-slate-100 dark:border-slate-800">{order.id.slice(0, 13)}...</p>
                 </div>
               </div>

               <div className="flex flex-wrap gap-x-8 gap-y-3 mt-4">
                 <div>
                   <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Date Placed</p>
                   <p className="font-bold text-slate-700 dark:text-slate-300 text-sm" suppressHydrationWarning>
                     {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(order.createdAt))}
                   </p>
                 </div>
                 <div>
                   <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Total Amount</p>
                   <p className="font-black text-[#00bc8c] text-sm">${order.totalAmount.toFixed(2)}</p>
                 </div>
                 <div>
                   <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">Payment</p>
                   <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">{order.paymentMethod}</p>
                 </div>
               </div>
            </div>

            {/* Right/Bottom Content */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 shrink-0">
               <StatusBadge status={order.status} />
               <div className="flex items-center gap-1 text-sm font-bold text-slate-400 dark:text-slate-500 group-hover:text-[#00bc8c] transition-colors">
                 View Details <ChevronRight className="w-4 h-4" />
               </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button 
            variant="outline" 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="rounded-xl font-bold cursor-pointer"
          >
            Previous
          </Button>
          <div className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-2 rounded-xl flex items-center justify-center min-w-[3rem]">
            {page} / {meta.totalPages}
          </div>
          <Button 
            variant="outline" 
            disabled={page === meta.totalPages}
            onClick={() => setPage(p => p + 1)}
            className="rounded-xl font-bold cursor-pointer"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
