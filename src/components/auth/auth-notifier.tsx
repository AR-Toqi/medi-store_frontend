"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";

export function AuthNotifier() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user) return;

    const message = searchParams.get("message");
    if (!message) return;

    const clearMessage = () => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("message");
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl);
    };

    if (message === "unauthorized") {
      toast.error("Unauthorized access! Please login to continue.", {
        id: "unauthorized-toast",
      });
      clearMessage();
    } else if (message === "password_reset_success") {
      toast.success("Password reset successful! You can now login with your new password.", {
        id: "password-reset-toast",
      });
      clearMessage();
    }
  }, [searchParams, pathname, router, user]);

  return null;
}
