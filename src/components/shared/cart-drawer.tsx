"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CartDrawerProps {
  children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { cart, isLoading, error, updateQuantity, removeItem, isUpdating, isRemoving } = useCart();
  const [open, setOpen] = React.useState(false);

  const items = cart?.items || [];
  const summary = cart?.summary || { totalItems: 0, cartTotal: 0, hasUnavailableItems: false };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[150] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 transition-all duration-300" />
        <Dialog.Content className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-[151] flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-500">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#00bc8c]/10 p-2.5 rounded-2xl">
                <ShoppingCart className="w-5 h-5 text-[#00bc8c]" />
              </div>
               <div>
                <Dialog.Title className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Your Cart</Dialog.Title>
                <Dialog.Description className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Review your selected medications before checkout. {summary.totalItems} items selected.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4" />
                      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                <div className="bg-red-50 dark:bg-red-950/30 p-8 rounded-[2.5rem] border border-red-100/50 dark:border-red-900/30">
                  <ShoppingCart className="w-16 h-16 text-red-200 dark:text-red-800" strokeWidth={1} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight">Session Expired</h3>
                  <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">Please sign in again to view and manage your cart.</p>
                </div>
                <Link href="/login">
                  <Button className="bg-[#00bc8c] hover:bg-[#00a37b] rounded-2xl h-11 px-8 font-bold mt-4 shadow-lg shadow-[#00bc8c]/20">
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="group relative flex gap-4 bg-white dark:bg-transparent">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={item.medicine.imageUrl || "https://placehold.co/100x100?text=+"} 
                      alt={item.medicine.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-[#00bc8c] transition-colors">{item.medicine.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{item.medicine.manufacturer}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-1">
                        <button 
                          onClick={() => updateQuantity(item.medicineId, Math.max(1, item.quantity - 1))}
                          className="p-1.5 hover:bg-white dark:hover:bg-slate-700 hover:text-[#00bc8c] rounded-lg transition-all text-slate-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isUpdating}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-slate-700 dark:text-slate-300">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                          className="p-1.5 hover:bg-white dark:hover:bg-slate-700 hover:text-[#00bc8c] rounded-lg transition-all text-slate-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isUpdating}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-black text-slate-900 dark:text-slate-100">${item.itemTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.medicineId)}
                    className="absolute -top-1 -right-1 p-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isRemoving}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
                  <ShoppingBag className="w-16 h-16 text-slate-200 dark:text-slate-600" strokeWidth={1} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight">Your cart is empty</h3>
                  <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">Looks like you haven&apos;t added any medicines yet.</p>
                </div>
                <Dialog.Close asChild>
                  <Link href="/shop">
                    <Button className="bg-[#00bc8c] hover:bg-[#00a37b] rounded-2xl h-11 px-8 font-bold mt-4 shadow-lg shadow-[#00bc8c]/20">
                      Browse Medicines
                    </Button>
                  </Link>
                </Dialog.Close>
              </div>
            )
}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-black text-slate-500 dark:text-slate-400">${summary.cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl pt-2">
                  <span className="font-black text-slate-800 dark:text-slate-200 tracking-tight">Total</span>
                  <span className="font-black text-[#00bc8c] tracking-tight">${summary.cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 pt-2">
                <Dialog.Close asChild>
                  <Link href="/checkout" className="w-full">
                    <Button className="w-full bg-[#00bc8c] hover:bg-[#00a37b] h-14 rounded-2xl text-base font-black shadow-xl shadow-[#00bc8c]/20 gap-2 group cursor-pointer">
                      Checkout Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </Dialog.Close>
                <p className="text-[10px] text-center font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Secure Medical Checkout Powered by MediStore
                </p>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
