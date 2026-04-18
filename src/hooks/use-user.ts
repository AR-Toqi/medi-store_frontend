"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { User } from "@/types/auth";

export function useUser() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: userService.getCurrentUser,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    retry: false,
  });

  const setUser = (newUser: User | null) => {
    // If setting to null, we also invalidate to be safe
    if (newUser === null) {
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    } else {
      queryClient.setQueryData(["user"], newUser);
    }
  };

  const logout = async () => {
    try {
      await userService.logout();
    } finally {
      setUser(null);
      queryClient.clear(); // Clear all cached data on logout for security
    }
  };

  return {
    user: user ?? null,
    setUser,
    logout,
    isLoading,
    isFetching,
    isError: !!error,
    refreshUser: refetch,
  };
}
