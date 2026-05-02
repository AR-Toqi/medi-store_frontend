"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, X, Loader2, ShoppingCart } from "lucide-react";
import { aiService, SemanticSearchResponse } from "@/services/ai.service";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function SemanticSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SemanticSearchResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown and collapse on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsExpanded(false);
        setQuery(""); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery || debouncedQuery.length < 3) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await aiService.semanticSearch(debouncedQuery);
        setResults(searchResults);
        setIsOpen(true);
      } catch (error) {
        console.error("Semantic search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className={cn(
        "flex items-center transition-all duration-500 ease-in-out",
        isExpanded ? "w-[400px] max-w-[calc(100vw-48px)]" : "w-16"
      )}>
        {/* AI Trigger Button - Circular like a chatbot */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shrink-0 shadow-[0_10px_30px_rgba(0,188,140,0.3)] border-4 border-white z-20 hover:scale-110 active:scale-95",
            isExpanded 
              ? "bg-white text-[#00bc8c] -mr-16" 
              : "bg-[#00bc8c] text-white"
          )}
        >
          {isExpanded ? <X className="w-8 h-8" /> : <Sparkles className="w-8 h-8 animate-pulse" />}
        </button>

        {/* Expanding Search Bar - Slides out to the right */}
        <div className={cn(
          "relative flex items-center p-1 bg-white/90 backdrop-blur-xl rounded-full border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-500 ease-in-out",
          isExpanded ? "w-full opacity-100 translate-x-4" : "w-0 opacity-0 translate-x-0 pointer-events-none"
        )}>
          <div className="absolute left-5 text-[#00bc8c] z-10">
            <Search className="w-5 h-5" />
          </div>
          
          <Input
            ref={inputRef}
            type="text"
            placeholder="Describe what you need..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 3 && setIsOpen(true)}
            className="h-14 pl-12 pr-12 rounded-full bg-white border-transparent text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:border-transparent transition-all duration-300"
          />

          {query && (
            <button 
              onClick={clearSearch}
              className="absolute right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Dropdown - Pops UP */}
      {isOpen && isExpanded && (
        <div className="absolute bottom-full left-0 w-[400px] max-w-[calc(100vw-48px)] mb-6 bg-white rounded-[2.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-5 bg-gradient-to-r from-[#00bc8c] to-[#00d4a1] text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">
                AI Semantic Search
              </span>
            </div>
            <span className="text-[10px] font-bold opacity-80">Powered by Gemini</span>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
            {results.length > 0 ? (
              results.map((medicine) => (
                <Link 
                  key={medicine.id} 
                  href={`/shop/${medicine.slug}`}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#00bc8c]/5 transition-colors group/item"
                >
                  <div className="relative w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    {medicine.imageUrl ? (
                      <Image 
                        src={medicine.imageUrl} 
                        alt={medicine.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-slate-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 truncate group-hover/item:text-[#00bc8c] transition-colors">
                      {medicine.name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{medicine.manufacturer}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-black text-[#00bc8c]">৳{medicine.price}</span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold",
                        medicine.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      )}>
                        {medicine.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No matches found. Try describing your symptoms!</p>
              </div>
            )}
          </div>
          
          {results.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button className="text-xs font-bold text-slate-500 hover:text-[#00bc8c] transition-colors">
                View all search results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
