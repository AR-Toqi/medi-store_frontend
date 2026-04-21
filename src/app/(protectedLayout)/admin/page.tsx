import React from "react";
import { headers } from "next/headers";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const headerList = await headers();
  
  try {
    // We can use the already validated headers to fetch data on the server
    const [user, stats] = await Promise.all([
      authService.getCurrentUser(headerList),
      userService.getAdminStats()
    ]);

    if (!user || user.role !== "ADMIN") {
      redirect("/login?message=unauthorized");
    }

    return <AdminDashboardView stats={stats} user={user} />;
  } catch (error) {
    console.error("Dashboard Server Component Error:", error);
    // If it fails, the error boundary or layout redirect will catch it,
    // but we'll redirect to be safe
    redirect("/login?message=session_expired");
  }
}
