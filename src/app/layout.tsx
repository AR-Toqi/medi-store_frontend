import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar1";
import { Footer } from "@/components/footer";
import { Toaster } from 'sonner';
import { AIChatBot } from "@/components/shared/ai-chat-bot";
import { SemanticSearchBar } from "@/components/shared/semantic-search-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediStore - Your Medical Partner",
  description: "High-quality medications and wellness products.",
};

import { AuthNotifier } from "@/components/auth/auth-notifier";
import { Suspense } from "react";
import { QueryProvider } from "@/providers/query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <Toaster position="top-center" richColors />
        <QueryProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <Suspense fallback={null}>
              <AuthNotifier />
            </Suspense>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <div className="fixed bottom-6 left-6 z-[9999]">
              <SemanticSearchBar />
            </div>
            <AIChatBot />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
