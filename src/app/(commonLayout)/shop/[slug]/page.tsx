/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { medicineService } from "@/services/medicine.service";
import { categoryService } from "@/services/category.service";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import {
  ChevronRight,
  Shield,
  Truck,
  RotateCcw,
  Package,
  Factory,
  Pill,
  Tag,
} from "lucide-react";
import { ReviewSection } from "@/components/reviews/review-section";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const medicine = await medicineService.getMedicineBySlug(slug);

  if (!medicine) {
    return { title: "Product Not Found | MediStore" };
  }

  return {
    title: `${medicine.name} | MediStore`,
    description:
      medicine.description ||
      `Buy ${medicine.name} from ${medicine.manufacturer} at the best price on MediStore.`,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const [medicine, categories, allMedicines] = await Promise.all([
    medicineService.getMedicineBySlug(slug),
    categoryService.getAllCategories(),
    medicineService.getAllMedicines(),
  ]);

  if (!medicine) {
    notFound();
  }

  const category = categories.find((c) => c.id === medicine.categoryId);
  const formattedPrice =
    typeof medicine.price === "string"
      ? parseFloat(medicine.price).toFixed(2)
      : (medicine.price as number).toFixed(2);

  const stockStatus =
    medicine.stock === 0
      ? { label: "Out of Stock", color: "red" }
      : medicine.stock <= 5
        ? { label: `Only ${medicine.stock} left`, color: "amber" }
        : { label: "In Stock", color: "emerald" };

  // Related products: same category, exclude current
  const relatedProducts = allMedicines
    .filter((m) => m.categoryId === medicine.categoryId && m.id !== medicine.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50/80 via-white to-slate-50/50 dark:from-slate-950/60 dark:via-slate-950 dark:to-slate-950">
      {/* Breadcrumbs */}
      <div className="border-b border-slate-100 bg-white/60 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/70">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link
              href="/"
              className="hover:text-[#00bc8c] transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href="/shop"
              className="hover:text-[#00bc8c] transition-colors"
            >
              Shop
            </Link>
            {category && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link
                  href={`/shop?category=${category.id}`}
                  className="hover:text-[#00bc8c] transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 font-bold truncate max-w-50 dark:text-slate-100">
              {medicine.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Image */}
          <div className="relative group">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
              <img
                src={
                  medicine.imageUrl ||
                  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"
                }
                alt={medicine.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
            </div>
            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {medicine.isFeatured && (
                <span className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/20 animate-pulse">
                  Featured
                </span>
              )}
              {medicine.stock <= 5 && medicine.stock > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                  Low Stock
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6 lg:py-4">
            {/* Category badge */}
            {category && (
              <Link
                href={`/shop?category=${category.id}`}
                className="inline-flex items-center gap-2 self-start bg-[#00bc8c]/10 text-[#00bc8c] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full hover:bg-[#00bc8c]/20 transition-colors"
              >
                <Tag className="w-3 h-3" />
                {category.name}
              </Link>
            )}

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight dark:text-slate-100">
                {medicine.name}
              </h1>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider flex items-center gap-2 dark:text-slate-400">
                <Factory className="w-4 h-4" />
                {medicine.manufacturer}
              </p>
            </div>

            {/* Price & Stock */}
            <div className="flex items-end gap-6 pb-2">
              <div>
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-tighter mb-1 dark:text-slate-400">
                  Price
                </p>
                <p className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100">
                  ${formattedPrice}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                  stockStatus.color === "emerald"
                    ? "bg-emerald-50 text-emerald-600"
                    : stockStatus.color === "amber"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-red-50 text-red-600"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    stockStatus.color === "emerald"
                      ? "bg-emerald-500 animate-pulse"
                      : stockStatus.color === "amber"
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                />
                {stockStatus.label}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-slate-200 via-slate-200 to-transparent dark:from-slate-700 dark:via-slate-700" />

            {/* Description */}
            {medicine.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider dark:text-slate-100">
                  Description
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium dark:text-slate-400">
                  {medicine.description}
                </p>
              </div>
            )}

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4">
              {medicine.dosageForm && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Pill className="w-4 h-4 text-[#00bc8c]" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest dark:text-slate-400">
                      Dosage Form
                    </p>
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {medicine.dosageForm}
                  </p>
                </div>
              )}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-1.5">
                  <Package className="w-4 h-4 text-[#00bc8c]" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest dark:text-slate-400">
                    Stock
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {medicine.stock} units
                </p>
              </div>
              {category && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Tag className="w-4 h-4 text-[#00bc8c]" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest dark:text-slate-400">
                      Category
                    </p>
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {category.name}
                  </p>
                </div>
              )}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-1.5">
                  <Factory className="w-4 h-4 text-[#00bc8c]" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest dark:text-slate-400">
                    Manufacturer
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {medicine.manufacturer}
                </p>
              </div>
            </div>

            {/* Add to Cart */}
            <AddToCartButton
              medicineId={medicine.id}
              disabled={medicine.stock === 0}
            />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col items-center gap-2 text-center p-3">
                <div className="bg-[#00bc8c]/10 p-2.5 rounded-xl">
                  <Shield className="w-5 h-5 text-[#00bc8c]" />
                </div>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight">
                  Verified
                  <br />
                  Authentic
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center p-3">
                <div className="bg-[#00bc8c]/10 p-2.5 rounded-xl">
                  <Truck className="w-5 h-5 text-[#00bc8c]" />
                </div>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight">
                  Fast
                  <br />
                  Delivery
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center p-3">
                <div className="bg-[#00bc8c]/10 p-2.5 rounded-xl">
                  <RotateCcw className="w-5 h-5 text-[#00bc8c]" />
                </div>
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-tight">
                  Easy
                  <br />
                  Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-white dark:bg-slate-950">
        <ReviewSection medicineId={medicine.id} />
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/80">
          <div className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1.5">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight dark:text-slate-100">
                  Related Products
                </h2>
                <p className="text-slate-400 font-bold text-sm dark:text-slate-400">
                  More from{" "}
                  {category ? category.name : "this category"}
                </p>
              </div>
              <Link
                href={`/shop${category ? `?category=${category.id}` : ""}`}
                className="text-sm font-bold text-[#00bc8c] hover:underline underline-offset-4 transition-all hidden sm:block"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((m) => (
                <Link
                  key={m.id}
                  href={`/shop/${m.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm hover:shadow-[0_15px_40px_-10px_rgba(0,188,140,0.12)] transition-all duration-500 h-full dark:bg-slate-900 dark:border-slate-800 dark:hover:shadow-none">
                    <div className="aspect-square rounded-[1.5rem] overflow-hidden bg-slate-50 mb-4 dark:bg-slate-950">
                      <img
                        src={
                          m.imageUrl ||
                          "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400"
                        }
                        alt={m.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-[10px] font-black text-[#00bc8c] uppercase tracking-widest mb-1">
                      {m.manufacturer}
                    </p>
                    <h4 className="text-base font-black text-slate-900 tracking-tight group-hover:text-[#00bc8c] transition-colors line-clamp-1 dark:text-slate-100">
                      {m.name}
                    </h4>
                    <p className="text-lg font-black text-slate-800 mt-2 dark:text-slate-100">
                      $
                      {typeof m.price === "string"
                        ? parseFloat(m.price).toFixed(2)
                        : (m.price as number).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
