"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, BriefcaseMedical, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { NavSearch } from "@/components/shared/nav-search";
import { useCart } from "@/hooks/use-cart";
import { CartDrawer } from "@/components/shared/cart-drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import dynamic from "next/dynamic";

const SellerNavbar = dynamic(() => import("@/components/seller/seller-navbar").then(mod => mod.SellerNavbar), {
  ssr: true, // We want it for SSR as well
});

export function Navbar() {
  const { user, isLoading } = useUser();
  const { cart } = useCart();
  const router = useRouter();

  // If user is a seller, show the specialized seller navbar
  if (user?.role === "SELLER") {
    return <SellerNavbar />;
  }

  // If user is an admin, don't show the global navbar
  if (user?.role === "ADMIN") {
    return null;
  }

  const cartCount = cart?.summary?.totalItems || 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="bg-[#00bc8c] p-2 rounded-xl shadow-lg shadow-[#00bc8c]/20 group-hover:scale-105 transition-all duration-300">
            <BriefcaseMedical className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#00bc8c]">
            MediStore
          </span>
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden md:block flex-1 max-w-xl mx-8">
          <NavSearch />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 shrink-0">
          <nav className="flex items-center gap-8 text-[13px] font-bold text-slate-600 uppercase tracking-wider">
            <Link href="/shop" className="hover:text-[#00bc8c] transition-colors">
              Shop
            </Link>
            <Link href="/categories" className="hover:text-[#00bc8c] transition-colors">
              All Categories
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl border border-slate-100/50 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-slate-100" />
                <div className="flex flex-col gap-1.5">
                  <div className="w-20 h-2.5 bg-slate-100 rounded" />
                  <div className="w-12 h-2 bg-slate-50 rounded" />
                </div>
              </div>
            ) : user ? (
              <Link href="/profile" className="flex items-center gap-3 p-1.5 pr-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#00bc8c]/10 flex items-center justify-center border-2 border-white shadow-sm group-hover:shadow-md transition-all">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#00bc8c] font-black text-lg">{user.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-black text-slate-800 leading-none">{user.name}</span>
                  <span className="text-[10px] font-bold text-[#00bc8c] uppercase tracking-wider">View Profile</span>
                </div>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button className="bg-[#00bc8c] hover:bg-[#00a37b] rounded-xl px-7 h-11 font-bold text-white shadow-lg shadow-[#00bc8c]/20 transition-all active:scale-95">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="border-[#00bc8c]/30 text-[#00bc8c] hover:bg-[#00bc8c]/5 rounded-xl px-7 h-11 font-bold transition-all active:scale-95">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Cart Section */}
          <CartDrawer>
            <button className="relative p-2.5 hover:bg-slate-50 rounded-2xl transition-all group active:scale-90">
              <ShoppingCart className="w-7 h-7 text-slate-600 group-hover:text-[#00bc8c] transition-colors duration-300" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black min-w-5 h-5 px-1 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </CartDrawer>
        </div>

        {/* Mobile menu - simplified for now */}
        <div className="lg:hidden flex items-center gap-4">
           <Link href="/cart" className="relative p-2">
            <ShoppingCart className="w-6 h-6 text-slate-600" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="w-7 h-7" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] rounded-l-[2rem]">
              <SheetHeader className="text-left mb-8">
                <SheetTitle className="flex items-center gap-2">
                   <div className="bg-[#00bc8c] p-1.5 rounded-lg">
                    <BriefcaseMedical className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-black text-[#00bc8c]">MediStore</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-8 py-4">
                 <NavSearch />
                 <nav className="flex flex-col gap-6 text-lg font-bold">
                    <Link href="/shop" className="hover:text-[#00bc8c] transition-colors">Shop</Link>
                    <Link href="/categories" className="hover:text-[#00bc8c] transition-colors">All Categories</Link>
                 </nav>
                 <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                    <Button className="w-full bg-[#00bc8c] hover:bg-[#00bc8c]/90 rounded-xl h-12 font-bold">Login</Button>
                    <Button variant="outline" className="w-full border-[#00bc8c]/20 text-[#00bc8c] rounded-xl h-12 font-bold">Register</Button>
                 </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
