"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { logoutAction } from "@/app/actions/user.actions";
import { useQueryClient } from "@tanstack/react-query";

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useUser();

  const handleLogout = async () => {
    try {
      // Clear cache and local state for instant UI feedback without refetching
      queryClient.clear();
      setUser(null);
      await logoutAction();
    } catch (error: any) {
      if (error.message?.includes("NEXT_REDIRECT")) {
        throw error;
      }
      toast.error("Logout failed");
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className="w-full border-red-100 text-red-500 hover:bg-red-50 rounded-2xl h-14 font-bold flex items-center gap-2 transition-all active:scale-95"
    >
      <LogOut className="w-5 h-5" />
      Logout
    </Button>
  );
}
