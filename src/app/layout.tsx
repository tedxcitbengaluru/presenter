import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { InitializeAuth } from "@/components/auth/init";
import { Providers } from "@/components/utils/providers";

export const metadata: Metadata = {
  title: "Presenter",
  description: "via TEDxCITBengaluru Tech Team",
};

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <InitializeAuth />
        <Providers>
          <Navbar />
          {children}
        </Providers>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
