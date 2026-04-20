import React from "react";
import { Order } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Clock, CheckCircle, Truck, XCircle, Package } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RecentOrdersProps {
  orders: Order[];
}

const statusConfig = {
  PLACED: {
    label: "Pending",
    icon: <Clock className="h-3 w-3" />,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  PROCESSING: {
    label: "Processing",
    icon: <Package className="h-3 w-3" />,
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  SHIPPED: {
    label: "Shipped",
    icon: <Truck className="h-3 w-3" />,
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  DELIVERED: {
    label: "Delivered",
    icon: <CheckCircle className="h-3 w-3" />,
    color: "bg-green-100 text-green-700 border-green-200",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <XCircle className="h-3 w-3" />,
    color: "bg-red-100 text-red-700 border-red-200",
  },
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
        <Link href="/seller/orders">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-2 text-muted-foreground font-medium">Order ID</TableHead>
              <TableHead className="px-2 text-muted-foreground font-medium">Total</TableHead>
              <TableHead className="px-2 text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="px-2 text-muted-foreground font-medium">Date</TableHead>
              <TableHead className="px-2 text-right text-muted-foreground font-medium pr-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No recent orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PLACED;
                return (
                  <TableRow key={order.id} className="border-b transition-colors hover:bg-muted/50">
                    <TableCell className="p-2 font-medium">#{order.id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell className="p-2">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="p-2 text-center align-middle">
                      <Badge variant="outline" className={cn(
                        "inline-flex items-center gap-1 rounded-full border-transparent px-2 py-0.5 text-xs font-semibold uppercase tracking-wider",
                        config.color
                      )}>
                        {config.icon}
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2 text-muted-foreground" suppressHydrationWarning>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="p-2 text-right pr-4">
                      <Link href={`/seller/orders/${order.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary cursor-pointer">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
