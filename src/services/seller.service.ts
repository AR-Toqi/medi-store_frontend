import { fetcher } from "@/lib/api-client";

export const sellerService = {
  /**
   * Create a seller profile (Become a seller)
   * @param formData Multipart form data including logo, shopName, etc.
   */
  createSellerProfile: async (formData: FormData) => {
    return await fetcher("/api/sellers", {
      method: "POST",
      body: formData,
      // fetcher automatically handles FormData (doesn't set JSON content-type)
    });
  },

  /**
   * Get seller dashboard statistics
   */
  getDashboardStats: async () => {
    return await fetcher("/api/seller/stats");
  },
};
