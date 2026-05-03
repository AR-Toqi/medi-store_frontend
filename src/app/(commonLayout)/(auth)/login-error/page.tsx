"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  const getErrorMessage = (err: string | null) => {
    switch (err) {
      case "configuration_error":
        return "There is a problem with the server configuration.";
      case "access_denied":
        return "Access was denied. Did you cancel the login?";
      case "unauthorized":
        return "You are not authorized to access this application.";
      default:
        return "An unexpected error occurred during the login process.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in fade-in duration-700">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-none border border-transparent dark:border-slate-800 p-10 space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground">Login Failed</h1>
        <p className="text-muted-foreground">{getErrorMessage(error)}</p>
        
        <div className="pt-4 space-y-3">
          <Button 
            onClick={() => router.push("/login")}
            className="w-full bg-[#00bc8c] hover:bg-[#00a37b] text-white font-bold h-12 rounded-xl"
          >
            Try Again
          </Button>
          
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
