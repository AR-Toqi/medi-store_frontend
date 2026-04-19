"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Loader2 } from "lucide-react";
import { Medicine } from "@/types/medicine";
import { useCart } from "@/hooks/use-cart";

export function ProductCard({ medicine }: { medicine: Medicine }) {
  const { addItem, isAdding } = useCart();
  
  const formattedPrice = typeof medicine.price === 'string' 
    ? parseFloat(medicine.price).toFixed(2) 
    : medicine.price.toFixed(2);

  const isOutOfStock = medicine.stock === 0;

  return (
    <Link href={`/shop/${medicine.slug}`} className="block h-full">
      <div className="group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_-15px_rgba(0,188,140,0.15)] transition-all duration-500 flex flex-col items-start gap-5 cursor-pointer h-full relative overflow-hidden">
        
        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          {medicine.isFeatured && (
            <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/20 animate-pulse">
              Hot
            </span>
          )}
          {medicine.stock <= 5 && medicine.stock > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/20">
              Low Stock
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-red-500/20">
              Out of Stock
            </span>
          )}
        </div>

        {/* Image Container */}
        <div className="w-full aspect-square relative rounded-[1.8rem] overflow-hidden bg-slate-50">
           <img 
              src={medicine.imageUrl || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600"} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              alt={medicine.name}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 w-full gap-2 text-left">
          <p className="text-[11px] font-black text-[#00bc8c] uppercase tracking-widest opacity-80 decoration-dotted underline underline-offset-4">
            {medicine.manufacturer}
          </p>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-[#00bc8c] transition-colors">
            {medicine.name}
          </h3>
          <p className="text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed">
            {medicine.description || "Effective relief for your healthcare needs with professional quality assurance."}
          </p>
        </div>

        {/* Footer */}
        <div className="w-full flex items-center justify-between gap-4 pt-2">
          <div className="flex flex-col">
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-tighter">Price</p>
            <p className="text-2xl font-black text-slate-900">
              ${formattedPrice}
            </p>
          </div>
          <button 
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               if (!isOutOfStock) {
                 addItem(medicine.id, 1);
               }
             }}
             disabled={isOutOfStock || isAdding}
             className={`p-4 rounded-2xl transition-all duration-300 shadow-sm flex items-center justify-center min-w-[56px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
               isOutOfStock
                 ? "bg-slate-100 text-slate-300"
                 : "bg-[#00bc8c]/10 text-[#00bc8c] hover:bg-[#00bc8c] hover:text-white hover:scale-110 active:scale-90"
             }`}
          >
             {isAdding ? (
               <Loader2 className="w-6 h-6 animate-spin" strokeWidth={3} />
             ) : (
               <ShoppingCart className="w-6 h-6" strokeWidth={2.5} />
             )}
          </button>
        </div>

      </div>
    </Link>
  );
}
