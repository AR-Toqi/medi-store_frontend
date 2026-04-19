import React from "react";
import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";
import { ProductDisplay } from "@/components/home/product-display";
import { Newsletter } from "@/components/home/newsletter";

import { medicineService } from "@/services/medicine.service";
import { categoryService } from "@/services/category.service";

export const revalidate = 3600; // ISR Revalidate every 1 hour (3600 seconds)

export default async function Home() {
  // Server-side data fetching for better SEO and performance
  const [categories, medicines] = await Promise.all([
    categoryService.getAllCategories(),
    medicineService.getAllMedicines(),
  ]);

  return (
    <div className="relative bg-slate-50/30 pb-20 min-h-screen">
      {/* Background Decoration Blobs */}
      <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-[#00bc8c]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[70%] -left-[10%] w-[40%] h-[40%] bg-[#00bc8c]/5 rounded-full blur-[120px] pointer-events-none" />

      <Hero />
      <ValueProps />
      
      {/* Interactive Display Component (Client) */}
      <ProductDisplay 
        initialCategories={categories} 
        initialMedicines={medicines} 
      />

      <Newsletter />
    </div>
  );
}
