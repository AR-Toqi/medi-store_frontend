"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { medicineService } from "@/services/medicine.service";
import { ProductCard } from "@/components/shared/product-card";
import { PackageSearch, Loader2 } from "lucide-react";
import { Medicine } from "@/types/medicine";
import { useDebounce } from "@/hooks/use-debounce";

interface MedicineGridProps {
  initialData: Medicine[];
}

export function MedicineGrid({ initialData }: MedicineGridProps) {
  const searchParams = useSearchParams();
  
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const manufacturer = searchParams.get("manufacturer") || "";
  const sort = searchParams.get("sort") || "";

  // Debounce search for the API call
  const debouncedSearch = useDebounce(search, 300);

  const { data: medicines, isLoading, isFetching } = useQuery({
    queryKey: ["medicines", debouncedSearch, category, manufacturer, sort],
    queryFn: () => medicineService.getAllMedicines({ 
      search: debouncedSearch, 
      category, 
      manufacturer, 
      sort 
    }),
    initialData: search || category || manufacturer || sort ? undefined : initialData,
    staleTime: 60 * 1000,
  });

  const displayMedicines = medicines || [];

  return (
    <div className="flex-1 min-w-0">
      {/* Active filter tags */}
      {(search || category || manufacturer) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active:</span>
          {search && (
            <span className="inline-flex items-center gap-1.5 bg-[#00bc8c]/10 text-[#00bc8c] text-xs font-bold px-3 py-1.5 rounded-full">
              Search: &ldquo;{search}&rdquo;
            </span>
          )}
          {category && (
            <span className="inline-flex items-center gap-1.5 bg-[#00bc8c]/10 text-[#00bc8c] text-xs font-bold px-3 py-1.5 rounded-full">
              Category Filtering
            </span>
          )}
          {manufacturer && (
            <span className="inline-flex items-center gap-1.5 bg-[#00bc8c]/10 text-[#00bc8c] text-xs font-bold px-3 py-1.5 rounded-full">
              {manufacturer}
            </span>
          )}
          {isFetching && !isLoading && (
             <div className="ml-auto flex items-center gap-2 text-[#00bc8c]">
               <Loader2 className="w-3 h-3 animate-spin" />
               <span className="text-[10px] font-black uppercase tracking-widest">Updating...</span>
             </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
             <div className="w-16 h-16 border-4 border-[#00bc8c]/20 border-t-[#00bc8c] rounded-full animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
                <PackageSearch className="w-6 h-6 text-[#00bc8c]" />
             </div>
          </div>
          <p className="text-sm font-bold text-slate-500 animate-pulse uppercase tracking-widest">Searching pharmacy catalog...</p>
        </div>
      ) : displayMedicines.length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8 transition-opacity duration-300 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
          {displayMedicines.map((medicine) => (
            <ProductCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
            <PackageSearch className="w-16 h-16 text-slate-300" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              No medicines found
            </h3>
            <p className="text-slate-400 font-medium max-w-sm">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
