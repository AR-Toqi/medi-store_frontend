"use client";

import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Eye, 
  Trash2, 
  Pencil,
  ChevronLeft,
  ChevronRight,
  Beaker,
  Layers,
  Store,
  Star,
  PackageSearch,
  LayoutGrid
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminMedicines } from "@/hooks/use-admin-medicines";
import { Skeleton } from "@/components/ui/skeleton";
import { MedicineDetailsModal } from "./medicine-details-modal";
import { cn } from "@/lib/utils";

export function AdminMedicinesView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useAdminMedicines({
    page,
    limit: 10,
    search: search || undefined,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleOpenDetails = (medicine: any) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#00bc8c]">
              <PackageSearch className="w-8 h-8" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Global Inventory</h1>
              <p className="text-slate-500 font-medium tracking-tight">Monitor and manage all medicine listings across the platform</p>
           </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by medicine name, desc, or category..." 
              className="pl-11 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium text-slate-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid List for better visualization of products */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => (
             <Skeleton key={i} className="h-[400px] rounded-[2rem]" />
          ))
        ) : data?.data?.length > 0 ? (
          data.data.map((medicine: any) => (
            <Card key={medicine.id} className="group border-none shadow-lg shadow-slate-200/60 rounded-[2rem] overflow-hidden bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
               <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={medicine.imageUrl} 
                    alt={medicine.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                     <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-none font-black uppercase text-[9px] tracking-widest px-3 py-1 rounded-full shadow-sm">
                        {medicine.category.name}
                     </Badge>
                     {medicine.isFeatured && (
                       <Badge className="bg-amber-500 text-white border-none font-black uppercase text-[9px] tracking-widest px-2 py-1 rounded-full shadow-lg">
                          <Star className="w-3 h-3 fill-white" />
                       </Badge>
                     )}
                  </div>
               </div>

               <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="text-xl font-black text-slate-900 leading-tight mb-1 group-hover:text-[#00bc8c] transition-colors line-clamp-1">{medicine.name}</h3>
                        <div className="flex items-center gap-1.5 text-slate-400">
                           <Store className="w-3.5 h-3.5" />
                           <span className="text-xs font-bold uppercase tracking-widest truncate max-w-[120px]">{medicine.seller?.shopName || "Platform Seller"}</span>
                        </div>
                     </div>
                     <p className="text-xl font-black text-[#00bc8c]">{formatCurrency(medicine.price)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="bg-slate-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Stock</p>
                        <div className="flex items-center gap-2">
                           <Layers className={`w-3 h-3 ${medicine.stock < 10 ? 'text-red-500' : 'text-slate-400'}`} />
                           <span className={`text-sm font-black ${medicine.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>{medicine.stock} units</span>
                        </div>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Form</p>
                        <div className="flex items-center gap-2">
                           <Beaker className="w-3 h-3 text-slate-400" />
                           <span className="text-sm font-black text-slate-700 truncate">{medicine.dosageForm || "N/A"}</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-2">
                     <Button 
                        className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-xs tracking-widest transition-all cursor-pointer"
                        onClick={() => handleOpenDetails(medicine)}
                     >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                     </Button>
                  </div>
               </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
             <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                   <PackageSearch className="w-10 h-10" />
                </div>
                <div>
                   <p className="text-2xl font-black text-slate-900 tracking-tight">No medicines found</p>
                   <p className="text-slate-400 font-medium">Try adjusting your search criteria</p>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-10">
          <Button 
            variant="outline" 
            size="icon" 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="w-12 h-12 rounded-2xl border-slate-200 hover:border-[#00bc8c] hover:text-[#00bc8c] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
             {[...Array(data.meta.totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "outline"}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "w-12 h-12 rounded-2xl font-black transition-all cursor-pointer text-sm shadow-sm",
                    page === i + 1 
                    ? "bg-[#00bc8c] hover:bg-[#00bc8c]/90 text-white" 
                    : "border-slate-200 hover:border-[#00bc8c] text-slate-500 hover:text-[#00bc8c]"
                  )}
                >
                  {i + 1}
                </Button>
             ))}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            disabled={page === data.meta.totalPages}
            onClick={() => setPage(page + 1)}
            className="w-12 h-12 rounded-2xl border-slate-200 hover:border-[#00bc8c] hover:text-[#00bc8c] transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Details Modal */}
      <MedicineDetailsModal 
        medicine={selectedMedicine} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
