import { Metadata } from "next";
import { DashboardView } from "@/components/seller/dashboard-view";

export const metadata: Metadata = {
  title: "Seller Dashboard | MediStore",
  description: "Manage your pharmacy, track sales, and grow your medical business.",
};

export default function SellerDashboardPage() {
  return <DashboardView />;
}
