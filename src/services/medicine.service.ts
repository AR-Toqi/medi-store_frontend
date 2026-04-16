import { fetcher } from "@/lib/api-client";
import { Medicine } from "@/types/medicine";

export const medicineService = {
  getAllMedicines: async () => {
    return fetcher<Medicine[]>("/api/medicines").catch(() => []);
  },
  
  getMedicineBySlug: async (slug: string) => {
    return fetcher<Medicine>(`/api/medicines/${slug}`).catch(() => null);
  }
};
