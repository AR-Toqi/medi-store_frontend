import { Suspense } from "react";
import { Metadata } from "next";
import { medicineService } from "@/services/medicine.service";
import { categoryService } from "@/services/category.service";
import { MedicineFilters } from "@/components/shop/medicine-filters";
import { MedicineGrid } from "@/components/shop/medicine-grid";

export const metadata: Metadata = {
  title: "Shop | MediStore — Browse All Medicines",
  description:
    "Explore our wide selection of OTC medicines. Filter by category, manufacturer, and price range to find what you need.",
};

interface ShopPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    manufacturer?: string;
    sort?: string;
    featured?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const [initialMedicines, categories] = await Promise.all([
    medicineService.getAllMedicines({
       search: params.search,
       category: params.category,
       manufacturer: params.manufacturer,
       sort: params.sort,
       isFeatured: params.featured === "true" ? true : undefined
    }),
    categoryService.getAllCategories(),
  ]);

  // Extract unique manufacturers for filters
  // We should ideally fetch all medicines once for filters or have a separate endpoint
  const allMedicines = await medicineService.getAllMedicines();
  const manufacturers = [...new Set(allMedicines.map((m) => m.manufacturer))].sort();

  const activeCategory = categories.find((c) => c.id === params.category);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50/80 dark:from-slate-900 via-white dark:via-slate-900 to-slate-50/50 dark:to-slate-900">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#00bc8c]/5 via-emerald-50/50 dark:via-slate-900 to-teal-50/30 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#00bc8c]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-black text-[#00bc8c] uppercase tracking-[0.2em]">
              <div className="w-8 h-px bg-[#00bc8c]" />
              Shop All Medicines
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.1]">
              {activeCategory ? activeCategory.name : "Explore Our Collection"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-lg leading-relaxed">
              {activeCategory
                ? `Browse through our ${activeCategory.name.toLowerCase()} category for quality healthcare products.`
                : "Browse through our wide range of quality OTC medicines. Find what you need with filters made for easy navigation."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <Suspense fallback={<div className="w-72 h-96 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[2rem]" />}>
            <MedicineFilters categories={categories} manufacturers={manufacturers} />
          </Suspense>

          {/* Product Grid (Instant updates via TanStack Query) */}
          <MedicineGrid initialData={initialMedicines} />
        </div>
      </section>
    </div>
  );
}
