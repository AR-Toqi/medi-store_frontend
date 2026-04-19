import Link from "next/link";
import { ArrowRight, Pill, Syringe, HeartPulse, Activity } from "lucide-react";
import { categoryService } from "@/services/category.service";

// Helpful aesthetic mapping for generic categories
const getCategoryIcon = (name: string) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("vitamin") || lowercaseName.includes("supplement")) return <Activity className="w-8 h-8 text-[#00bc8c]" />;
  if (lowercaseName.includes("injection") || lowercaseName.includes("vaccine")) return <Syringe className="w-8 h-8 text-[#00bc8c]" />;
  if (lowercaseName.includes("heart") || lowercaseName.includes("cardio")) return <HeartPulse className="w-8 h-8 text-[#00bc8c]" />;
  return <Pill className="w-8 h-8 text-[#00bc8c]" />;
};

export const revalidate = 86400; // ISR Revalidate every 24 hours

export default async function CategoriesPage() {
  const categories = await categoryService.getAllCategories();
  
  // Optional client-side filtering mapping if you have them, otherwise just normal mapping.
  const activeCategories = categories?.filter(c => c.isActive) || [];

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl min-h-[80vh]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
            Shop by <span className="text-[#00bc8c]">Category</span>
          </h1>
          <p className="text-slate-400 font-medium mt-3 text-lg max-w-2xl">
            Browse our comprehensive selection of medical supplies, pharmaceuticals, and health products neatly organized into distinct categories.
          </p>
        </div>
      </div>

      {activeCategories.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center flex flex-col items-center justify-center">
          <Pill className="w-16 h-16 text-slate-300 mb-6" />
          <h2 className="text-2xl font-black text-slate-800">No categories found</h2>
          <p className="text-slate-400 mt-2">Check back later or browse all medicines in the shop.</p>
          <Link href="/shop" className="mt-8 bg-[#00bc8c] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-[#00bc8c]/20 hover:bg-[#00a37b] transition-colors">
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeCategories.map((category) => (
            <Link 
              key={category.id} 
              href={`/shop?category=${category.id}`}
              className="group block bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-[0_20px_50px_-15px_rgba(0,188,140,0.15)] hover:border-[#00bc8c]/30 transition-all duration-500 cursor-pointer"
            >
              <div className="flex flex-col h-full bg-white relative">
                <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#00bc8c]/10 transition-colors duration-300">
                   {/* Optional: Add custom images if available from the backend Model, else fallback icon */}
                   {category.image ? (
                     <img src={category.image} alt={category.name} className="w-10 h-10 object-contain" />
                   ) : (
                     getCategoryIcon(category.name)
                   )}
                </div>
                
                <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-[#00bc8c] transition-colors duration-300">
                  {category.name}
                </h3>
                
                <p className="text-sm font-medium text-slate-400 line-clamp-2 leading-relaxed mb-6">
                  {category.description || `Browse quality medical products and treatments in our ${category.name} category.`}
                </p>
                
                <div className="mt-auto flex items-center gap-2 text-[11px] font-black text-[#00bc8c] uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  Explore Category <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
