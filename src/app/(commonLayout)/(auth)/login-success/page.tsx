"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useUser } from "@/hooks/use-user";

export default function LoginSuccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser, refreshUser, isLoading } = useUser();
  const [status, setStatus] = useState("authenticating");
  const hasRefreshed = React.useRef(false);

  useEffect(() => {
    // If user is already authenticated, redirect to home immediately
    if (user) {
      setStatus("success");
      toast.success("Successfully logged in!");
      setTimeout(() => {
        router.replace("/");
      }, 1500);
      return;
    }

    // If still loading, wait for the initial query to complete
    if (isLoading) {
      return;
    }

    // Prevent multiple refresh attempts
    if (hasRefreshed.current) {
      return;
    }

    hasRefreshed.current = true;

    // Try to refresh user data (for OAuth callback case)
    refreshUser().then(({ data: refreshedUser }) => {
      if (refreshedUser) {
        setUser(refreshedUser);
        setStatus("success");
        toast.success("Successfully logged in!");
        setTimeout(() => {
          router.replace("/");
        }, 1500);
      } else {
        // No user data after refresh - this page was accessed directly
        setStatus("error");
        toast.error("Authentication failed. Redirecting to login...");
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      }
    }).catch((err) => {
      console.error("Login success error:", err);
      setStatus("error");
      toast.error("Authentication failed. Redirecting to login...");
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in fade-in duration-700">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-none border border-transparent dark:border-slate-800 p-10 space-y-6">
        {status === "authenticating" && (
          <>
            <div className="bg-[#00bc8c10] p-5 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-[#00bc8c] animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Completing Sign In</h1>
            <p className="text-muted-foreground">Please wait while we sync your account...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="bg-[#00bc8c10] p-5 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#00bc8c]" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome!</h1>
            <p className="text-muted-foreground">Login successful. Redirecting you to your dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="bg-red-50 p-5 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
              <div className="w-10 h-10 text-red-500 text-4xl font-bold">!</div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
            <p className="text-muted-foreground">We couldn't finalize your session. Sending you back to login...</p>
          </>
        )}
      </div>
    </div>
  );
}
