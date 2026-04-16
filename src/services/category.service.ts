import { fetcher } from "@/lib/api-client";
import { Category } from "@/types/category";

export const categoryService = {
  getAllCategories: async () => {
    return fetcher<Category[]>("/api/categories").catch(() => []);
  }
};
