"use client";

import React from "react";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { useSellerStats } from "@/hooks/use-seller-stats";
import { useSellerOrders } from "@/hooks/use-seller-orders";
import { DashboardHeader } from "@/components/seller/dashboard-header";
import { RecentOrders } from "@/components/seller/recent-orders";
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  AlertCircle,
  TrendingUp,
  RefreshCcw,
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function DashboardView() {
  const { user } = useUser();
  const { stats, isLoading: statsLoading, refetch: refetchStats } = useSellerStats();
  const { orders, isLoading: ordersLoading, refetch: refetchOrders } = useSellerOrders(1, 5);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    refetchStats();
    refetchOrders();
  };

  if (!mounted || !user) return null;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <DashboardHeader userName={user.name || "Seller"} />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))
        ) : (
          <>
            {/* Revenue Card */}
            <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <h3 className="text-2xl font-bold tracking-tight">${stats?.totalRevenue.toFixed(2) || "0.00"}</h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/10 transition-colors">
                    <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="success" className="h-5 px-1.5 gap-0.5">
                    <TrendingUp className="h-3 w-3" />
                    12%
                  </Badge>
                  <p className="text-xs text-muted-foreground">Total non-cancelled sales</p>
                </div>
              </CardContent>
            </Card>

            {/* Orders Card */}
            <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <h3 className="text-2xl font-bold tracking-tight">{stats?.totalOrders || 0}</h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/10 transition-colors">
                    <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">Orders containing your products</p>
                </div>
              </CardContent>
            </Card>

            {/* Medicines Card */}
            <Card className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Medicines</p>
                    <h3 className="text-2xl font-bold tracking-tight">{stats?.totalMedicines || 0}</h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-500/10 transition-colors">
                    <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">Active listings in store</p>
                </div>
              </CardContent>
            </Card>

            {/* Pending Card */}
            <Card className={cn(
              "overflow-hidden border-none shadow-sm transition-all hover:shadow-md",
              stats?.pendingOrders && stats.pendingOrders > 0 ? "ring-2 ring-amber-500/20 bg-amber-50/10" : ""
            )}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                    <h3 className="text-2xl font-bold tracking-tight">{stats?.pendingOrders || 0}</h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/10 transition-colors">
                    <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">Requires your attention</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Orders List */}
        <div className="lg:col-span-2">
          {ordersLoading ? (
            <Card className="animate-pulse border-none bg-muted/20 h-96" />
          ) : (
            <RecentOrders orders={orders} />
          )}
        </div>

        {/* Quick Insights / Actions Card */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="bg-primary/5 p-6 border-b border-primary/10">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Store Analytics
              </h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="text-sm text-muted-foreground">Store Health</span>
                <span className="text-sm font-bold text-emerald-600">Excellent</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="text-sm text-muted-foreground">Order Fill Rate</span>
                <span className="text-sm font-bold">98%</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary"
                onClick={handleRefresh}
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-emerald-700 text-white border-none shadow-xl">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">Need Help?</h3>
              <p className="text-white/80 text-sm mb-4">
                Access our specialized seller documentation to maximize your pharmacy's online potential.
              </p>
              <Button className="w-full bg-white text-primary hover:bg-white/90">
                Read Center
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
