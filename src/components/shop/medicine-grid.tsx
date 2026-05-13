"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { medicineService } from "@/services/medicine.service";
import { ProductCard } from "@/components/shared/product-card";
import { PackageSearch, Loader2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Medicine } from "@/types/medicine";
import { useDebounce } from "@/hooks/use-debounce";

interface MedicineGridProps {
  initialData: Medicine[];
  initialMeta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function MedicineGrid({ initialData, initialMeta }: MedicineGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const manufacturer = searchParams.get("manufacturer") || "";
  const sort = searchParams.get("sort") || "";
  const isFeatured = searchParams.get("featured") === "true";
  const currentPage = parseInt(searchParams.get("page") || "1");

  // Debounce search for the API call
  const debouncedSearch = useDebounce(search, 300);

  const { data: medicinesResponse, isLoading, isFetching } = useQuery({
    queryKey: ["medicines", debouncedSearch, category, manufacturer, sort, isFeatured, currentPage],
    queryFn: () => medicineService.getMedicinesWithPagination({
      search: debouncedSearch,
      category,
      manufacturer,
      sort,
      isFeatured: isFeatured || undefined,
      page: currentPage,
      limit: 6
    }),
    initialData: (search || category || manufacturer || sort || isFeatured || currentPage > 1) ? undefined : {
      data: initialData,
      meta: initialMeta || { total: initialData.length, page: 1, limit: 6, totalPages: Math.ceil(initialData.length / 6) }
    },
    staleTime: 60 * 1000,
  });

  const medicines = medicinesResponse?.data || [];
  const meta = medicinesResponse?.meta || { total: 0, page: 1, limit: 6, totalPages: 0 };

  // Map sort values to display labels
  const sortLabels: { [key: string]: string } = {
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    "name-asc": "Name: A-Z",
    "newest": "Newest First",
  };

  const getSortLabel = (sortValue: string) => sortLabels[sortValue] || sortValue;

  return (
    <div className="flex-1 min-w-0">
      {/* Active filter tags */}
      {(search || category || manufacturer || isFeatured || sort) && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active:</span>
          {isFeatured && (
            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              Featured Products
            </span>
          )}
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
          {sort && (
            <span className="inline-flex items-center gap-1.5 bg-[#00bc8c]/10 text-[#00bc8c] text-xs font-bold px-3 py-1.5 rounded-full">
              Sort: {getSortLabel(sort)}
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
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse uppercase tracking-widest">Searching pharmacy catalog...</p>
        </div>
      ) : medicines.length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8 transition-opacity duration-300 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
          {medicines.map((medicine) => (
            <ProductCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none dark:border dark:border-slate-700">
            <PackageSearch className="w-16 h-16 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">
              No medicines found
            </h3>
            <p className="text-slate-400 dark:text-slate-500 font-medium max-w-sm">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} medicines
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(meta.totalPages - 4, meta.page - 2)) + i;
                if (pageNum > meta.totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors ${pageNum === meta.page
                        ? "bg-[#00bc8c] text-white"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/shop?${params.toString()}`, { scroll: false });
  }
}
