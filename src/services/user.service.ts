import { fetcher } from "@/lib/api-client";
import { User } from "@/types/auth";

export const userService = {
  getCurrentUser: async () => {
    try {
      return await fetcher<User>("/api/me", {
        skipRedirect: true, 
        skipRefresh: true, // Prevents noisy 401 refresh token attempts for guests
      });
    } catch (error) {
      return null;
    }
  },

  logout: async () => {
    return await fetcher("/api/auth/logout", {
      method: "POST",
    });
  },

  getAllUsers: async () => {
    return await fetcher<any>("/api/admin/users");
  },

  updateUserStatus: async (id: string, isBanned: boolean) => {
    return await fetcher<any>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ isBanned }),
      returnFullResponse: true,
    });
  },

  deleteUser: async (id: string) => {
    return await fetcher<any>(`/api/admin/users/${id}`, {
      method: "DELETE",
      returnFullResponse: true,
    });
  },

  getAdminStats: async () => {
    return await fetcher<any>("/api/admin/stats");
  },

  getAdminOrders: async (params: any) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);

    return await fetcher<any>(`/api/admin/orders?${query.toString()}`, {
      returnFullResponse: true,
    });
  },

  updateAdminOrderStatus: async (id: string, status: string) => {
    return await fetcher<any>(`/api/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
      returnFullResponse: true,
    });
  },

  getAdminMedicines: async (params: any) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);

    return await fetcher<any>(`/api/admin/medicines?${query.toString()}`, {
      returnFullResponse: true,
    });
  },

  // Category Management
  getAdminCategories: async () => {
    return await fetcher<any>("/api/admin/categories");
  },

  createCategory: async (formData: FormData) => {
    return await fetcher<any>("/api/admin/categories", {
      method: "POST",
      body: formData,
      returnFullResponse: true,
    });
  },

  updateCategory: async (id: string, formData: FormData) => {
    return await fetcher<any>(`/api/admin/categories/${id}`, {
      method: "PUT",
      body: formData,
      returnFullResponse: true,
    });
  },

  deleteCategory: async (id: string) => {
    return await fetcher<any>(`/api/admin/categories/${id}`, {
      method: "DELETE",
      returnFullResponse: true,
    });
  },
};
