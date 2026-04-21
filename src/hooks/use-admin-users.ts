import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { toast } from "sonner";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      return await userService.getAllUsers();
    },
  });
}

export function useAdminUserMutation() {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({ id, isBanned }: { id: string; isBanned: boolean }) =>
      userService.updateUserStatus(id, isBanned),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(response.message || "User status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user status");
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(response.message || "User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  return {
    updateStatus,
    deleteUser,
  };
}
