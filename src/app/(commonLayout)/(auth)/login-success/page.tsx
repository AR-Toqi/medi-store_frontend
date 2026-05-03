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
  const { setUser, refreshUser } = useUser();
  const [status, setStatus] = useState("authenticating");
  const [isMounted, setIsMounted] = useState(false);
  const hasAttempted = React.useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleSuccess = async () => {
      if (hasAttempted.current) return;
      hasAttempted.current = true;

      try {
        // Refresh the user data from the backend (which now has the cookies set)
        const { data: user } = await refreshUser();
        
        if (user) {
          setUser(user);
          setStatus("success");
          toast.success("Successfully logged in with Google!");
          
          // Social login is restricted to customers, so we always redirect to the home page
          setTimeout(() => {
            router.push("/");
          }, 1500);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Login success error:", err);
        setStatus("error");
        toast.error("Authentication failed. Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    handleSuccess();
  }, [refreshUser, setUser, router]);

  if (!isMounted) return null;

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
