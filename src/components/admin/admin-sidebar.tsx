"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Package, 
  Layers, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  BriefcaseMedical,
  Store,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { userService } from "@/services/user.service";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Order Management", href: "/admin/orders", icon: ShoppingBag },
  { name: "Medicine Inventory", href: "/admin/medicines", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await userService.logout();
    router.push("/login");
  };

  return (
    <aside 
      className={cn(
        "relative h-screen flex flex-col bg-slate-900 text-slate-400 transition-all duration-300 ease-in-out border-r border-slate-800 z-40 shadow-2xl",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-[#00bc8c] p-2 rounded-xl shrink-0 shadow-lg shadow-[#00bc8c]/20">
          <BriefcaseMedical className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        {!isCollapsed && (
          <span className="text-xl font-black text-white tracking-tight animate-in fade-in transition-all duration-500">
            MediStore <span className="text-[#00bc8c]">Admin</span>
          </span>
        )}
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-[#00bc8c] text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95 z-50 cursor-pointer"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* User Quick Info */}
      <div className={cn(
        "px-6 py-6 border-b border-slate-800/50 mb-4",
        isCollapsed ? "items-center" : ""
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00bc8c]/10 border border-[#00bc8c]/10 flex items-center justify-center text-[#00bc8c] font-black shrink-0 overflow-hidden shadow-inner">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 animate-in slide-in-from-left-2">
              <p className="text-sm font-black text-white truncate leading-none mb-1">{user?.name}</p>
              <Badge className="bg-blue-500/10 text-blue-400 border-none text-[9px] font-black px-1.5 py-0 rounded-md uppercase tracking-widest">
                Administrator
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-grow px-3 space-y-1.5 overflow-y-auto overflow-x-hidden py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all group relative",
                isActive 
                  ? "bg-[#00bc8c] text-white shadow-lg shadow-[#00bc8c]/20" 
                  : "hover:bg-slate-800/50 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                isActive ? "text-white" : "text-slate-500"
              )} />
              {!isCollapsed && (
                <span className="text-sm tracking-tight whitespace-nowrap animate-in fade-in duration-300">
                  {item.name}
                </span>
              )}
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-2xl border border-slate-800 font-bold z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 mt-auto border-t border-slate-800/50 space-y-2">
        {!isCollapsed && (
          <div className="bg-slate-800/40 p-4 rounded-2xl mb-4 text-xs font-medium space-y-3 border border-slate-800/30">
            <p className="text-slate-500 px-1 font-black uppercase tracking-widest text-[9px]">Notifications</p>
            <div className="flex items-center justify-between text-slate-300 hover:text-white cursor-pointer group">
              <div className="flex items-center gap-2">
                 <Bell className="w-3.5 h-3.5" />
                 <span>Platform Alerts</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#00bc8c] shadow-[0_0_8px_rgba(0,188,140,0.5)]" />
            </div>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all group cursor-pointer",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span className="text-sm tracking-tight">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium border", className)}>
      {children}
    </span>
  );
}
