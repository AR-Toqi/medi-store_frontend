"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Package, 
  Upload, 
  X, 
  Loader2, 
  ChevronLeft,
  Info,
  DollarSign,
  Layers,
  Factory,
  Pill
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useMedicineMutation } from "@/hooks/use-seller-medicine";
import { categoryService } from "@/services/category.service";
import { Category } from "@/types/category";
import { Medicine } from "@/types/medicine";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const medicineSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  manufacturer: z.string().min(2, "Manufacturer is required"),
  categoryId: z.string().min(1, "Category is required"),
  dosageForm: z.string().optional().default(""),
  isFeatured: z.boolean().default(false),
});

interface MedicineFormViewProps {
  initialData?: Medicine | null;
}

export function MedicineFormView({ initialData }: MedicineFormViewProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [preview, setPreview] = useState<string | null>(initialData?.imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { createMedicine, updateMedicine, isPending } = useMedicineMutation();
  const router = useRouter();
  const isEdit = !!initialData;

  // Using any to bypass complex generic type mismatches between Zod and React Hook Form version in this environment
  const form = useForm<any>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData ? (Number(initialData.price) || 0) : 0,
      stock: initialData?.stock || 0,
      manufacturer: initialData?.manufacturer || "",
      categoryId: initialData?.categoryId || "",
      dosageForm: initialData?.dosageForm || "",
      isFeatured: !!initialData?.isFeatured,
    },
  });

  useEffect(() => {
    categoryService.getAllCategories().then(setCategories);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setImageFile(null);
  };

  const onSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", String(values.price));
    formData.append("stock", String(values.stock));
    formData.append("manufacturer", values.manufacturer);
    formData.append("categoryId", values.categoryId);
    formData.append("dosageForm", values.dosageForm || "");
    formData.append("isFeatured", String(values.isFeatured));
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (isEdit && initialData) {
        await updateMedicine.mutateAsync({ id: initialData.id, formData });
      } else {
        await createMedicine.mutateAsync(formData);
      }
      router.push("/seller/manage-medicines");
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/seller/manage-medicines">
          <Button variant="ghost" size="icon" className="h-12 w-12 cursor-pointer rounded-xl hover:bg-slate-100">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black leading-none tracking-tight text-slate-900">
            {isEdit ? "Edit" : "Add New"} <span className="text-[#00bc8c]">Medicine</span>
          </h1>
          <p className="mt-2 font-medium text-muted-foreground">
            {isEdit ? "Update your medicine details and stock." : "List a new product to your pharmacy inventory."}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Image & Meta */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="overflow-hidden border-none bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Label className="mb-4 block text-sm font-black uppercase tracking-widest text-slate-900">Product Image</Label>
                  <div className={cn(
                    "group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-[#00bc8c]/50",
                    preview ? "border-solid" : ""
                  )}>
                    {preview ? (
                      <>
                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                        <button 
                          type="button" 
                          onClick={removeImage}
                          className="absolute right-2 top-2 cursor-pointer rounded-xl bg-red-500 p-1.5 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
                        <Upload className="mb-2 h-10 w-10 text-slate-300 transition-colors group-hover:text-[#00bc8c]" />
                        <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600">Click to upload</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                  <p className="mt-4 text-center font-medium leading-relaxed text-[10px] text-slate-400">
                    Recommended: 800x800px or higher. PNG, JPG supported. Max 5MB.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition-colors hover:bg-amber-50/30">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-bold text-slate-900">Feature Product</FormLabel>
                          <FormDescription className="font-medium uppercase tracking-tighter text-[10px] text-slate-400">Promote on homepage</FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-start gap-2.5 rounded-xl border border-blue-50 bg-blue-50/50 p-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                    <p className="font-medium leading-normal text-[11px] text-blue-600">
                      Featured products are prioritized in search results and shown on the specialized discovery section.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Main Details */}
            <div className="space-y-6 lg:col-span-2">
              <Card className="border-none bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
                <CardContent className="space-y-6 p-8">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-[#00bc8c]">Product Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Package className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                              <Input placeholder="Paracetamol 500mg" {...field} className="h-12 rounded-xl border-transparent bg-slate-50 pl-11 font-bold transition-all focus:bg-white focus:ring-2 focus:ring-[#00bc8c]/20" />
                            </div>
                          </FormControl>
                          <FormMessage className="font-bold text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-[#00bc8c]">Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl border-transparent bg-slate-50 font-bold focus:bg-white">
                                <div className="flex items-center gap-2">
                                  <Layers className="h-4 w-4 text-slate-300" />
                                  <SelectValue placeholder="Select category" />
                                </div>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id} className="cursor-pointer rounded-lg font-bold text-slate-600">
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="font-bold text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manufacturer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-[#00bc8c]">Manufacturer</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Factory className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                              <Input placeholder="Square Pharmaceuticals" {...field} className="h-12 rounded-xl border-transparent bg-slate-50 pl-11 font-bold transition-all focus:bg-white" />
                            </div>
                          </FormControl>
                          <FormMessage className="font-bold text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-[#00bc8c]">Unit Price ($)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                              <Input 
                                type="number" 
                                step="0.01" 
                                {...field} 
                                className="h-12 rounded-xl border-transparent bg-slate-50 pl-11 font-bold transition-all focus:bg-white" 
                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="font-bold text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-[#00bc8c]">Stock Inventory</FormLabel>
                          <FormControl>
                             <div className="relative">
                              <Package className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                              <Input 
                                type="number" 
                                {...field} 
                                className="h-12 rounded-xl border-transparent bg-slate-50 pl-11 font-bold transition-all focus:bg-white" 
                                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="font-bold text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dosageForm"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-[#00bc8c]">Dosage Form</FormLabel>
                          <FormControl>
                             <div className="relative">
                              <Pill className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                              <Input placeholder="Tablet, Syrup, Injection, etc." {...field} className="h-12 rounded-xl border-transparent bg-slate-50 pl-11 font-bold transition-all focus:bg-white" />
                            </div>
                          </FormControl>
                          <FormMessage className="font-bold text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className="text-xs font-black uppercase tracking-widest text-[#00bc8c]">Description & Usage</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the medicine and usage instructions..." 
                              {...field} 
                              className="min-h-[120px] rounded-xl border-transparent bg-slate-50 px-5 py-4 font-medium transition-all focus:bg-white"
                            />
                          </FormControl>
                          <FormMessage className="font-bold text-[11px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-end gap-4 pt-4">
                <Link href="/seller/manage-medicines">
                  <Button variant="ghost" type="button" className="h-12 cursor-pointer rounded-xl px-8 font-bold text-slate-500">
                    Discard
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="h-12 cursor-pointer gap-2 rounded-xl bg-[#00bc8c] px-10 font-bold text-white shadow-lg shadow-[#00bc8c]/20 transition-all hover:bg-[#00a37b] active:scale-95"
                >
                  {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : isEdit ? "Update Medicine" : "Create Listing"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
