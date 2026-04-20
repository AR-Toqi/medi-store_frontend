"use client";

import React, { useState } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star, 
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSellerMedicines, useMedicineMutation } from "@/hooks/use-seller-medicine";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function MedicinesView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useSellerMedicines({ page, search, limit: 10 });
  const { deleteMedicine, toggleFeatured } = useMedicineMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const medicines = data?.data || [];
  const meta = data?.meta;

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMedicine.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 border-l-4 border-[#00bc8c] pl-4">
            Medicine <span className="text-[#00bc8c]">Inventory</span>
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Manage your pharmacy stock, pricing, and visibility.
          </p>
        </div>
        <Link href="/seller/manage-medicines/add">
          <Button className="bg-[#00bc8c] hover:bg-[#00a37b] text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-[#00bc8c]/20 gap-2 cursor-pointer transition-transform hover:-translate-y-0.5">
            <Plus className="h-5 w-5" />
            Add New Medicine
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white/80 backdrop-blur-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by name..." 
              className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00bc8c]/20"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-100">
            Total Results: <span className="text-[#00bc8c]">{meta?.total || 0}</span>
          </div>
        </div>

        <CardContent className="p-0 overflow-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Medicine Info</TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Category</TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Price</TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Stock</TableHead>
                  <TableHead className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                  <TableHead className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-widest text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-40">
                         <Package className="h-12 w-12" />
                         <p className="font-bold">No medicines found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  medicines.map((item) => (
                    <TableRow key={item.id} className="group border-slate-50">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-100 overflow-hidden flex-shrink-0 group-hover:border-[#00bc8c]/30 transition-colors">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-slate-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-slate-900 group-hover:text-[#00bc8c] transition-colors truncate">{item.name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter truncate">{item.manufacturer}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge variant="secondary" className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-lg">
                          {item.categoryId?.slice(0, 8)}...
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-black text-slate-800">
                        ${typeof item.price === 'string' ? parseFloat(item.price).toFixed(2) : item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <span className={`font-bold ${item.stock < 10 ? "text-red-500" : "text-slate-700"}`}>
                             {item.stock}
                           </span>
                           {item.stock < 10 && (
                             <AlertTriangle className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                           )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                         <div className="flex items-center gap-4">
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             onClick={() => toggleFeatured.mutate(item.id)}
                             disabled={toggleFeatured.isPending}
                             className={`h-8 px-2 rounded-lg gap-1.5 font-bold text-[10px] uppercase cursor-pointer ${item.isFeatured ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-slate-100 text-slate-400 opacity-50 hover:bg-slate-200"}`}
                           >
                             <Star className={`h-3 w-3 ${item.isFeatured ? "fill-amber-600" : ""}`} />
                             {item.isFeatured ? "Featured" : "Standard"}
                           </Button>
                         </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-[#00bc8c]/10 hover:text-[#00bc8c] cursor-pointer">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 border-slate-100 shadow-2xl">
                            <DropdownMenuItem asChild className="rounded-lg font-bold text-slate-600 focus:bg-[#00bc8c]/10 focus:text-[#00bc8c] cursor-pointer">
                              <Link href={`/seller/manage-medicines/edit/${item.id}`} className="flex items-center gap-2">
                                <Edit2 className="h-4 w-4" /> Edit Medicine
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            <DropdownMenuItem 
                              className="rounded-lg font-bold text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                              onClick={() => setDeleteId(item.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" /> Delete Item
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>

        {meta && meta.totalPages > 1 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="rounded-xl font-bold h-10 px-4 border-slate-200 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-sm font-black text-slate-400">
              Page <span className="text-[#00bc8c]">{page}</span> of {meta.totalPages}
            </span>
            <Button 
              variant="outline" 
              disabled={page === meta.totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="rounded-xl font-bold h-10 px-4 border-slate-200 cursor-pointer"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-slate-900">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium">
              This action cannot be undone. This will permanently delete the medicine and remove it from the public shop.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl font-bold border-slate-100 hover:bg-slate-50 cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="rounded-xl font-bold bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 cursor-pointer"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
