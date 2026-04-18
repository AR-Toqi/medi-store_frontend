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
    
    // Note: fetcher in api-client.ts returns data.data, so it returns the Medicine[] directly.
    // However, if we want the full object (meta + data), we'd need to adjust fetcher or call fetch directly.
    // For now, let's keep the fetcher behavior as is but know it returns Medicine[].
    return fetcher<Medicine[]>(endpoint).catch(() => []);
  },
  
  getMedicineBySlug: async (slug: string) => {
    return fetcher<Medicine>(`/api/medicines/${slug}`).catch(() => null);
  }
};
