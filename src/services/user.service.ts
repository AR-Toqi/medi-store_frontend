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
};
