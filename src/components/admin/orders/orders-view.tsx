/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { 
  Search,  
  ShoppingBag, 
  Clock, 
  TrendingUp, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminOrders } from "@/hooks/use-admin-orders";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderDetailsModal } from "./order-details-modal";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { label: "All Statuses", value: "ALL" },
  { label: "Placed", value: "PLACED" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function AdminOrdersView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useAdminOrders({
    page,
    limit: 8,
    search: search || undefined,
    status: status === "ALL" ? undefined : status,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleOpenDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-400 mx-auto pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50">
        <div>
           <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-1 flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-[#00bc8c]" />
              Global Orders
           </h1>
           <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and monitor all transactions on the platform</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by ID, name or email..." 
              className="pl-11 h-12 rounded-2xl border-slate-100 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 focus:bg-white dark:focus:bg-slate-600 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-48 h-12 rounded-2xl border-slate-100 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 font-bold">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              {STATUS_FILTERS.map((f) => (
                <SelectItem key={f.value} value={f.value} className="font-bold py-3 rounded-xl">
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border-none shadow-xl shadow-slate-200/60 dark:shadow-slate-900/60 rounded-[2rem] overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Order & Customer</th>
                  <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Shops</th>
                  <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                  <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="p-6"><Skeleton className="h-16 w-full rounded-2xl" /></td>
                    </tr>
                  ))
                ) : data?.data?.length > 0 ? (
                  data.data.map((order: any) => (
                    <tr key={order.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-500 text-sm shadow-inner group-hover:from-[#00bc8c]/10 group-hover:to-[#00bc8c]/5 group-hover:text-[#00bc8c] transition-all">
                            {order.customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 leading-none mb-1">{order.customer.name}</p>
                            <p className="text-xs font-bold text-slate-400 truncate max-w-37.5">{order.customer.email}</p>
                            <p className="text-[10px] font-black text-slate-300 mt-1 uppercase tracking-tighter">ID: {order.id.slice(0, 12)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-wrap items-center gap-1.5 max-w-37.5">
                           {Array.from(new Set(order.items.map((item: any) => item.medicine.seller?.shopName || "Platform Seller"))).map(
                             (shopName: any, idx: number) => (
                                <Badge key={idx} variant="outline" className="bg-slate-50 text-[9px] text-slate-500 font-bold border-slate-200 truncate max-w-25" title={shopName}>
                                   {shopName}
                                </Badge>
                             )
                           )}
                        </div>
                      </td>
                      <td className="p-6">
                         <p className="font-black text-slate-900">{formatCurrency(order.totalAmount)}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.items.length} items</p>
                      </td>
                      <td className="p-6">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="p-6 text-xs font-bold text-slate-400 uppercase tracking-tighter" suppressHydrationWarning>
                        {format(new Date(order.createdAt), "MMM d, h:mm a")}
                      </td>
                      <td className="p-6 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-[#00bc8c]/10 hover:text-[#00bc8c] transition-all cursor-pointer"
                          onClick={() => handleOpenDetails(order)}
                        >
                           <Eye className="w-5 h-5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                       <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                             <ShoppingBag className="w-8 h-8" />
                          </div>
                          <p className="font-black text-slate-400 uppercase tracking-widest text-sm">No orders found</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Button 
            variant="outline" 
            size="icon" 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-xl border-slate-200 hover:border-[#00bc8c] hover:text-[#00bc8c] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1">
             {[...Array(data.meta.totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "outline"}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "w-10 h-10 rounded-xl font-black transition-all cursor-pointer",
                    page === i + 1 ? "bg-[#00bc8c] hover:bg-[#00bc8c]/90" : "border-slate-200 hover:border-[#00bc8c] text-slate-500 hover:text-[#00bc8c]"
                  )}
                >
                  {i + 1}
                </Button>
             ))}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            disabled={page === data.meta.totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-xl border-slate-200 hover:border-[#00bc8c] hover:text-[#00bc8c] transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Details Modal */}
      <OrderDetailsModal 
        order={selectedOrder} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    PLACED: { label: "Placed", className: "bg-blue-500/10 text-blue-600 border-blue-100", icon: <Clock className="w-3 h-3" /> },
    PROCESSING: { label: "Processing", className: "bg-amber-500/10 text-amber-600 border-amber-100", icon: <TrendingUp className="w-3 h-3" /> },
    SHIPPED: { label: "Shipped", className: "bg-purple-500/10 text-purple-600 border-purple-100", icon: <Package className="w-3 h-3" /> },
    DELIVERED: { label: "Delivered", className: "bg-emerald-500/10 text-emerald-600 border-emerald-100", icon: <CheckCircle2 className="w-3 h-3" /> },
    CANCELLED: { label: "Cancelled", className: "bg-red-500/10 text-red-600 border-red-100", icon: <AlertCircle className="w-3 h-3" /> },
  };

  const config = configs[status] || configs.PLACED;

  return (
    <Badge variant="outline" className={`gap-1.5 font-black uppercase text-[9px] tracking-widest border px-2.5 py-1 rounded-lg ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}
