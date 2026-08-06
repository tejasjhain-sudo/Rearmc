"use client";

import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`} style={{ colorScheme: "dark" }}>
      <body className="min-h-full flex flex-col bg-brand-dark text-foreground selection:bg-brand-red/30">
        <CursorGlow />
        {!isAdmin && <Navbar />}
        <main className="flex-grow">{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
