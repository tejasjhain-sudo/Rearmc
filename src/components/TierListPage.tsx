"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, RefreshCw, X, ExternalLink } from "lucide-react";

/* ─────────────────────────────────── Types ──────────────────────────── */
type Category = "sword" | "axe" | "nethpot" | "dpot" | "uhc" | "smp" | "crystal" | "mace";
interface PlayerData {
  sword: string | null; axe: string | null; nethpot: string | null;
  dpot: string | null; uhc: string | null; smp: string | null;
  crystal: string | null; mace: string | null;
}
interface PlayerRecord {
  tiers: PlayerData;
  region: string;
}
type ApiResponse = Record<string, PlayerRecord>;

const API_URL = "/api/tiers";

const TIER_POINTS: Record<string, number> = {
  HT1: 60, LT1: 45, HT2: 30, LT2: 20, HT3: 10, LT3: 6, HT4: 4, LT4: 3, HT5: 2, LT5: 1,
};
const TIER_COLOR: Record<string, string> = {
  HT1: "#FFD700", LT1: "#f0c040",
  HT2: "#C0C0C0", LT2: "#a0a0a0",
  HT3: "#CD7F32", LT3: "#b06020",
  HT4: "#4ade80", LT4: "#22c55e",
  HT5: "#60a5fa", LT5: "#3b82f6",
};
const TIER_BG: Record<string, string> = {
  HT1: "#3a2e00", LT1: "#2e2400",
  HT2: "#2a2a2a", LT2: "#222",
  HT3: "#3a2008", LT3: "#2a1606",
  HT4: "#0a2e16", LT4: "#071e10",
  HT5: "#0a1e40", LT5: "#061430",
};

const TIER_ORDER = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"];

const TIER_COLS = [
  { label: "Tier 1", tiers: ["HT1", "LT1"], color: "#FFD700", hdrBg: "linear-gradient(135deg,#6b4e00 0%,#3e2c00 100%)" },
  { label: "Tier 2", tiers: ["HT2", "LT2"], color: "#C0C0C0", hdrBg: "linear-gradient(135deg,#484848 0%,#2a2a2a 100%)" },
  { label: "Tier 3", tiers: ["HT3", "LT3"], color: "#CD7F32", hdrBg: "linear-gradient(135deg,#5c380f 0%,#341e06 100%)" },
  { label: "Tier 4", tiers: ["HT4", "LT4"], color: "#cccccc", hdrBg: "linear-gradient(135deg,#1e1e1e 0%,#111 100%)" },
  { label: "Tier 5", tiers: ["HT5", "LT5"], color: "#888888", hdrBg: "linear-gradient(135deg,#161616 0%,#0d0d0d 100%)" },
];

const KITS: { key: Category; label: string; icon: string }[] = [
  { key: "sword",   label: "Sword",   icon: "/icons/sword.png"   },
  { key: "axe",     label: "Axe",     icon: "/icons/axe.png"     },
  { key: "nethpot", label: "NethPot", icon: "/icons/nethpot.png" },
  { key: "dpot",    label: "DPot",    icon: "/icons/dpot.png"    },
  { key: "uhc",     label: "UHC",     icon: "/icons/uhc.png"     },
  { key: "smp",     label: "SMP",     icon: "/icons/smp.png"     },
  { key: "crystal", label: "Crystal", icon: "/icons/crystal.png" },
  { key: "mace",    label: "Mace",    icon: "/icons/mace.png"    },
];

/* ─────────────────────────────────── Helpers ────────────────────────── */
const calcScore = (s: PlayerData) =>
  Object.values(s).reduce((sum: number, t) => sum + (t ? (TIER_POINTS[t as string] ?? 0) : 0), 0);

const fallbackSrc = (size: number) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'%3E%3Crect width='${size}' height='${size}' fill='%23181818'/%3E%3C/svg%3E`;

