import { Metadata } from "next";
import { MedicinesView } from "@/components/seller/medicines-view";

export const metadata: Metadata = {
  title: "Manage Medicines | Seller Dashboard",
  description: "View and manage your medicine listings.",
};

export default function manageMedicinesPage() {
  return <MedicinesView />;
}
