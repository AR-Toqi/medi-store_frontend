"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { medicineService } from "@/services/medicine.service";
import { MedicineFormView } from "@/components/seller/medicine-form-view";
import { Loader2 } from "lucide-react";

interface EditMedicinePageProps {
  params: Promise<{ id: string }>;
}

export default function EditMedicinePage({ params }: EditMedicinePageProps) {
  const { id } = use(params);

  const { data: medicine, isLoading, isError } = useQuery({
    queryKey: ["seller-medicine-edit", id],
    queryFn: () => medicineService.getSellerMedicineById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-[#00bc8c]" />
      </div>
    );
  }

  if (isError || !medicine) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Medicine Not Found</h1>
        <p className="text-slate-500">We couldn&apos;t find the medicine you&apos;re trying to edit.</p>
      </div>
    );
  }

  return <MedicineFormView initialData={medicine} />;
}
