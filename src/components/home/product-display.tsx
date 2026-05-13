"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CategoryFilter } from "./category-filter";
import { ProductCard } from "@/components/shared/product-card";
import { Medicine } from "@/types/medicine";
import { Category } from "@/types/category";
import { ArrowRight, Package } from "lucide-react";

interface ProductDisplayProps {
  initialCategories: Category[];
  initialMedicines: Medicine[];
}

export function ProductDisplay({ initialCategories, initialMedicines }: ProductDisplayProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredMedicines = activeCategory === "all" 
    ? initialMedicines 
    : initialMedicines.filter((m) => m.categoryId === activeCategory);

  // Show only first 8 medicines on home page
  const displayMedicines = filteredMedicines.slice(0, 8);

  return (
    <>
      <CategoryFilter 
        categories={initialCategories} 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      <section className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex items-center justify-between mb-12 px-2 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div className="space-y-1.5">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Latest Medicines
            </h2>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-sm md:text-base">
              Discover our newest healthcare products and wellness essentials
            </p>
          </div>
          
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-3 px-6 py-3 bg-[#00bc8c] hover:bg-[#00a67a] text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-[#00bc8c]/20 hover:shadow-xl hover:shadow-[#00bc8c]/30 group"
          >
            <Package className="w-5 h-5" />
            <span>Show All Medicines</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {displayMedicines.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
              {displayMedicines.map((m) => (
                <ProductCard key={m.id} medicine={m} />
              ))}
            </div>
            
            {/* Show All Medicines Button - Mobile */}
            <div className="mt-12 text-center md:hidden">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#00bc8c] hover:bg-[#00a67a] text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-[#00bc8c]/20 hover:shadow-xl hover:shadow-[#00bc8c]/30 group"
              >
                <Package className="w-5 h-5" />
                <span>Show All Medicines</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        ) : (
          <div className="py-32 flex flex-col items-center text-center space-y-6 animate-in fade-in duration-700">
            <div className="bg-white dark:bg-slate-800/60 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none dark:border dark:border-slate-700/50">
               <span className="text-6xl filter grayscale opacity-30 dark:opacity-20">💊</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">No medicines found</h3>
              <p className="text-slate-400 dark:text-slate-500 font-medium max-w-xs">Try selecting another category or check back later for new arrivals.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
