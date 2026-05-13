import { fetcher } from "@/lib/api-client";

export interface AIChatResponse {
  message: string;
}

export interface SemanticSearchResponse {
  id: string;
  name: string;
  price: number;
  stock: number;
  manufacturer: string;
  description: string;
  imageUrl: string;
  slug: string;
  similarity: number;
  categoryName?: string;
}

export const aiService = {
  /**
   * Send a message to the AI Chat Agent
   */
  chat: async (message: string, history: any[] = []): Promise<string> => {
    try {
      const response = await fetcher<AIChatResponse>("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message, history }),
      });
      return response.message;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to get AI response";
      console.error("AI chat error:", errorMessage);
      throw new Error(`AI service unavailable: ${errorMessage}`);
    }
  },

  /**
   * Perform a semantic search for medicines
   */
  semanticSearch: async (query: string, limit: number = 5): Promise<SemanticSearchResponse[]> => {
    try {
      return fetcher<SemanticSearchResponse[]>(`/api/ai/search?query=${encodeURIComponent(query)}&limit=${limit}`);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to perform search";
      console.error("Semantic search error:", errorMessage);
      throw new Error(`Search service unavailable: ${errorMessage}`);
    }
  },
};
