import { authService } from "@/services/auth.service";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-slate-50">
         {children}
      </main>
    </div>
  );
}
