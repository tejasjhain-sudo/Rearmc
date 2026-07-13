import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RearMC | India's Competitive Minecraft PvP Server",
  description: "Compete against the best Indian players with ultra-low latency, ranked matchmaking, professional tier testing, and the smoothest knockback experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`} style={{ colorScheme: "dark" }}>
      <body className="min-h-full flex flex-col bg-brand-dark text-foreground selection:bg-brand-red/30">
        <CursorGlow />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
