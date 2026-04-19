import { fetcher } from "@/lib/api-client";
import { Medicine } from "@/types/medicine";

export interface CartItem {
  id: string;
  userId: string;
  medicineId: string;
  quantity: number;
  medicine: Medicine;
  isAvailable: boolean;
  itemTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  totalItems: number;
  cartTotal: number;
  hasUnavailableItems: boolean;
}

export interface CartResponse {
  items: CartItem[];
  summary: CartSummary;
}

export const cartService = {
  getCart: async () => {
    const response = await fetcher<any>("/api/cart", { returnFullResponse: true });
    
    // The backend response format is: { success: true, data: { items: [], summary: {} } }
    const cartData = response.data || {};
    
    return {
      items: cartData.items || [],
      summary: cartData.summary || { totalItems: 0, cartTotal: 0, hasUnavailableItems: false }
    } as CartResponse;
  },

  addToCart: async (medicineId: string, quantity: number = 1) => {
    return fetcher<CartItem>("/api/cart", {
      method: "POST",
      body: JSON.stringify({ medicineId, quantity }),
    });
  },

  updateQuantity: async (medicineId: string, quantity: number) => {
    return fetcher<CartItem>(`/api/cart/${medicineId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
  },

  removeItem: async (medicineId: string) => {
    return fetcher<{ message: string }>(`/api/cart/${medicineId}`, {
      method: "DELETE",
    });
  },

  clearCart: async () => {
    return fetcher<{ message: string }>("/api/cart", {
      method: "DELETE",
    });
  },
};
