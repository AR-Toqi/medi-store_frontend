import { Metadata } from "next";
import { OrdersView } from "@/components/orders/orders-view";

export const metadata: Metadata = {
  title: "Order History | MediStore",
  description: "Track and manage your recent purchases on MediStore.",
};

export default function OrdersPage() {
  return <OrdersView />;
}
