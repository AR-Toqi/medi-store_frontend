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
    // If the user is already logged in, we don't need to show unauthorized messages
    if (user) return;

    const message = searchParams.get("message");

    if (message === "unauthorized") {
      toast.error("Unauthorized access! Please login to continue.", {
        id: "unauthorized-toast", // Prevent duplicate toasts
      });

      // Clean up the URL parameter without refreshing the page
      const params = new URLSearchParams(searchParams.toString());
      params.delete("message");
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl);
    }
  }, [searchParams, pathname, router]);

  return null;
}
