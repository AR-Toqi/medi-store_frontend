import { fetcher } from "@/lib/api-client";
import { CheckoutPayload, Order } from "@/types/order";

export const orderService = {
  checkout: async (payload: CheckoutPayload) => {
    return fetcher<Order>("/api/orders/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getMyOrders: async (page = 1, limit = 10) => {
    return fetcher<{ data: Order[]; meta: any }>(
      `/api/orders/my-orders?page=${page}&limit=${limit}`,
      { returnFullResponse: true }
    );
  },
  
  getOrderDetails: async (id: string) => {
    return fetcher<Order>(`/api/orders/${id}`);
  },

  cancelOrder: async (id: string) => {
    return fetcher<Order>(`/api/orders/${id}/cancel`, {
      method: "PATCH",
    });
  }
};
