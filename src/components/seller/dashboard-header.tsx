import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const [greeting, setGreeting] = React.useState("");

  React.useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
    };
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-primary mb-1">
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">Seller Dashboard</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting || "Welcome"}, <span className="text-primary">{userName}</span>!
        </h1>
        <p className="text-muted-foreground flex items-center gap-2">
          Manage your pharmacy, track sales, and grow your medical business.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/seller/manage-medicines/add-medicine">
          <Button className="font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all gap-2">
            <Plus className="h-4 w-4" />
            Add New Medicine
          </Button>
        </Link>
      </div>
    </div>
  );
}
