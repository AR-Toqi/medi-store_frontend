/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  ShoppingCart,
  Store,
  RefreshCcw,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateAdminOrderStatus } from "@/hooks/use-admin-orders";

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

const ORDER_STATUSES = [
  "PLACED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  const { mutate: updateStatus } = useUpdateAdminOrderStatus();

  if (!order) return null;

  const handleStatusChange = (newStatus: string) => {
    updateStatus({ id: order.id, status: newStatus });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl p-0">
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex items-center justify-between gap-4 mb-4">
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white font-black uppercase text-[10px] tracking-widest px-3 py-1">
                  Order Details
                </Badge>
                <p className="text-white/50 text-xs font-bold uppercase tracking-tighter">
                  ID: {order.id}
                </p>
             </div>
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <DialogHeader className="text-left">
                   <DialogTitle className="text-3xl font-black tracking-tight mb-2 text-white">Order summary</DialogTitle>
                   <DialogDescription className="text-slate-400 font-medium text-base" suppressHydrationWarning>
                      Placed on {format(new Date(order.createdAt), "MMMM do, yyyy 'at' h:mm a")}
                   </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-3">
                   <StatusBadge status={order.status} className="h-9 px-4 text-[10px]" />
                </div>
             </div>
          </div>
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00bc8c]/10 blur-[80px] -mr-20 -mt-20 rounded-full" />
        </div>

        <div className="p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950/80">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Info */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                    <User className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Customer Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Name</p>
                  <p className="font-bold text-slate-900">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Email</p>
                  <p className="font-bold text-slate-700">{order.customer.email}</p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                   <MapPin className="w-4 h-4 text-slate-400" />
                   <p className="text-sm font-medium text-slate-500">Shipping Address Provided at Checkout</p>
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-[#00bc8c]/10 text-[#00bc8c] rounded-xl">
                    <RefreshCcw className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Admin Controls</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Update Order Status</p>
                  <Select onValueChange={handleStatusChange} defaultValue={order.status}>
                    <SelectTrigger className="w-full h-12 rounded-2xl border-slate-100 font-bold focus:ring-[#00bc8c] transition-all">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status} className="font-bold py-3 rounded-xl focus:bg-[#00bc8c] focus:text-white transition-colors">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-slate-400 font-medium mt-3 leading-relaxed">
                    Changing the status will automatically notify the customer via email.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50 overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-slate-400" />
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Order Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Medicine</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Seller</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Qty</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.items.map((item: any) => (
                    <tr key={item.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-6">
                        <p className="font-black text-slate-900 dark:text-slate-100">{item.medicine.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {item.medicineId.slice(0, 8)}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                           <Store className="w-3.5 h-3.5 text-slate-400" />
                           <span className="font-bold text-sm text-slate-600">{item.medicine.seller?.shopName || "Platform Seller"}</span>
                        </div>
                      </td>
                      <td className="p-6 font-bold text-slate-600 dark:text-slate-400">{formatCurrency(item.medicine.price)}</td>
                      <td className="p-6 text-center font-black text-slate-900 dark:text-slate-100">{item.quantity}</td>
                      <td className="p-6 text-right font-black text-slate-900 dark:text-slate-100">{formatCurrency(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="flex justify-end">
             <div className="w-full md:w-80 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50 space-y-4">
                <div className="flex items-center justify-between text-slate-500 font-bold">
                   <p className="text-sm">Subtotal</p>
                   <p className="text-sm font-black">{formatCurrency(order.totalAmount)}</p>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-bold border-b border-slate-50 pb-4">
                   <p className="text-sm">Shipping</p>
                   <p className="text-sm text-[#00bc8c] font-black uppercase text-[10px] tracking-widest">Free</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                   <p className="text-lg font-black text-slate-900">Total</p>
                   <p className="text-2xl font-black text-[#00bc8c]">{formatCurrency(order.totalAmount)}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-2">
                   <CreditCard className="w-4 h-4" />
                   {order.paymentMethod || "Paid via Payment Gateway"}
                </div>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatusBadge({ status, className }: { status: string; className?: string }) {
  const configs: any = {
    PLACED: { label: "Placed", className: "bg-blue-500/10 text-blue-600 border-blue-200", icon: <Clock className="w-3.5 h-3.5" /> },
    PROCESSING: { label: "Processing", className: "bg-amber-500/10 text-amber-600 border-amber-200", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    SHIPPED: { label: "Shipped", className: "bg-purple-500/10 text-purple-600 border-purple-200", icon: <Package className="w-3.5 h-3.5" /> },
    DELIVERED: { label: "Delivered", className: "bg-emerald-500/10 text-emerald-600 border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    CANCELLED: { label: "Cancelled", className: "bg-red-500/10 text-red-600 border-red-200", icon: <AlertCircle className="w-3.5 h-3.5" /> },
  };

  const config = configs[status] || configs.PLACED;

  return (
    <Badge variant="outline" className={`gap-2 font-black uppercase text-[9px] tracking-widest border px-3 py-1.5 rounded-full ${config.className} ${className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}
