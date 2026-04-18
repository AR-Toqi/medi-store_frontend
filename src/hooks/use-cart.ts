import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart.service";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

export function useCart() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const { 
    data: cart, 
    isLoading, 
    isFetching, 
    error,
    refetch
  } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
    enabled: !!user && user.role === "CUSTOMER",
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403 errors, as those are authentication issues
      if (error?.message?.includes("401") || error?.message?.includes("403")) return false;
      return failureCount < 2;
    }
  });

  // Helper to ensure user is logged in before actions
  const checkAuth = () => {
    if (!user) {
      toast.error("Please login to manage your cart", {
        id: "cart-auth-error", // Prevents duplicate toasts
      });
      router.push(`/login?callbackUrl=${pathname}`);
      return false;
    }
    if (user.role !== "CUSTOMER") {
      toast.error("Only customers can add items to the cart", {
        id: "cart-role-error"
      });
      return false;
    }
    return true;
  };

  // Mutations
  const addMutation = useMutation({
    mutationFn: ({ medicineId, quantity }: { medicineId: string, quantity?: number }) => 
      cartService.addToCart(medicineId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add item to cart");
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ medicineId, quantity }: { medicineId: string, quantity: number }) => 
      cartService.updateQuantity(medicineId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update quantity");
    }
  });

  const removeMutation = useMutation({
    mutationFn: (medicineId: string) => cartService.removeItem(medicineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed from cart");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove item");
    }
  });

  const clearMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart cleared");
    }
  });

  return {
    cart,
    isLoading,
    isFetching,
    error,
    addItem: (medicineId: string, quantity?: number) => {
      const isAllowed = checkAuth();
      if (isAllowed) {
        addMutation.mutate({ medicineId, quantity });
      }
      return isAllowed;
    },
    updateQuantity: (medicineId: string, quantity: number) => {
      if (checkAuth()) {
        updateQuantityMutation.mutate({ medicineId, quantity });
      }
    },
    removeItem: (medicineId: string) => {
      if (checkAuth()) {
        removeMutation.mutate(medicineId);
      }
    },
    clearCart: () => {
      if (checkAuth()) {
        clearMutation.mutate();
      }
    },
    isAdding: addMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeMutation.isPending
  };
}
