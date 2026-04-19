"use client";

import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CartPage() {
  const { cart, isLoading, error, updateQuantity, removeItem, isUpdating, isRemoving } = useCart();

  const items = cart?.items || [];
  const summary = cart?.summary || { totalItems: 0, cartTotal: 0, hasUnavailableItems: false };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 max-w-6xl">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-8">Your Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-6 animate-pulse bg-white p-6 rounded-3xl border border-slate-100">
                <div className="w-32 h-32 bg-slate-100 rounded-2xl" />
                <div className="flex-1 space-y-4 py-2">
                  <div className="h-6 bg-slate-100 rounded-full w-3/4" />
                  <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-24 flex flex-col items-center justify-center text-center">
         <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100/50 mb-6">
            <ShoppingCart className="w-20 h-20 text-red-200" strokeWidth={1} />
         </div>
         <h3 className="text-2xl font-black text-slate-800 tracking-tight">Session Expired</h3>
         <p className="text-base font-medium text-slate-400 mt-2 max-w-sm">Please sign in again to view and manage your cart.</p>
         <Link href="/login">
            <Button className="bg-[#00bc8c] hover:bg-[#00a37b] rounded-2xl h-14 px-10 font-black mt-8 shadow-xl shadow-[#00bc8c]/20">
               Sign In
            </Button>
         </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-24 flex flex-col items-center justify-center text-center">
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 mb-6">
          <ShoppingBag className="w-20 h-20 text-slate-200" strokeWidth={1} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Your cart is empty</h3>
        <p className="text-base font-medium text-slate-400 mt-2 max-w-sm">Looks like you haven&apos;t added any medicines yet.</p>
         <Link href="/shop">
           <Button className="bg-[#00bc8c] hover:bg-[#00a37b] rounded-2xl h-14 px-10 font-black mt-8 shadow-xl shadow-[#00bc8c]/20">
             Browse Medicines
           </Button>
         </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#00bc8c]/10 p-3.5 rounded-2xl">
          <ShoppingCart className="w-6 h-6 text-[#00bc8c]" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Your Shopping Cart</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            {summary.totalItems} Items Selected
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="group relative flex gap-6 bg-white p-6 rounded-3xl border border-slate-100 hover:border-[#00bc8c]/30 hover:shadow-xl hover:shadow-[#00bc8c]/5 transition-all duration-300">
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                <img 
                  src={item.medicine.imageUrl || "https://placehold.co/200x200?text=+"} 
                  alt={item.medicine.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                   <div>
                     <h4 className="text-lg font-black text-slate-800 group-hover:text-[#00bc8c] transition-colors">{item.medicine.name}</h4>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">{item.medicine.manufacturer}</p>
                   </div>
                   <button 
                      onClick={() => removeItem(item.medicineId)}
                      className="p-2.5 bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-100 rounded-xl text-slate-400 hover:text-red-500 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isRemoving}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-1.5">
                    <button 
                      onClick={() => updateQuantity(item.medicineId, Math.max(1, item.quantity - 1))}
                      className="p-2 bg-white hover:bg-[#00bc8c] hover:text-white rounded-xl shadow-sm transition-all text-slate-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isUpdating}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-black text-slate-700">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                      className="p-2 bg-white hover:bg-[#00bc8c] hover:text-white rounded-xl shadow-sm transition-all text-slate-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isUpdating}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                     <p className="text-xl font-black text-slate-900">${item.itemTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Checkout block */}
        <div className="lg:col-span-1 border border-slate-100 bg-white rounded-3xl p-8 sticky top-28 shadow-xl shadow-slate-200/20">
          <h3 className="text-lg font-black text-slate-800 mb-6">Order Summary</h3>
          
          <div className="space-y-4">
             <div className="flex justify-between text-sm">
                <span className="font-bold text-slate-400 uppercase tracking-widest">Subtotal ({summary.totalItems} items)</span>
                <span className="font-black text-slate-600">${summary.cartTotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="font-bold text-slate-400 uppercase tracking-widest">Shipping</span>
                <span className="font-black text-slate-600">Calculated at checkout</span>
             </div>
             
             <div className="pt-6 mt-6 border-t border-slate-100">
                <div className="flex justify-between items-end">
                   <span className="text-base font-black text-slate-800">Total</span>
                   <span className="text-3xl font-black text-[#00bc8c] tracking-tight">
                      ${summary.cartTotal.toFixed(2)}
                   </span>
                </div>
             </div>
             
             <div className="pt-6">
                <Link href="/checkout">
                  <Button className="w-full bg-[#00bc8c] hover:bg-[#00a37b] h-14 rounded-2xl text-base font-black shadow-xl shadow-[#00bc8c]/20 gap-2 group cursor-pointer">
                    Proceed to Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </Button>
                </Link>
                <p className="text-xs text-center font-bold text-slate-400 uppercase tracking-widest mt-4">
                  100% Secure Transaction
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
