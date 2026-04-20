import { Metadata } from "next";
import { SellerOrdersView } from "@/components/seller/seller-orders-view";

export const metadata: Metadata = {
  title: "Shop Orders | Seller Dashboard",
  description: "Track and fulfill your pharmacy orders.",
};

export default function SellerOrdersPage() {
  return <SellerOrdersView />;
}
