import { Metadata } from "next";
import { MedicineFormView } from "@/components/seller/medicine-form-view";

export const metadata: Metadata = {
  title: "Add New Medicine | Seller Dashboard",
  description: "List a new medicine in the MediStore marketplace.",
};

export default function AddMedicinePage() {
  return <MedicineFormView />;
}
