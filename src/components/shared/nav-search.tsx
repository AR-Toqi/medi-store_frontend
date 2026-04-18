"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, Pill, Tag, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { medicineService } from "@/services/medicine.service";
import { categoryService } from "@/services/category.service";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";

export function NavSearch() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch medicines based on debounced search
  const { data: medicines, isLoading: isLoadingMedicines } = useQuery({
    queryKey: ["medicines", "search", debouncedSearch],
    queryFn: () => medicineService.getAllMedicines({ search: debouncedSearch, limit: 5 }),
    enabled: debouncedSearch.length > 1,
  });

  // Fetch all categories for client-side filtering
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAllCategories(),
  });

  // Filter categories client-side
  const filteredCategories = categories?.filter((cat) =>
    cat.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  ).slice(0, 3) || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(e?: React.SyntheticEvent) {
    e?.preventDefault();
    if (searchValue.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchValue.trim())}`);
      setIsOpen(false);
    }
  }

  const hasResults = (medicines && medicines.length > 0) || filteredCategories.length > 0;
  const showDropdown = isOpen && debouncedSearch.length > 1;

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl md:mx-8">
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search medicines..."
          className="w-full h-11 md:h-12 pl-12 pr-10 bg-slate-50/80 border border-slate-100 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#00bc8c]/10 focus:border-[#00bc8c]/30 focus:bg-white transition-all duration-300 shadow-inner group-hover:shadow-md"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#00bc8c] transition-colors" />
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Dropdown Results */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-4 border-b border-slate-50 bg-slate-50/50">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Live Search Results</p>
          </div>

          <div className="max-h-[min(480px,70vh)] overflow-y-auto custom-scrollbar">
            {isLoadingMedicines && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <p className="text-xs font-bold">Searching the pharmacy...</p>
              </div>
            )}

            {!isLoadingMedicines && !hasResults && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <p className="text-sm font-bold">No matches found for "{debouncedSearch}"</p>
                <p className="text-[10px] uppercase tracking-wider mt-1 opacity-60">Try different keywords</p>
              </div>
            )}

            {!isLoadingMedicines && hasResults && (
              <div className="p-3 space-y-4">
                {/* Medicines Section */}
                {medicines && medicines.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black text-[#00bc8c] uppercase tracking-widest px-3 mb-2 flex items-center gap-2">
                       <Pill className="w-3 h-3" /> Medicines
                    </h4>
                    <div className="space-y-1">
                      {medicines.map((item) => (
                        <Link
                          key={item.id}
                          href={`/shop/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 group-hover:scale-105 transition-transform">
                            <img 
                              src={item.imageUrl || "https://placehold.co/100x100?text=+"} 
                              alt={item.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-800 truncate group-hover:text-[#00bc8c] transition-colors">{item.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-0.5">{item.manufacturer}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-black text-slate-900">${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price as string).toFixed(2)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories Section */}
                {filteredCategories.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-3 mb-2 flex items-center gap-2 border-t border-slate-50 pt-4">
                       <Tag className="w-3 h-3" /> Categories
                    </h4>
                    <div className="grid grid-cols-1 gap-1 px-1">
                      {filteredCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${cat.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-all group"
                        >
                          <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">{cat.name}</span>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
            <button 
              onClick={() => handleSearch()}
              className="text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-[#00bc8c] transition-colors flex items-center gap-2"
            >
              See all results for &ldquo;{debouncedSearch}&rdquo; <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
