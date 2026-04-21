"use client";

import React, { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Layers,
  Search,
  ImageOff,
  FolderOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-admin-categories";
import { CategoryFormModal } from "./category-form-modal";
import { toast } from "sonner";
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

export function AdminCategoriesView() {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingCategory, setDeletingCategory] = useState<any>(null);

  const { data: categories, isLoading } = useAdminCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const filteredCategories = (categories || []).filter((cat: any) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData: FormData) => {
    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, formData },
        {
          onSuccess: () => {
            toast.success("Category updated successfully!");
            setIsFormOpen(false);
            setEditingCategory(null);
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to update category");
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Category created successfully!");
          setIsFormOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to create category");
        },
      });
    }
  };

  const handleDelete = () => {
    if (!deletingCategory) return;
    deleteMutation.mutate(deletingCategory.id, {
      onSuccess: () => {
        toast.success("Category deleted successfully!");
        setDeletingCategory(null);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete category");
      },
    });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
              Category Management
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">
              Organize your platform&apos;s medicine taxonomy
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search categories..."
              className="pl-11 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all font-medium text-slate-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            onClick={handleCreate}
            className="h-14 px-8 rounded-2xl bg-[#00bc8c] hover:bg-[#00a67c] text-white font-black uppercase text-xs tracking-widest gap-2 cursor-pointer shadow-lg shadow-[#00bc8c]/20"
          >
            <Plus className="w-5 h-5" />
            New Category
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array(8)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-[2rem]" />
            ))
        ) : filteredCategories.length > 0 ? (
          filteredCategories.map((category: any) => (
            <Card
              key={category.id}
              className="group border-none shadow-lg shadow-slate-200/60 rounded-[2rem] overflow-hidden bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div className={`flex items-center justify-center h-full text-slate-300 ${category.image ? "hidden" : ""}`}>
                  <ImageOff className="w-10 h-10" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Status Badge */}
                <Badge
                  className={`absolute top-4 left-4 border-none font-black uppercase text-[9px] tracking-widest px-3 py-1 rounded-full shadow-sm ${
                    category.isActive
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-[#00bc8c] transition-colors mb-1 line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium line-clamp-2 min-h-[40px]">
                    {category.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="flex-1 h-11 rounded-xl border-slate-200 hover:border-[#00bc8c] hover:text-[#00bc8c] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer gap-1.5"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingCategory(category)}
                    className="h-11 w-11 rounded-xl border-slate-200 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                <FolderOpen className="w-10 h-10" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">
                  No categories found
                </p>
                <p className="text-slate-400 font-medium">
                  {search
                    ? "Try adjusting your search criteria"
                    : 'Click "New Category" to get started'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <CategoryFormModal
        category={editingCategory}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
      >
        <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black text-slate-900">
              Delete Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-700">
                &quot;{deletingCategory?.name}&quot;
              </span>
              ? This will also remove all medicines in this category. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="h-12 rounded-xl border-slate-200 font-bold cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black uppercase text-xs tracking-widest cursor-pointer"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
