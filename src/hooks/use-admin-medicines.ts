import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export interface AdminMedicineParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useAdminMedicines(params: AdminMedicineParams) {
  return useQuery({
    queryKey: ["admin-medicines", params],
    queryFn: async () => {
      const response = await userService.getAdminMedicines(params);
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
