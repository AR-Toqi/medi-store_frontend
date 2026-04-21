"use client";

import React from "react";
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Store, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Package, 
  CheckCircle2, 
  AlertCircle,
  LayoutDashboard,
  PlusCircle,
  Settings,
  ChevronRight,
  UserPlus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { AdminStats } from "@/hooks/use-admin-stats";

interface AdminDashboardViewProps {
  stats: AdminStats;
  user: any;
}

export function AdminDashboardView({ stats, user }: AdminDashboardViewProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-[1600px] mx-auto pb-20">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-12 text-white shadow-2xl shadow-slate-200">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <Badge className="bg-[#00bc8c] hover:bg-[#00bc8c] border-none text-white px-3 py-1 font-black uppercase tracking-widest text-[10px]">
            Platform Overview
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Welcome back, <span className="text-[#00bc8c]">{user?.name}</span>.
          </h1>
          <p className="text-slate-400 font-medium text-lg md:text-xl leading-relaxed">
            Here&apos;s a quick heartbeat of yours MediStore platform. You have <span className="text-white font-bold">{stats?.totalOrders}</span> total orders to date.
          </p>
          <div className="flex flex-wrap gap-3 pt-4">
            <Link href="/admin/users">
              <Button size="lg" className="rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black h-14 px-8 shadow-xl shadow-black/20 gap-2 border-none">
                <Users className="w-5 h-5" />
                Manage Community
              </Button>
            </Link>
          </div>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#00bc8c]/10 blur-[100px] -mr-20 -mt-20 rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-1/4 h-1/2 bg-blue-500/10 blur-[80px] -ml-20 -mb-20 rounded-full" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(stats?.totalRevenue || 0)} 
          icon={<DollarSign className="w-6 h-6" />} 
          trend="+12.5%" 
          description="Platform earnings"
          color="bg-emerald-500"
        />
        <StatCard 
          title="Active Users" 
          value={stats?.totalUsers.toString() || "0"} 
          icon={<Users className="w-6 h-6" />} 
          trend="+4.2%" 
          description="Registered members"
          color="bg-blue-500"
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders.toString() || "0"} 
          icon={<ShoppingBag className="w-6 h-6" />} 
          trend="+8.1%" 
          description="Completed sales"
          color="bg-amber-500"
        />
        <StatCard 
          title="Active Sellers" 
          value={stats?.totalSellers.toString() || "0"} 
          icon={<Store className="w-6 h-6" />} 
          trend="+2.4%" 
          description="Verified merchants"
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/60 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Clock className="w-6 h-6 text-[#00bc8c]" />
                  Recent Orders
                </CardTitle>
                <CardDescription className="font-medium text-slate-500">The last 5 transactions on the platform</CardDescription>
              </div>
              <Link href="/admin/orders">
                <Button variant="ghost" className="rounded-xl font-bold text-[#00bc8c] hover:bg-[#00bc8c]/10 gap-2 cursor-pointer">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                    <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Total</th>
                    <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="p-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats?.recentOrders.map((order: any) => (
                    <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-sm">
                            {order.customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 leading-none mb-1">{order.customer.name}</p>
                            <p className="text-xs font-bold text-slate-400 truncate max-w-[120px]">{order.customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 font-black text-slate-700">{formatCurrency(order.totalAmount)}</td>
                      <td className="p-6">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="p-6 text-xs font-bold text-slate-400 uppercase tracking-tighter" suppressHydrationWarning>
                        {format(new Date(order.createdAt), "MMM d, h:mm a")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Users */}
        <div className="space-y-8">
          <Card className="border-none shadow-xl shadow-slate-200/60 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm p-6">
             <CardTitle className="text-xl font-black mb-6 px-2 flex items-center gap-2">
               <PlusCircle className="w-5 h-5 text-[#00bc8c]" />
               Quick Actions
             </CardTitle>
             <div className="grid grid-cols-2 gap-4">
                <QuickActionButton icon={<Users className="w-4 h-4" />} label="Users" href="/admin/users" />
                <QuickActionButton icon={<LayoutDashboard className="w-4 h-4" />} label="Orders" href="/admin/orders" />
                <QuickActionButton icon={<Package className="w-4 h-4" />} label="Inventory" href="/admin/medicines" />
                <QuickActionButton icon={<Settings className="w-4 h-4" />} label="Settings" href="/admin/settings" />
             </div>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/60 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#00bc8c]" />
                Latest Registrations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50 px-6 pb-6">
                  {stats?.recentUsers.map((newUser: any) => (
                    <div key={newUser.id} className="py-4 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00bc8c]/20 to-blue-500/20 flex items-center justify-center font-black text-[#00bc8c] border border-white shadow-sm overflow-hidden">
                            {newUser.image ? (
                              <img src={newUser.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              newUser.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          {!newUser.emailVerified && (
                             <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm leading-none mb-1">{newUser.name}</p>
                          <Badge variant="outline" className="text-[9px] font-black h-4 px-1.5 rounded-md border-slate-100 uppercase text-slate-400 tracking-widest">
                            {newUser.role}
                          </Badge>
                        </div>
                      </div>
                      <Link href={`/admin/users?search=${newUser.email}`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </Button>
                      </Link>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, description, color }: { title: string; value: string; icon: React.ReactNode; trend: string; description: string; color: string }) {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/60 rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-slate-300 transition-all duration-300">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className={`p-4 rounded-3xl ${color} text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <Badge className="bg-[#00bc8c]/10 text-[#00bc8c] border-none font-black text-xs px-2.5 py-1 rounded-xl flex items-center gap-1">
             <TrendingUp className="w-3 h-3" /> {trend}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
          <p className="text-slate-400 text-xs font-medium pt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionButton({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link href={href} className="w-full">
      <Button variant="outline" className="w-full h-24 rounded-3xl flex flex-col gap-2 font-black border-slate-100 hover:border-[#00bc8c]/20 hover:bg-[#00bc8c]/5 hover:text-[#00bc8c] transition-all group cursor-pointer shadow-sm">
        <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-white transition-colors shadow-sm">
          {icon}
        </div>
        <span className="text-[11px] uppercase tracking-widest">{label}</span>
      </Button>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    PLACED: { label: "Placed", className: "bg-blue-500/10 text-blue-600 border-blue-200", icon: <Clock className="w-3 h-3" /> },
    PROCESSING: { label: "Processing", className: "bg-amber-500/10 text-amber-600 border-amber-200", icon: <TrendingUp className="w-3 h-3" /> },
    SHIPPED: { label: "Shipped", className: "bg-purple-500/10 text-purple-600 border-purple-200", icon: <Package className="w-3 h-3" /> },
    DELIVERED: { label: "Delivered", className: "bg-emerald-500/10 text-emerald-600 border-emerald-200", icon: <CheckCircle2 className="w-3 h-3" /> },
    CANCELLED: { label: "Cancelled", className: "bg-red-500/10 text-red-600 border-red-200", icon: <AlertCircle className="w-3 h-3" /> },
  };

  const config = configs[status] || configs.PLACED;

  return (
    <Badge variant="outline" className={`gap-1.5 font-black uppercase text-[9px] tracking-widest border-none px-2 py-1 rounded-lg ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}
