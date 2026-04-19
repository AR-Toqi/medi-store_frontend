import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";

export function useOrders(page = 1, limit = 10) {
  const { user } = useUser();

  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => orderService.getMyOrders(page, limit),
    enabled: !!user,
  });
}

export function useOrderDetails(orderId: string) {
  const { user } = useUser();

  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrderDetails(orderId),
    enabled: !!user && !!orderId,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.cancelOrder(orderId),
    onSuccess: (data, orderId) => {
      // Invalidate both the list and the specific order to keep data fresh
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      toast.success("Order cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to cancel order");
    },
  });
}
