import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService } from "@/services/address.service";
import { CreateAddressInput } from "@/types/address";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";

export function useAddress() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const {
    data: addresses = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressService.getMyAddresses,
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAddressInput) => addressService.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create address");
    },
  });

  return {
    addresses,
    isLoading,
    isError,
    refetch,
    createAddress: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
