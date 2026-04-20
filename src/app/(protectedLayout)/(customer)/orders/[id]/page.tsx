import { Metadata } from "next";
import { OrderDetailsView } from "@/components/orders/order-details-view";

export const metadata: Metadata = {
  title: "Order Details | MediStore",
  description: "View detailed information about your MediStore order.",
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  return <OrderDetailsView params={params} />;
}
