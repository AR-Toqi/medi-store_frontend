import React from "react";
import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";
import { ProductDisplay } from "@/components/home/product-display";
import { Newsletter } from "@/components/home/newsletter";

import { medicineService } from "@/services/medicine.service";
import { categoryService } from "@/services/category.service";

export default async function Home() {
  // Server-side data fetching for better SEO and performance
  const [categories, medicines] = await Promise.all([
    categoryService.getAllCategories(),
    medicineService.getAllMedicines(),
  ]);

  return (
    <div className="bg-slate-50/30 pb-20 overflow-hidden min-h-screen">
      {/* Background Decoration Blobs */}
      <div className="absolute top-[20%] right-[-15%] w-[50%] h-[40%] bg-[#00bc8c]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[70%] left-[-15%] w-[50%] h-[40%] bg-[#00bc8c]/5 rounded-full blur-[150px] pointer-events-none" />

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
