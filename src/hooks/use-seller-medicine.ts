"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicineService, GetMedicinesParams } from "@/services/medicine.service";
import { toast } from "sonner";

export function useSellerMedicines(params?: GetMedicinesParams) {
  return useQuery({
    queryKey: ["seller-medicines", params],
    queryFn: () => medicineService.getSellerMedicines(params),
  });
}

export function useSellerMedicineDetails(slug: string) {
  return useQuery({
    queryKey: ["seller-medicine", slug],
    queryFn: () => medicineService.getSellerMedicineBySlug(slug),
    enabled: !!slug,
  });
}

export function useMedicineMutation() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => medicineService.createMedicine(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create medicine");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      medicineService.updateMedicine(id, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      queryClient.invalidateQueries({ queryKey: ["seller-medicine"] });
      toast.success("Medicine updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update medicine");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => medicineService.deleteMedicine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete medicine");
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: (id: string) => medicineService.toggleFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-medicines"] });
      toast.success("Featured status updated");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update featured status");
    },
  });

  return {
    createMedicine: createMutation,
    updateMedicine: updateMutation,
    deleteMedicine: deleteMutation,
    toggleFeatured: toggleFeaturedMutation,
    isPending: 
      createMutation.isPending || 
      updateMutation.isPending || 
      deleteMutation.isPending || 
      toggleFeaturedMutation.isPending,
  };
}
