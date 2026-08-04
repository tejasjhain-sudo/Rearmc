"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "Tier List", href: "/tierlist" },
  { name: "Reviews", href: "/#reviews" },
  { name: "Discord", href: "https://discord.gg/p7ENwb6Pz7" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-40 w-full transition-all duration-500 ${
        isScrolled 
          ? "py-3 border-b border-white/5" 
          : "bg-transparent py-5"
      }`}
      style={isScrolled ? {
        background: "rgba(10, 10, 10, 0.75)",
        backdropFilter: "blur(24px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
      } : {}}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-brand-red/10 p-1">
              <Image src="/logo.png" alt="RearMC Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
              REAR<span className="text-brand-red">MC</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-bold tracking-wide text-gray-300 transition-all duration-300 hover:text-brand-red hover:scale-110 drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="https://discord.gg/rearmc"
              className="rounded-xl px-6 py-2.5 text-sm font-black tracking-wider text-white transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 overflow-hidden relative group"
              style={{
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(185, 28, 28, 0.95) 100%)",
                boxShadow: "0 5px 20px -5px rgba(239, 68, 68, 0.8), inset 0 2px 5px rgba(255,255,255,0.3)",
                border: "1px solid rgba(255,100,100,0.5)"
              }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <span className="relative z-10 uppercase drop-shadow-md">Play Now</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden absolute top-full left-0 w-full border-t border-white/5 p-4 shadow-2xl"
          style={{
            background: "rgba(15, 15, 15, 0.95)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-bold tracking-wide text-gray-300 hover:text-brand-red transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="https://discord.gg/rearmc"
              className="inline-block rounded-xl px-4 py-3 text-center font-black uppercase tracking-widest text-white shadow-lg transition-transform active:scale-95"
              style={{
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(185, 28, 28, 0.95) 100%)",
                border: "1px solid rgba(255,100,100,0.5)"
              }}
            >
              Play Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
