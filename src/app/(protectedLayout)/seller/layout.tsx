"use client";

import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login?message=unauthorized");
      } else if (user.role !== "SELLER") {
        router.push("/?message=unauthorized");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#00bc8c]" />
      </div>
    );
  }

  if (!user || user.role !== "SELLER") {
    return null;
  }

  return <>{children}</>;
}
