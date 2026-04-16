import { Navbar } from "@/components/navbar1";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}
