"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Store, 
  User, 
  Mail, 
  Layers, 
  Activity, 
  Info,
  Beaker,
  ShieldCheck,
  Tag
} from "lucide-react";

interface MedicineDetailsModalProps {
  medicine: any;
  isOpen: boolean;
  onClose: () => void;
}

export function MedicineDetailsModal({ medicine, isOpen, onClose }: MedicineDetailsModalProps) {
  if (!medicine) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0">
        {/* Header Section with Image Overlay */}
        <div className="relative h-72 bg-slate-900 overflow-hidden group">
          <img 
            src={medicine.imageUrl} 
            alt={medicine.name}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-10 w-full">
             <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-[#00bc8c] text-white border-none font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-full">
                  {medicine.category.name}
                </Badge>
                {medicine.isFeatured && (
                  <Badge className="bg-amber-500 text-white border-none font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Featured
                  </Badge>
                )}
             </div>
             <DialogHeader className="text-left">
                <DialogTitle className="text-4xl font-black text-white tracking-tight leading-tight">
                  {medicine.name}
                </DialogTitle>
                <DialogDescription className="text-slate-300 font-bold text-lg mt-2 flex items-center gap-2">
                   <Tag className="w-5 h-5 text-[#00bc8c]" />
                   {formatCurrency(medicine.price)}
                </DialogDescription>
             </DialogHeader>
          </div>
        </div>

        <div className="p-10 bg-slate-50/50 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
               <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <Info className="w-6 h-6" />
                     </div>
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Product Description</h3>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed text-lg">
                    {medicine.description || "No description provided for this medicine."}
                  </p>
               </section>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard 
                    icon={<Beaker className="w-5 h-5" />} 
                    title="Dosage Form" 
                    value={medicine.dosageForm || "N/A"} 
                    color="purple" 
                  />
                  <InfoCard 
                    icon={<ShieldCheck className="w-5 h-5" />} 
                    title="Manufacturer" 
                    value={medicine.manufacturer || "Unknown"} 
                    color="amber" 
                  />
                  <InfoCard 
                    icon={<Layers className="w-5 h-5" />} 
                    title="Stock Inventory" 
                    value={`${medicine.stock} units available`} 
                    color="emerald" 
                  />
                  <InfoCard 
                    icon={<Package className="w-5 h-5" />} 
                    title="SKU Number" 
                    value={medicine.id.toUpperCase().slice(0, 12)} 
                    color="slate" 
                  />
               </div>
            </div>

            {/* Seller Sidebar */}
            <div className="space-y-6">
                <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm sticky top-4">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="p-3 bg-[#00bc8c]/10 text-[#00bc8c] rounded-2xl">
                        <Store className="w-6 h-6" />
                     </div>
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Seller Profile</h3>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shop Name</span>
                        <span className="text-xl font-black text-slate-900">{medicine.seller?.shopName || "Platform Seller"}</span>
                     </div>

                     <div className="space-y-4 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-3">
                           <User className="w-4 h-4 text-slate-400" />
                           <span className="text-sm font-bold text-slate-600">{medicine.seller?.user?.name || "Verified Provider"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Mail className="w-4 h-4 text-slate-400" />
                           <span className="text-sm font-bold text-slate-600 truncate">{medicine.seller?.user?.email || "N/A"}</span>
                        </div>
                     </div>

                     <Badge variant="outline" className="w-full justify-center py-3 rounded-xl border-dashed border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-widest bg-slate-50">
                        Admin Monitored Listing
                     </Badge>
                  </div>
                </section>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoCard({ icon, title, value, color }: any) {
  const colors: any = {
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-50 text-slate-600"
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
       <div className={`p-3 w-fit rounded-2xl mb-4 group-hover:scale-110 transition-transform ${colors[color]}`}>
          {icon}
       </div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
       <p className="font-bold text-slate-900 truncate">{value}</p>
    </div>
  );
}
