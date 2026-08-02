/* eslint-disable */

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-dark pb-8 pt-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-brand-red/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="mb-6 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-brand-red/10 p-1">
                <Image src="/logo.png" alt="RearMC Logo" fill className="object-contain" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                REAR<span className="text-brand-red">MC</span>
              </span>
            </Link>
            <p className="mb-6 text-sm text-gray-400 max-w-xs">
              India's premier competitive Minecraft PvP server. Join us for ultra-low latency, ranked matchmaking, and professional tier testing.
            </p>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-brand-red transition-colors">Home</Link></li>
              <li><Link href="#features" className="text-gray-400 hover:text-brand-red transition-colors">Features</Link></li>
              <li><Link href="/tierlist" className="text-gray-400 hover:text-brand-red transition-colors">Tier List</Link></li>
              <li><Link href="https://store.rearmc.net" className="text-gray-400 hover:text-brand-red transition-colors">Store</Link></li>
              <li><Link href="/admin" className="text-gray-400 hover:text-brand-red transition-colors font-bold mt-2 inline-block">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-bold text-white">Community</h3>
            <ul className="space-y-3">
              <li><Link href="https://discord.gg/rearmc" className="text-gray-400 hover:text-brand-red transition-colors">Discord</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-brand-red transition-colors">Twitter</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-brand-red transition-colors">YouTube</Link></li>
              <li><Link href="#support" className="text-gray-400 hover:text-brand-red transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-lg font-bold text-white">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/rules" className="text-gray-400 hover:text-brand-red transition-colors">Server Rules</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-brand-red transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-brand-red transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} RearMC. All rights reserved. Not affiliated with Mojang AB.
          </p>
          <div className="mt-4 flex gap-4 sm:mt-0">
            <span className="text-sm font-bold text-brand-red">play.rearmc.fun</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
