import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalMedicines: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  recentUsers: any[];
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await userService.getAdminStats();
      return response;
    },
    // Refresh stats every 5 minutes or when the window is refocused
    staleTime: 1000 * 60 * 5,
  });
}
