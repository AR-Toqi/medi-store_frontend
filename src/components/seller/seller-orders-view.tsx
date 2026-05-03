"use client";

import React, { useState } from "react";
import { 
  ShoppingBag, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSellerOrders, useUpdateOrderStatus } from "@/hooks/use-seller-orders";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const STATUS_CONFIG = {
  PLACED: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  PROCESSING: { label: "Processing", icon: Package, color: "bg-blue-100 text-blue-700 border-blue-200" },
  SHIPPED: { label: "Shipped", icon: Truck, color: "bg-purple-100 text-purple-700 border-purple-200" },
  DELIVERED: { label: "Delivered", icon: CheckCircle2, color: "bg-[#00bc8c]/10 text-[#00bc8c] border-[#00bc8c]/20" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-700 border-red-200" },
};

export function SellerOrdersView() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const { orders, meta, isLoading } = useSellerOrders(page, 10, status === "all" ? undefined : status);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateStatus({ id: orderId, status: newStatus });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 border-l-4 border-[#00bc8c] pl-4">
            Order <span className="text-[#00bc8c]">Fulfillment</span>
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Track customer purchases and manage delivery status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Card className="border-none shadow-md bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#00bc8c]/10 flex items-center justify-center text-[#00bc8c]">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Total Active</p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-100">{meta?.total || 0}</p>
            </div>
          </Card>
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <Select value={status} onValueChange={(val) => { setStatus(val); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-45 h-11 rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 dark:border-slate-700 dark:bg-slate-900 shadow-2xl">
                <SelectItem value="all" className="font-bold cursor-pointer">All Orders</SelectItem>
                <SelectItem value="PLACED" className="font-bold cursor-pointer">Pending</SelectItem>
                <SelectItem value="PROCESSING" className="font-bold cursor-pointer">Processing</SelectItem>
                <SelectItem value="SHIPPED" className="font-bold cursor-pointer">Shipped</SelectItem>
                <SelectItem value="DELIVERED" className="font-bold cursor-pointer">Delivered</SelectItem>
                <SelectItem value="CANCELLED" className="font-bold cursor-pointer">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-xs font-black text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2">
            Showing <span className="text-[#00bc8c]">{orders.length}</span> results for <span className="text-slate-800 dark:text-slate-100 uppercase">{status}</span>
          </div>
        </div>

        <CardContent className="p-0 overflow-auto">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-[#00bc8c]" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <TableHead className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID</TableHead>
                  <TableHead className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</TableHead>
                  <TableHead className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Value</TableHead>
                  <TableHead className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Current Status</TableHead>
                  <TableHead className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Update Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center border-none">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                         <ShoppingBag className="h-12 w-12" />
                         <p className="font-bold">No orders found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PLACED;
                    const StatusIcon = config.icon;
                    return (
                      <TableRow key={order.id} className="group border-slate-50 dark:border-slate-700 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                        <TableCell className="px-6 py-5">
                           <div className="flex items-center gap-3">
                              <span className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono text-[10px] font-bold text-slate-500 dark:text-slate-300">
                                #
                              </span>
                              <div>
                                <p className="font-black text-slate-900 dark:text-slate-100 group-hover:text-[#00bc8c] transition-colors">
                                  {order.id.slice(0, 12)}...
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Customer ID: {order.customerId.slice(0, 8)}</p>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                           <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-bold text-sm">
                             <Calendar className="h-3.5 w-3.5 opacity-40" />
                             {new Date(order.createdAt).toLocaleDateString()}
                           </div>
                        </TableCell>
                        <TableCell className="px-6 py-5 font-black text-slate-900 dark:text-slate-100">
                           <div className="flex items-center gap-1">
                             <DollarSign className="h-3.5 w-3.5 text-[#00bc8c]" />
                             {typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount).toFixed(2) : order.totalAmount.toFixed(2)}
                           </div>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                           <Badge variant="outline" className={cn(
                             "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black border-transparent uppercase tracking-widest",
                             config.color
                           )}>
                             <StatusIcon className="h-3.5 w-3.5" />
                             {config.label}
                           </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <Link href={`/orders/${order.id}`}>
                               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                  <Eye className="h-4 w-4 text-slate-900 dark:text-slate-100" />
                               </Button>
                             </Link>
                             <Select 
                              disabled={isUpdating || order.status === "DELIVERED" || order.status === "CANCELLED"}
                              onValueChange={(val) => handleStatusUpdate(order.id, val)}
                             >
                                <SelectTrigger className="w-32 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border-transparent font-bold text-[11px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-slate-100">
                                   <SelectValue placeholder="Update" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-100 dark:border-slate-700 dark:bg-slate-900 shadow-2xl">
                                   <SelectItem value="PLACED" className="font-bold cursor-pointer">Pending</SelectItem>
                                   <SelectItem value="PROCESSING" className="font-bold cursor-pointer">Processing</SelectItem>
                                   <SelectItem value="SHIPPED" className="font-bold cursor-pointer">Shipped</SelectItem>
                                   <SelectItem value="DELIVERED" className="font-bold cursor-pointer text-[#00bc8c]">Delivered</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>

        {meta && meta.totalPages > 1 && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-950/50 flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="rounded-xl font-bold h-10 px-4 border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-sm font-black text-slate-400 dark:text-slate-500">
              Page <span className="text-[#00bc8c]">{page}</span> of {meta.totalPages}
            </span>
            <Button 
              variant="outline" 
              disabled={page === meta.totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="rounded-xl font-bold h-10 px-4 border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