/* ─────────────────────────────────── Kit Icon Circle ────────────────── */
function KitCircle({ kit, tier, size = 32 }: { kit: typeof KITS[0]; tier: string; size?: number }) {
  const color = TIER_COLOR[tier] ?? "#666";
  const bg = TIER_BG[tier] ?? "#1a1a1a";
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div
      className="relative flex flex-col items-center gap-[3px] cursor-pointer group"
      whileHover={{ scale: 1.3, zIndex: 50 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className="rounded-full flex items-center justify-center transition-all duration-200 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.2)]"
        style={{ width: size, height: size, background: bg, border: `1.5px solid ${color}aa` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={kit.icon} alt={kit.label}
          style={{ width: size * 0.58, height: size * 0.58, imageRendering: "pixelated", objectFit: "contain" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>
      <span className="font-bold leading-none transition-colors" style={{ fontSize: 9, color }}>{tier}</span>

      {/* Tooltip showing kit name and tier */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.85 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full mb-2 px-2.5 py-1 rounded-lg text-[11px] font-extrabold whitespace-nowrap pointer-events-none z-50 flex items-center gap-1.5 shadow-2xl border"
            style={{
              background: "rgba(15, 15, 20, 0.95)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              borderColor: `${color}88`,
              boxShadow: `0 8px 20px -4px rgba(0,0,0,0.8), 0 0 12px ${color}44`,
            }}
          >
            <span className="text-gray-300 font-medium">{kit.label}:</span>
            <span style={{ color }}>{tier}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────── Lightning Storm Intro ───────────── */
function LightningIntroEffect() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none rounded-2xl overflow-hidden flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.5, times: [0, 0.85, 1] }}
    >
      {/* Dark storm sky backdrop */}
      <motion.div
        className="absolute inset-0 bg-[#080b14]"
        animate={{ opacity: [0.95, 0.3, 0.9, 0.1, 0.8, 0] }}
        transition={{ duration: 2.2, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
      />

      {/* Screen flash whiteout */}
      <motion.div
        className="absolute inset-0 bg-cyan-100"
        animate={{ opacity: [0, 0.8, 0, 0.95, 0, 0.7, 0] }}
        transition={{ duration: 2.2, times: [0, 0.25, 0.3, 0.55, 0.6, 0.75, 1] }}
      />

      {/* Primary Jagged Lightning Bolt 1 */}
      <motion.svg
        className="absolute inset-0 w-full h-full text-cyan-300 drop-shadow-[0_0_15px_#38bdf8]"
        viewBox="0 0 360 420"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          opacity: [0, 1, 0, 1, 0, 0.8, 0],
          scale: [0.95, 1.05, 0.98, 1.02, 1],
        }}
        transition={{ duration: 2.2, times: [0, 0.2, 0.3, 0.55, 0.7, 0.85, 1] }}
      >
        <path d="M 180 0 L 165 90 L 195 120 L 140 210 L 175 230 L 130 330 L 160 340 L 120 420" />
        <path d="M 195 120 L 230 170 L 210 200" strokeWidth="2.5" />
        <path d="M 140 210 L 100 255 L 120 270" strokeWidth="2" />
      </motion.svg>

      {/* Secondary Electric Yellow Lightning Bolt 2 */}
      <motion.svg
        className="absolute inset-0 w-full h-full text-amber-300 drop-shadow-[0_0_18px_#fbbf24]"
        viewBox="0 0 360 420"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          opacity: [0, 0, 1, 0, 1, 0],
          scale: [1, 0.9, 1.1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 2.2, times: [0, 0.3, 0.35, 0.6, 0.65, 1] }}
      >
        <path d="M 220 0 L 200 110 L 235 140 L 170 240 L 200 260 L 150 370 L 180 380 L 140 420" />
      </motion.svg>

      {/* Electric Spark Particles */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const dist = 50 + (i % 5) * 25;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-200 shadow-[0_0_10px_#38bdf8]"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
            animate={{
              x: [0, Math.cos(angle) * dist],
              y: [0, Math.sin(angle) * dist],
              opacity: [0, 1, 0],
              scale: [0.5, 1.4, 0],
            }}
            transition={{ duration: 1.8, delay: 0.2 + (i % 3) * 0.2, repeat: 1, ease: "easeOut" }}
          />
        );
      })}

      {/* Center Strike Text Banner */}
      <motion.div
        className="absolute font-black text-2xl text-amber-300 drop-shadow-[0_0_20px_#f59e0b] font-mono tracking-widest flex items-center gap-2 uppercase"
        animate={{
          scale: [0.5, 1.3, 1, 1.1, 0.8],
          opacity: [0, 1, 0.9, 1, 0],
        }}
        transition={{ duration: 2.2, times: [0, 0.25, 0.5, 0.75, 1] }}
      >
        ⚡ LIGHTNING STRIKE! ⚡
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────── Enchantment Particles ───────────── */
function EnchantmentParticles() {
  const RUNES = ["ᔑ", "ʖ", "ᓵ", "↸", "ᒷ", "⎓", "⊣", "⍑", "╎", "⋮", "ꖎ", "ᑑ"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-[11px] font-bold text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]"
          style={{
            top: `${15 + (i * 7) % 70}%`,
            left: `${10 + (i * 13) % 80}%`,
          }}
          animate={{
            y: [-8, -32, -8],
            x: [-4, 4, -4],
            opacity: [0, 0.85, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2.2 + (i % 4) * 0.4,
            delay: i * 0.25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {RUNES[i % RUNES.length]}
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────── Profile Card ───────────────────── */
function ProfileCard({ name, stats, rank, onClose }: {
  name: string; stats: PlayerData; rank: number; onClose: () => void;
}) {
  const score = calcScore(stats);
  const ratedKits = KITS.filter(k => stats[k.key] !== null);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      {/* Minecraft Container GUI Frame */}
      <motion.div
        initial={{ scale: 0.82, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-[360px] p-4 select-none overflow-hidden"
        style={{
          background: "#c6c6c6",
          boxShadow: "inset -4px -4px 0 #373737, inset 4px 4px 0 #ffffff, 0 25px 60px rgba(0,0,0,0.9)",
          border: "4px solid #1f1f1f",
        }}
      >
        {/* 2.5 Second Electric Lightning Storm Overlay */}
        <LightningIntroEffect />

        {/* Floating Enchantment Particles */}
        <EnchantmentParticles />

        {/* Header Bar */}
        <div className="flex items-center justify-between mb-3 px-1 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-[#404040] uppercase tracking-wider font-mono">
              🗡️ PLAYER PROFILE
            </span>
          </div>
          {/* Minecraft X Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, y: 1 }}
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-xs font-black text-[#373737] hover:text-red-600 transition-colors"
            style={{
              background: "#c6c6c6",
              boxShadow: "inset 2px 2px 0 #ffffff, inset -2px -2px 0 #555555",
            }}
          >
            ✕
          </motion.button>
        </div>

        {/* Inner Dark Slot Container Area */}
        <div
          className="p-4 flex flex-col items-center gap-4 relative z-10"
          style={{
            background: "#1e1e1e",
            boxShadow: "inset 3px 3px 0 #000000, inset -3px -3px 0 #555555",
          }}
        >
          {/* Top Section: Avatar Slot + Player Info */}
          <div className="w-full flex items-center gap-4">
            {/* Minecraft Head Slot with Enchantment Purple Aura */}
            <div
              className="w-20 h-20 shrink-0 p-1 flex items-center justify-center relative"
              style={{
                background: "#8b8b8b",
                boxShadow: "inset 3px 3px 0 #373737, inset -3px -3px 0 #ffffff, 0 0 16px rgba(168,85,247,0.5)",
              }}
            >
              <div
                className="w-full h-full overflow-hidden"
                style={{
                  background: "#181818",
                  boxShadow: "inset 2px 2px 0 #000000, inset -2px -2px 0 #555555",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  src={`https://minotar.net/helm/${name}/64.png`}
                  alt={name}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: "pixelated" }}
                  onError={e => { (e.target as HTMLImageElement).src = fallbackSrc(64); }}
                />
              </div>
            </div>

            {/* Name + Details */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-extrabold text-white truncate tracking-wide drop-shadow-[2px_2px_0_#000]">
                {name}
              </h2>
              <div className="inline-block mt-1 px-2 py-0.5 text-[10px] font-black uppercase text-amber-300 bg-amber-950/60 border border-amber-500/40">
                ⭐ RearMC Master
              </div>
              <div className="mt-2">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 1 }}
                  href={`https://namemc.com/profile/${name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-gray-200 hover:text-white transition-all"
                  style={{
                    background: "#555555",
                    boxShadow: "inset 2px 2px 0 #aaaaaa, inset -2px -2px 0 #222222",
                  }}
                >
                  <span>NameMC</span>
                  <ExternalLink size={10} />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Overall Points Bar (GUI Slot Style with XP Bar) */}
          <div className="w-full flex flex-col gap-1">
            <div
              className="w-full p-2.5 flex items-center justify-between"
              style={{
                background: "#2a2a2a",
                boxShadow: "inset 2px 2px 0 #000000, inset -2px -2px 0 #444444",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="px-2 py-0.5 font-black text-sm text-black"
                  style={{ background: "#ffaa00", boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #996600" }}
                >
                  #{rank}
                </div>
                <span className="text-xs font-bold text-gray-200">Overall Ranking</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-amber-400 text-sm">{score}</span>
                <span className="text-[10px] text-gray-400 font-bold ml-1">PTS</span>
              </div>
            </div>

            {/* Animated XP Bar */}
            <div className="w-full flex items-center gap-2 px-0.5">
              <div className="flex-1 h-2 rounded-sm bg-[#111] p-0.5 border border-[#333] relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(15, (score / 500) * 100))}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_8px_#22c55e]"
                />
              </div>
              <span className="text-[10px] font-black text-green-400 drop-shadow-[0_1px_1px_#000]">LVL {Math.max(1, Math.floor(score / 50))}</span>
            </div>
          </div>

          {/* Rated Kit Slots Grid with Item Stagger Drop-in Animation */}
          {ratedKits.length > 0 && (
            <div className="w-full">
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 pl-0.5">
                EQUIPPED TIERS ({ratedKits.length})
              </p>
              <div
                className="grid grid-cols-4 gap-2 p-2.5"
                style={{
                  background: "#8b8b8b",
                  boxShadow: "inset 3px 3px 0 #373737, inset -3px -3px 0 #ffffff",
                }}
              >
                {ratedKits.map((kit, index) => {
                  const tier = stats[kit.key]!;
                  return (
                    <motion.div
                      key={kit.key}
                      initial={{ scale: 0, opacity: 0, y: -10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 + 0.05, type: "spring", stiffness: 450, damping: 22 }}
                      whileHover={{ scale: 1.15, zIndex: 20 }}
                      className="aspect-square flex flex-col items-center justify-center relative group p-1 cursor-pointer"
                      style={{
                        background: "#8b8b8b",
                        boxShadow: "inset 2px 2px 0 #373737, inset -2px -2px 0 #ffffff",
                      }}
                    >
                      <div
                        className="w-full h-full flex flex-col items-center justify-center relative p-0.5"
                        style={{
                          background: "#8b8b8b",
                          boxShadow: "inset -2px -2px 0 #373737, inset 2px 2px 0 #ffffff",
                        }}
                      >
                        <KitCircle kit={kit} tier={tier} size={28} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────── Leaderboard Row ────────────────── */
function LbRow({ rank, name, record, onClick }: {
  rank: number; name: string; record: PlayerRecord; onClick: () => void;
}) {
  const { tiers: stats, region } = record;
  const score = calcScore(stats);
  const ratedKits = KITS.filter(k => stats[k.key as keyof PlayerData] !== null);

  const isTop3 = rank <= 3;
  const rankBg = rank === 1 ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
               : rank === 2 ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
               : rank === 3 ? "linear-gradient(135deg, #d97706 0%, #b45309 100%)" : "transparent";

  const regionColors: Record<string, { bg: string; color: string }> = {
    NA: { bg: "#7f1d1d", color: "#fca5a5" },
    EU: { bg: "#14532d", color: "#86efac" },
    AS: { bg: "#1e3a5f", color: "#93c5fd" },
    SA: { bg: "#3b1f00", color: "#fcd34d" },
    OC: { bg: "#2d1b4e", color: "#c4b5fd" },
  };
  const regionStyle = regionColors[region] ?? { bg: "#1e3a5f", color: "#93c5fd" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(rank * 0.05, 0.5) }}
      whileHover={{ scale: 1.045, backgroundColor: "rgba(255,255,255,0.055)", zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative flex items-center gap-4 py-2.5 pr-5 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-white/10 overflow-visible mb-1.5 group"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      {/* Rank Block (Skewed background for Top 3) */}
      <div className="w-[68px] h-full absolute left-0 top-0 bottom-0 overflow-hidden rounded-l-xl" style={{ zIndex: 0 }}>
        {isTop3 && (
          <div 
            className="w-full h-full"
            style={{ 
              background: rankBg, 
              clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" 
            }} 
          />
        )}
      </div>

      {/* Rank Number */}
      <div className="w-[60px] flex-shrink-0 flex justify-center relative z-10 pl-2">
        <span 
          className={`font-black italic text-2xl ${isTop3 ? 'text-white' : 'text-gray-200'}`}
          style={isTop3 ? { textShadow: "2px 2px 0px rgba(0,0,0,0.4)" } : {}}
        >
          {rank}.
        </span>
      </div>

      {/* Body/Full-skin render */}
      <div
        className="flex-shrink-0 overflow-hidden relative z-10 transition-transform duration-300 group-hover:scale-125"
        style={{ width: 44, height: 72 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://minotar.net/armor/body/${name}/100.png`}
          alt="Skin Body"
          style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = `https://minotar.net/helm/${name}/64.png`;
            img.style.objectFit = "cover";
            img.style.imageRendering = "pixelated";
            img.style.borderRadius = "4px";
          }}
        />
      </div>

      {/* Name + score */}
      <div className="flex-1 min-w-0 relative z-10 pl-2">
        <div className="text-white font-extrabold text-[17px] sm:text-[19px] leading-tight tracking-wide">{name}</div>
        <div className="flex items-center gap-1.5 mt-1">
          <svg width="14" height="14" viewBox="0 0 14 14" className="text-[#fbbf24] flex-shrink-0">
            <path d="M7 0L9.2 4.5L14 5.2L10.5 8.6L11.3 13.5L7 11.2L2.7 13.5L3.5 8.6L0 5.2L4.8 4.5L7 0Z" fill="currentColor" />
          </svg>
          <span className="text-gray-300 font-medium text-xs hidden sm:inline">Combat Master</span>
          <span className="text-gray-500 font-medium text-xs">({score} pts)</span>
        </div>
      </div>

      {/* Region Badge — hidden on mobile */}
      <div className="hidden sm:flex flex-shrink-0 relative z-10 px-6">
        <div
          className="px-2 py-1 rounded-md text-xs font-black uppercase tracking-wider border"
          style={{ background: regionStyle.bg, color: regionStyle.color, borderColor: `${regionStyle.color}33` }}
        >
          {region}
        </div>
      </div>

      {/* Tiers — hidden on mobile, 2-row grid on desktop */}
      <div className="hidden sm:flex flex-shrink-0 w-[240px] relative z-10">
        {ratedKits.length > 0 && (
          <div className="grid grid-cols-4 gap-x-3 gap-y-2">
            {ratedKits.slice(0, 8).map(kit => (
              <KitCircle key={kit.key} kit={kit} tier={stats[kit.key as keyof PlayerData]!} size={28} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface ColumnSubtierData {
  tier: string;
  players: { name: string; score: number }[];
}

interface ColumnData {
  label: string;
  color: string;
  hdrBg: string;
  totalPlayers: number;
  subtiers: ColumnSubtierData[];
}

/* ─────────────────────────────────── Column (Category view) ─────────── */
function TierColumn({ col, idx, onPlayerClick }: {
  col: ColumnData; idx: number;
  onPlayerClick: (name: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07 }}
      className="flex flex-col min-w-[200px] flex-1 rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3" style={{ background: col.hdrBg }}>
        <span className="text-lg leading-none">🏆</span>
        <span className="font-bold text-[15px]" style={{ color: col.color }}>{col.label}</span>
        <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${col.color}22`, color: col.color }}>{col.totalPlayers}</span>
      </div>
      <div className="h-px" style={{ background: "rgba(255,255,255,0.08)" }} />

      {/* Player rows grouped by subtier */}
      <div className="flex-1 bg-[#0d0d0d] p-2 space-y-3">
        {col.subtiers.map((sub) => {
          if (sub.players.length === 0) return null;
          const tierColor = TIER_COLOR[sub.tier] ?? "#aaa";
          const isHigh = sub.tier.startsWith("HT");
          return (
            <div key={sub.tier} className="space-y-1">
              {/* Sub-tier Header */}
              <div className="flex items-center justify-between px-2 py-1 rounded bg-white/[0.04] border border-white/5">
                <span className="text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5" style={{ color: tierColor }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: tierColor }} />
                  {isHigh ? "HIGH TIER" : "LOW TIER"} ({sub.tier})
                </span>
                <span className="text-[9px] font-bold text-gray-500">{sub.players.length}</span>
              </div>

              {/* Players in this subtier */}
              <div className="space-y-0.5">
                {sub.players.map(({ name: p, score }, i) => (
                  <motion.button
                    key={p}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.025 }}
                    whileHover={{ scale: 1.03, x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onPlayerClick(p)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/8 transition-colors group text-left"
                  >
                    <div className="w-7 h-7 rounded shrink-0 overflow-hidden bg-[#181818] ring-1 ring-white/10 group-hover:ring-white/30 transition-colors">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://minotar.net/helm/${p}/32.png`} alt={p}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = fallbackSrc(32); }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors truncate flex-1">{p}</span>
                    
                    {/* Sub-tier Badge */}
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0 font-mono"
                          style={{ background: `${tierColor}20`, color: tierColor, border: `1px solid ${tierColor}40` }}>
                      {sub.tier}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────── Main Page ──────────────────────── */
export default function TierListPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overall" | Category>("overall");
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) { setSpinning(true); setLoading(true); setError(null); }
    try {
      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setLastUpdated(new Date());
      if (!silent) setError(null);
    } catch (e) {
      if (!silent) setError(e instanceof Error ? e.message : "Failed");
    } finally {
      if (!silent) { setLoading(false); setTimeout(() => setSpinning(false), 700); }
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 5 seconds
    intervalRef.current = setInterval(() => fetchData(true), 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchData]);

  /* Leaderboard helper for highest individual tier index */
  const getBestTierIndex = (stats: PlayerData) => {
    let best = 999;
    Object.values(stats).forEach(t => {
      if (t) {
        const idx = TIER_ORDER.indexOf(t);
        if (idx !== -1 && idx < best) best = idx;
      }
    });
    return best;
  };

  /* Leaderboard */
  const leaderboard = data
    ? Object.entries(data)
        .map(([name, record]) => ({ name, record, score: calcScore(record.tiers) }))
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          const bestA = getBestTierIndex(a.record.tiers);
          const bestB = getBestTierIndex(b.record.tiers);
          if (bestA !== bestB) return bestA - bestB;
          return a.name.localeCompare(b.name);
        })
        .filter(({ name }) => !search || name.toLowerCase().includes(search.toLowerCase()))
    : [];

  /* Category columns */
  function buildCols(cat: Category): ColumnData[] {
    if (!data) return [];
    return TIER_COLS.map(col => {
      let totalPlayers = 0;
      const subtiers = col.tiers.map(tier => {
        const matching: { name: string; score: number }[] = [];
        Object.entries(data).forEach(([n, record]) => {
          if (record.tiers[cat as keyof PlayerData] === tier && (!search || n.toLowerCase().includes(search.toLowerCase()))) {
            matching.push({ name: n, score: calcScore(record.tiers) });
          }
        });
        // Sort matching players by total score descending, then by username alphabetically
        matching.sort((a, b) => b.score !== a.score ? b.score - a.score : a.name.localeCompare(b.name));
        totalPlayers += matching.length;
        return { tier, players: matching };
      });

      return {
        label: col.label,
        color: col.color,
        hdrBg: col.hdrBg,
        totalPlayers,
        subtiers,
      };
    }).filter(col => col.totalPlayers > 0);
  }

  const playerRank = selected && data
    ? Object.entries(data)
        .map(([n, record]) => ({ name: n, score: calcScore(record.tiers) }))
        .sort((a, b) => b.score - a.score)
        .findIndex(p => p.name === selected) + 1
    : 1;

  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d" }}>
      {/* subtle bg glow */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,45,45,0.04) 0%, transparent 70%)" }} />

      <div className="relative z-10 mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* ──── Top bar ──── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              <span className="text-brand-red">REAR</span>
              <span className="text-white">MC</span>
              <span className="text-gray-300 font-bold text-2xl ml-2">Rankings</span>
            </h1>
            <p className="text-gray-600 text-xs mt-1">Auto-updates every 5 seconds</p>
          </div>
          <div className="flex items-center gap-3">
            {/* LIVE badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </div>
            {lastUpdated && <span className="text-xs text-gray-600">{lastUpdated.toLocaleTimeString()}</span>}
            <button onClick={() => fetchData(false)} disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/8 border border-white/8 transition-all disabled:opacity-40">
              <RefreshCw size={13} className={spinning ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </motion.div>

        {/* ──── Tab row ──── */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="flex gap-1 mb-6 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>

          {/* Overall */}
          {(() => {
            const active = activeTab === "overall";
            return (
              <button key="overall" onClick={() => setActiveTab("overall")}
                className="relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl min-w-[68px] flex-shrink-0 border transition-all duration-200"
                style={{
                  background: active ? "rgba(255,215,0,0.14)" : "rgba(255,255,255,0.03)",
                  borderColor: active ? "rgba(255,215,0,0.35)" : "rgba(255,255,255,0.07)",
                  color: active ? "#FFD700" : "#6b7280",
                }}>
                <span className="text-2xl leading-none">🏆</span>
                <span className="text-[10px] font-bold uppercase tracking-wide">Overall</span>
                {active && <div className="absolute bottom-0 inset-x-0 h-0.5 rounded-full" style={{ background: "#FFD700" }} />}
              </button>
            );
          })()}

          {/* Kit tabs */}
          {KITS.map(kit => {
            const active = activeTab === kit.key;
            return (
              <button key={kit.key} onClick={() => setActiveTab(kit.key)}
                className="relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl min-w-[68px] flex-shrink-0 border transition-all duration-200"
                style={{
                  background: active ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.03)",
                  borderColor: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)",
                  color: active ? "#fff" : "#6b7280",
                }}>
                {/* Minecraft item in dark circle — like MCTiers */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={kit.icon} alt={kit.label}
                    style={{ width: 22, height: 22, imageRendering: "pixelated", objectFit: "contain" }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide leading-none">{kit.label}</span>
                {active && <div className="absolute bottom-0 inset-x-0 h-0.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </motion.div>

        {/* ──── Search ──── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }} className="relative max-w-xs mb-5">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input type="text" placeholder="Search player…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/25 transition-colors" />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              <X size={13} />
            </button>
          )}
        </motion.div>

        {/* ──── Content area ──── */}
        <AnimatePresence mode="wait">

          {loading && (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-40 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-brand-red animate-spin" />
              <p className="text-gray-500 text-sm">Loading rankings…</p>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 gap-3 text-center">
              <div className="text-5xl">⚠️</div>
              <p className="text-white font-semibold">Could not load rankings</p>
              <p className="text-gray-500 text-sm">{error}</p>
              <button onClick={() => fetchData(false)} className="mt-4 px-6 py-2.5 bg-brand-red text-white font-bold rounded-lg hover:bg-brand-red/90 transition-colors">Try Again</button>
            </motion.div>
          )}

          {/* ── OVERALL leaderboard (like screenshot 1) ── */}
          {!loading && !error && activeTab === "overall" && (
            <motion.div key="overall-view" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
              {/* Table header - hidden on mobile */}
              <div className="hidden sm:flex items-center gap-4 px-5 py-2 mb-2">
                <div className="w-[60px] text-[10px] font-black uppercase tracking-widest text-[#374151]">#</div>
                <div className="w-[44px] flex-shrink-0" />
                <div className="flex-1 text-[10px] font-black uppercase tracking-widest text-[#374151] pl-2">Player</div>
                <div className="w-[80px] text-[10px] font-black uppercase tracking-widest text-[#374151] text-center">Region</div>
                <div className="w-[240px] text-[10px] font-black uppercase tracking-widest text-[#374151]">Tiers</div>
              </div>
              <div className="space-y-0 relative z-10">
                {leaderboard.length === 0
                  ? <div className="text-center py-20 text-gray-500 text-sm">No players found</div>
                  : leaderboard.map(({ name, record }, i) => (
                    <LbRow key={name} rank={i + 1} name={name} record={record} onClick={() => setSelected(name)} />
                  ))
                }
              </div>
            </motion.div>
          )}

          {/* ── CATEGORY column view (like screenshot 2) ── */}
          {!loading && !error && activeTab !== "overall" && (
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
              {(() => {
                const cols = buildCols(activeTab as Category);
                if (cols.length === 0) return (
                  <div className="text-center py-32 text-gray-500">
                    <p className="font-semibold text-lg">No players ranked in {KITS.find(k => k.key === activeTab)?.label}</p>
                    {search && <p className="text-sm mt-1 text-gray-600">No match for &ldquo;{search}&rdquo;</p>}
                  </div>
                );
                return (
                  <div className="flex gap-3 overflow-x-auto pb-4" style={{ alignItems: "flex-start" }}>
                    {cols.map((col, i) => (
                      <TierColumn key={col.label} col={col} idx={i} onPlayerClick={setSelected} />
                    ))}
                  </div>
                );
              })()}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ──── Profile Card Modal ──── */}
      <AnimatePresence>
        {selected && data?.[selected] && (
          <ProfileCard key={selected} name={selected} stats={data[selected].tiers} rank={playerRank} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
