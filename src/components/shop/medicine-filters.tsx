"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown, Star } from "lucide-react";
import { Category } from "@/types/category";

interface MedicineFiltersProps {
  categories: Category[];
  manufacturers: string[];
}

export function MedicineFilters({ categories, manufacturers }: MedicineFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentManufacturer = searchParams.get("manufacturer") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentFeatured = searchParams.get("featured") === "true";

  const [searchValue, setSearchValue] = useState(currentSearch);
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    setSearchValue(currentSearch);
  }, [currentSearch]);

  React.useEffect(() => {
    if (searchValue !== currentSearch) {
      const timer = setTimeout(() => {
        updateParams("search", searchValue);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchValue, currentSearch]);

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
  }

  function handleSearch(e?: React.SyntheticEvent) {
    e?.preventDefault();
    updateParams("search", searchValue);
  }

  function clearAllFilters() {
    setSearchValue("");
    startTransition(() => {
      router.push("/shop", { scroll: false });
    });
  }

  const hasActiveFilters = currentCategory || currentManufacturer || currentSearch || currentSort || currentFeatured;

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden flex items-center gap-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:shadow-md transition-all mb-4"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasActiveFilters && (
          <span className="ml-auto bg-[#00bc8c] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full">
            !
          </span>
        )}
        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Sidebar */}
      <aside className={`${mobileOpen ? "block" : "hidden"} lg:block w-full lg:w-72 xl:w-80 shrink-0`}>
        <div className="bg-white dark:bg-slate-800/60 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.06)] dark:shadow-none p-6 space-y-7 sticky top-28">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#00bc8c]/10 p-2 rounded-xl">
                <SlidersHorizontal className="w-4 h-4 text-[#00bc8c]" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">Filters</h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search medicines..."
              className="w-full h-12 pl-11 pr-4 bg-slate-50/80 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00bc8c]/20 focus:border-[#00bc8c]/30 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            {searchValue && (
              <button
                type="button"
                onClick={() => { setSearchValue(""); updateParams("search", ""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Featured Filter */}
          <div className="pt-2">
            <button
              onClick={() => updateParams("featured", currentFeatured ? "" : "true")}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                currentFeatured
                  ? "bg-[#00bc8c] text-white border-[#00bc8c] shadow-lg shadow-[#00bc8c]/20"
                  : "bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30 hover:bg-amber-50 dark:hover:bg-amber-950/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <Star className={`w-4 h-4 ${currentFeatured ? "fill-white" : "fill-amber-400 animate-pulse"}`} />
                <span>Featured Only</span>
              </div>
              {currentFeatured && <X className="w-4 h-4 opacity-70" />}
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

          {/* Categories */}
          <div>
            <h4 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Category</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              <button
                onClick={() => updateParams("category", "")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${!currentCategory
                  ? "bg-[#00bc8c]/10 text-[#00bc8c]"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParams("category", cat.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${currentCategory === cat.id
                    ? "bg-[#00bc8c]/10 text-[#00bc8c]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

          {/* Manufacturers */}
          <div>
            <h4 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Manufacturer</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              <button
                onClick={() => updateParams("manufacturer", "")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${!currentManufacturer
                  ? "bg-[#00bc8c]/10 text-[#00bc8c]"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                All Brands
              </button>
              {manufacturers.map((mfr) => (
                <button
                  key={mfr}
                  onClick={() => updateParams("manufacturer", mfr)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${currentManufacturer === mfr
                    ? "bg-[#00bc8c]/10 text-[#00bc8c]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  {mfr}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

          {/* Sort */}
          <div>
            <h4 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Sort By</h4>
            <div className="space-y-1.5">
              {[
                { label: "Default", value: "" },
                { label: "Price: Low to High", value: "price-asc" },
                { label: "Price: High to Low", value: "price-desc" },
                { label: "Name: A-Z", value: "name-asc" },
                { label: "Newest First", value: "newest" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => updateParams("sort", opt.value)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${currentSort === opt.value
                    ? "bg-[#00bc8c]/10 text-[#00bc8c]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {isPending && (
            <div className="flex items-center justify-center py-2">
              <div className="w-5 h-5 border-2 border-[#00bc8c]/30 border-t-[#00bc8c] rounded-full animate-spin" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
