import { Navbar } from "@/components/navbar1";
import { Toaster } from "sonner";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
