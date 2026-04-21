import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { toast } from "sonner";

export interface AdminOrderParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export function useAdminOrders(params: AdminOrderParams) {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: async () => {
      const response = await userService.getAdminOrders(params);
      return response;
    },
    // Keep data fresh
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useUpdateAdminOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      userService.updateAdminOrderStatus(id, status),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      // Also invalidate stats as they depend on order totals
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(response.message || "Order status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update order status");
    },
  });
}
