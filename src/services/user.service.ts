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
};
