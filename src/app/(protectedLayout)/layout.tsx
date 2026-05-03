"use client";

import { useUser } from "@/hooks/use-user";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?message=unauthorized&redirect=${pathname}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#00bc8c]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
