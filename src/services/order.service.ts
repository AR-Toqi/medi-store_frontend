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
  },

  // --- Seller Operations ---

  getSellerOrders: async (page = 1, limit = 10, status?: string) => {
    const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) query.set("status", status);
    return fetcher<{ data: Order[]; meta: any }>(`/api/seller/orders?${query.toString()}`, {
      returnFullResponse: true
    });
  },

  updateOrderStatus: async (id: string, status: string) => {
    return fetcher<Order>(`/api/seller/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
