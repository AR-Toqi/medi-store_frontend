"use client";

import { useQuery } from "@tanstack/react-query";
import { sellerService } from "@/services/seller.service";
import { SellerStats } from "@/types/seller";

export function useSellerStats() {
  const {
    data: stats,
    isLoading,
    isError,
    refetch,
  } = useQuery<SellerStats>({
    queryKey: ["seller-stats"],
    queryFn: sellerService.getDashboardStats,
  });

  return {
    stats,
    isLoading,
    isError,
    refetch,
  };
}
