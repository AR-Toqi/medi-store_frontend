"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Thermometer, 
  Heart, 
  Droplet, 
  Milk, 
  ShieldCheck, 
  Stethoscope 
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "All Products": <LayoutGrid className="w-5 h-5" />,
  "Fever & Pain": <Thermometer className="w-5 h-5" />,
  "Heart Health": <Heart className="w-5 h-5" />,
  "Vitamins": <Droplet className="w-5 h-5" />,
  "Skincare": <Milk className="w-5 h-5" />,
  "Immunity": <ShieldCheck className="w-5 h-5" />,
  "Digestive": <Stethoscope className="w-5 h-5" />,
};

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-10 px-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Popular Categories</h2>
        <button className="text-[13px] font-black uppercase tracking-widest text-[#00bc8c] hover:opacity-80 transition-all flex items-center gap-2 group">
          View All <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </button>
      </div>

      <div className="flex items-center gap-5 overflow-x-auto pb-6 px-2 no-scrollbar scroll-smooth">
        <button
          onClick={() => onCategoryChange("all")}
          className={cn(
            "flex items-center gap-3 px-8 py-4 rounded-2xl whitespace-nowrap font-bold text-sm transition-all duration-300 border h-14",
            activeCategory === "all" 
              ? "bg-[#00bc8c] text-white border-[#00bc8c] shadow-[0_10px_25px_-5px_rgba(0,188,140,0.4)] scale-105" 
              : "bg-white text-slate-500 border-slate-100 hover:border-[#00bc8c]/30 hover:bg-slate-50 shadow-sm"
          )}
        >
          <LayoutGrid className="w-5 h-5" />
          All Products
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-2xl whitespace-nowrap font-bold text-sm transition-all duration-300 border h-14",
              activeCategory === cat.id 
                ? "bg-[#00bc8c] text-white border-[#00bc8c] shadow-[0_10px_25px_-5px_rgba(0,188,140,0.4)] scale-105" 
                : "bg-white text-slate-500 border-slate-100 hover:border-[#00bc8c]/30 hover:bg-slate-50 shadow-sm"
            )}
          >
            <div className={activeCategory === cat.id ? "text-white" : "text-[#00bc8c]"}>
              {iconMap[cat.name] || <Droplet className="w-5 h-5" />}
            </div>
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
}
