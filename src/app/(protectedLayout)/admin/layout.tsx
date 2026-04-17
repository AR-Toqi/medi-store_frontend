import { authService } from "@/services/auth.service";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  
  try {
    const user = await authService.getCurrentUser(headerList);
    const role = user?.role;

    if (role !== "ADMIN") {
      redirect("/?message=unauthorized");
    }
  } catch (error) {
    redirect("/login?message=unauthorized");
  }

  return <>{children}</>;
}
