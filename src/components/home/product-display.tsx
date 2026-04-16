"use client";

import React, { useState } from "react";
import { CategoryFilter } from "./category-filter";
import { ProductCard } from "./product-card";
import { Medicine } from "@/types/medicine";
import { Category } from "@/types/category";

interface ProductDisplayProps {
  initialCategories: Category[];
  initialMedicines: Medicine[];
}

export function ProductDisplay({ initialCategories, initialMedicines }: ProductDisplayProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredMedicines = activeCategory === "all" 
    ? initialMedicines 
    : initialMedicines.filter((m) => m.categoryId === activeCategory);

  return (
    <>
      <CategoryFilter 
        categories={initialCategories} 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />

      <section className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex items-center justify-between mb-12 px-2 border-b border-slate-100 pb-8">
          <div className="space-y-1.5">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Top Selling Medicines
            </h2>
            <p className="text-slate-400 font-bold text-sm md:text-base">
              Trusted by over 10,000 customers this month
            </p>
          </div>
        </div>

        {filteredMedicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
            {filteredMedicines.map((m) => (
              <ProductCard key={m.id} medicine={m} />
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center text-center space-y-6 animate-in fade-in duration-700">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
               <span className="text-6xl filter grayscale opacity-30">💊</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">No medicines found</h3>
              <p className="text-slate-400 font-medium max-w-xs">Try selecting another category or check back later for new arrivals.</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
