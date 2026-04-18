"use client";

import React, { useState } from "react";
import { ShoppingCart, Minus, Plus, Check, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface AddToCartButtonProps {
  medicineId: string;
  disabled?: boolean;
}

export function AddToCartButton({ medicineId, disabled }: AddToCartButtonProps) {
  const { addItem, isAdding } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  async function handleAddToCart() {
    if (disabled || isAdding) return;
    
    const success = addItem(medicineId, quantity);
    
    if (success) {
      // Provide a short visual success state
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <div className="flex items-center gap-4 pt-2">
      {/* Quantity Selector */}
      <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={disabled}
          className="p-3.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" strokeWidth={2.5} />
        </button>
        <span className="w-12 text-center text-base font-black text-slate-900 select-none">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          disabled={disabled}
          className="p-3.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={disabled || isAdding}
        className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-black transition-all duration-300 active:scale-95 shadow-lg ${
          disabled || isAdding
            ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            : added
              ? "bg-emerald-500 text-white shadow-emerald-500/25"
              : "bg-[#00bc8c] text-white hover:bg-[#00a37b] shadow-[#00bc8c]/25 hover:shadow-[#00bc8c]/40"
        }`}
      >
        {isAdding ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" strokeWidth={3} />
            Adding...
          </>
        ) : added ? (
          <>
            <Check className="w-5 h-5" strokeWidth={3} />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
            {disabled ? "Out of Stock" : "Add to Cart"}
          </>
        )}
      </button>
    </div>
  );
}
