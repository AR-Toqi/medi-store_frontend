import { fetcher } from "@/lib/api-client";
import { Review, ReviewStats, ReviewResponse, CreateReviewPayload, UpdateReviewPayload } from "@/types/review";

export const reviewService = {
  getReviewsByMedicine: async (medicineId: string, page: number = 1, limit: number = 10) => {
    return fetcher<ReviewResponse>(`/api/reviews/medicine/${medicineId}?page=${page}&limit=${limit}`);
  },

  getMedicineStats: async (medicineId: string) => {
    return fetcher<ReviewStats>(`/api/reviews/medicine/${medicineId}/stats`);
  },

  createReview: async (payload: CreateReviewPayload) => {
    return fetcher<Review>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  getMyReviews: async (page: number = 1, limit: number = 10) => {
    return fetcher<ReviewResponse>(`/api/reviews/my-reviews?page=${page}&limit=${limit}`);
  },

  updateReview: async (reviewId: string, payload: UpdateReviewPayload) => {
    return fetcher<Review>(`/api/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  deleteReview: async (reviewId: string) => {
    return fetcher<{ message: string }>(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },
};
