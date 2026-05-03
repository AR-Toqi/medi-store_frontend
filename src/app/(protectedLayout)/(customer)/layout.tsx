"use client";

import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?message=unauthorized");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#00bc8c]" />
      </div>
    );
  }

  return <>{children}</>;
}
