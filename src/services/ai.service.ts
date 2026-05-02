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
}

export const aiService = {
  /**
   * Send a message to the AI Chat Agent
   */
  chat: async (message: string, history: any[] = []): Promise<string> => {
    const response = await fetcher<AIChatResponse>("/api/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    });
    return response.message;
  },

  /**
   * Perform a semantic search for medicines
   */
  semanticSearch: async (query: string, limit: number = 5): Promise<SemanticSearchResponse[]> => {
    return fetcher<SemanticSearchResponse[]>(`/api/ai/search?query=${encodeURIComponent(query)}&limit=${limit}`);
  },
};
