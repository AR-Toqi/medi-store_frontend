import { fetcher } from "@/lib/api-client";
import { Medicine } from "@/types/medicine";

export interface GetMedicinesParams {
  search?: string;
  category?: string;
  manufacturer?: string;
  sort?: string;
  page?: number;
  limit?: number;
  isFeatured?: boolean | string;
}

export interface MedicineResponse {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Medicine[];
}

export const medicineService = {
  getAllMedicines: async (params?: GetMedicinesParams) => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.search) queryParams.set("search", params.search);
      if (params.category) queryParams.set("categoryId", params.category);
      if (params.manufacturer) queryParams.set("manufacturer", params.manufacturer);
      if (params.sort) queryParams.set("sort", params.sort);
      if (params.page) queryParams.set("page", params.page.toString());
      if (params.limit) queryParams.set("limit", params.limit.toString());
      if (params.isFeatured !== undefined) queryParams.set("isFeatured", params.isFeatured.toString());
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/api/medicines${queryString ? `?${queryString}` : ""}`;
    
    // Default behavior returns data.data as Medicine[]
    return fetcher<Medicine[]>(endpoint).catch(() => []);
  },
  
  getMedicineBySlug: async (slug: string) => {
    return fetcher<Medicine>(`/api/medicines/${slug}`).catch(() => null);
  },

  // --- Seller Operations ---

  getSellerMedicines: async (params?: GetMedicinesParams) => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.search) queryParams.set("search", params.search);
      if (params.page) queryParams.set("page", params.page.toString());
      if (params.limit) queryParams.set("limit", params.limit.toString());
    }
    // Expected structure: { success: true, data: Medicine[], meta: ... }
    return fetcher<{ data: Medicine[]; meta: any }>(`/api/seller/medicines?${queryParams.toString()}`, {
      returnFullResponse: true
    });
  },

  getSellerMedicineBySlug: async (slug: string) => {
    return fetcher<Medicine>(`/api/seller/medicines/${slug}`);
  },

  getSellerMedicineById: async (id: string) => {
    return fetcher<Medicine>(`/api/seller/medicines/id/${id}`);
  },

  createMedicine: async (formData: FormData) => {
    return fetcher<Medicine>("/api/seller/medicines", {
      method: "POST",
      body: formData,
      // Note: Don't set Content-Type header when using FormData, 
      // the browser will set it automatically with the boundary.
    });
  },

  updateMedicine: async (id: string, formData: FormData) => {
    return fetcher<Medicine>(`/api/seller/medicines/${id}`, {
      method: "PATCH",
      body: formData,
    });
  },

  deleteMedicine: async (id: string) => {
    return fetcher<void>(`/api/seller/medicines/${id}`, {
      method: "DELETE",
    });
  },

  toggleFeatured: async (id: string) => {
    return fetcher<Medicine>(`/api/seller/medicines/${id}/featured`, {
      method: "PATCH",
    });
  }
};
