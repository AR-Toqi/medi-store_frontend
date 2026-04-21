"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Plus, 
  Menu, 
  BriefcaseMedical,
  Store,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SELLER_LINKS = [
  { name: "Dashboard", href: "/seller/dashboard", icon: LayoutDashboard },
  { name: "My Medicines", href: "/seller/manage-medicines", icon: Package },
  { name: "Seller Orders", href: "/seller/orders", icon: ShoppingBag },
];

export function SellerNavbar() {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-slate-900 text-white shadow-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Section */}
        <div className="flex items-center gap-8">
          <Link href="/seller/dashboard" className="flex items-center gap-2.5 group shrink-0">
            <div className="bg-[#00bc8c] p-2 rounded-xl shadow-lg shadow-[#00bc8c]/20 group-hover:scale-105 transition-all duration-300">
              <BriefcaseMedical className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white leading-none">
                MediStore <span className="text-[#00bc8c]">Pro</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Seller Command Center
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {SELLER_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
                    isActive 
                      ? "bg-[#00bc8c] text-white shadow-lg shadow-[#00bc8c]/20" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
            <Link 
              href="/shop" 
              className="text-[11px] font-black text-slate-400 hover:text-[#00bc8c] uppercase tracking-widest transition-colors flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              Customer View
            </Link>
          </div>

          <div className="h-8 w-px bg-white/10 hidden md:block" />

          {/* Profile Section */}
          <div className="flex items-center gap-3 pl-2">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-black text-white leading-none">{user.name}</span>
              <span className="text-[10px] font-bold text-[#00bc8c] uppercase tracking-widest mt-1">Verified Seller</span>
            </div>
            
            <div className="group relative">
               <div className="w-11 h-11 rounded-2xl bg-[#00bc8c]/20 border-2 border-[#00bc8c]/30 p-0.5 overflow-hidden transition-all group-hover:border-[#00bc8c] cursor-pointer">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-[14px]" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 rounded-[14px]">
                      <UserIcon className="w-5 h-5 text-[#00bc8c]" />
                    </div>
                  )}
               </div>
               
               {/* Dropdown - Simple impl via CSS or a separate menu component */}
               <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                    <UserIcon className="w-4 h-4" /> My Profile
                  </Link>
                  <button 
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
               </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <Link href="/seller/manage-medicines/add" className="hidden sm:block">
            <Button className="bg-[#00bc8c] hover:bg-[#00a37b] text-white rounded-xl h-11 px-5 font-bold shadow-lg shadow-[#00bc8c]/20 gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/5 rounded-xl h-11 w-11">
                  <Menu className="w-7 h-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-slate-900 border-slate-800 text-white p-0">
                <SheetHeader className="p-6 text-left border-b border-slate-800">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="bg-[#00bc8c] p-1.5 rounded-lg">
                      <BriefcaseMedical className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-black text-[#00bc8c]">MediStore Pro</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="p-6 space-y-6">
                  <nav className="flex flex-col gap-2">
                    {SELLER_LINKS.map((link) => {
                      const isActive = pathname === link.href;
                      const Icon = link.icon;
                      return (
                        <Link 
                          key={link.href} 
                          href={link.href}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-2xl text-base font-bold transition-all",
                            isActive 
                              ? "bg-[#00bc8c] text-white" 
                              : "text-slate-400 hover:bg-white/5"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            {link.name}
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-50" />
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="pt-4 space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Context Switch</p>
                       <Link 
                        href="/shop" 
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-800 text-sm font-bold text-[#00bc8c] hover:bg-slate-700 transition-colors"
                      >
                        <Store className="w-4 h-4" />
                        Go to Customer Shop
                      </Link>
                    </div>

                    <Button 
                      onClick={() => logout()}
                      variant="ghost" 
                      className="w-full h-14 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 hover:text-red-500 justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" /> Logout Account
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>

      </div>
    </header>
  );
}
