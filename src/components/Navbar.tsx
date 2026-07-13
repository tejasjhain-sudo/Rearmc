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
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
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
                className="text-sm font-medium text-gray-300 transition-colors hover:text-brand-red"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="https://discord.gg/rearmc"
              className="rounded-full bg-brand-red px-5 py-2 text-sm font-bold text-white shadow-[0_0_15px_rgba(255,45,45,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(255,45,45,0.6)]"
            >
              Play Now
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
        <div className="md:hidden glass absolute top-full left-0 w-full border-t border-white/10 p-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-gray-300 hover:text-brand-red"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="https://discord.gg/rearmc"
              className="inline-block rounded-md bg-brand-red px-4 py-2 text-center font-bold text-white shadow-lg"
            >
              Play Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
