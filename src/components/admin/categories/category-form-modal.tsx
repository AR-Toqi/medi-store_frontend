/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2 } from "lucide-react";

interface CategoryFormModalProps {
  category?: any; // null for create, object for edit
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

export function CategoryFormModal({
  category,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!category;

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setImagePreview(category.image || null);
      setImageFile(null);
    } else {
      setName("");
      setDescription("");
      setImagePreview(null);
      setImageFile(null);
    }
  }, [category, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (description) formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-black tracking-tight text-white">
              {isEditing ? "Edit Category" : "Create New Category"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 font-medium mt-1">
              {isEditing
                ? "Update the details of this category."
                : "Add a new category to the platform."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Image Upload */}
          <div>
            <Label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">
              Category Image
            </Label>
            <div
              className="relative w-full h-44 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#00bc8c] transition-colors flex items-center justify-center cursor-pointer overflow-hidden group bg-slate-50 dark:bg-slate-800/50"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-bold text-sm">
                      Click to change
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-[#00bc8c] transition-colors">
                  <ImagePlus className="w-8 h-8" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Upload Image
                  </span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <Label
              htmlFor="cat-name"
              className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block"
            >
              Category Name
            </Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pain Relief, Vitamins..."
              className="h-14 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 font-medium text-slate-900 dark:text-slate-100"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label
              htmlFor="cat-desc"
              className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block"
            >
              Description (Optional)
            </Label>
            <Textarea
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of this category..."
              className="rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 font-medium text-slate-900 dark:text-slate-100 min-h-25 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-14 rounded-xl border-slate-200 font-black uppercase text-xs tracking-widest cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="flex-1 h-14 rounded-xl bg-[#00bc8c] hover:bg-[#00a67c] text-white font-black uppercase text-xs tracking-widest cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
