import { fetcher } from "@/lib/api-client";
import { AuthResponse, SignUpData } from "@/types/auth";

export const authService = {
  signup: async (data: SignUpData): Promise<AuthResponse> => {
    return fetcher<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  login: async (data: any): Promise<AuthResponse> => {
    return fetcher<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<AuthResponse> => {
    return fetcher<AuthResponse>("/api/auth/logout", {
      method: "POST",
    });
  },

  verifyEmail: async (data: { email: string; code: string }): Promise<AuthResponse> => {
    return fetcher<AuthResponse>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
