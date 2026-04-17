import { authService } from "@/services/auth.service";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  
  try {
    const user = await authService.getCurrentUser(headerList);
    const role = user?.role;

    // Usually, admins and sellers can also access customer routes (like profile/cart)
    // but here we ensure they are at least authenticated (base layout handles this).
    // If you want strict customer role check:
    /*
    if (role !== "CUSTOMER") {
      redirect("/?message=unauthorized");
    }
    */
  } catch (error) {
    redirect("/login?message=unauthorized");
  }

  return <>{children}</>;
}
