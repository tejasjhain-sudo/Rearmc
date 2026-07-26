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
  HT1: 100, LT1: 80, HT2: 65, LT2: 55, HT3: 45, LT3: 38, HT4: 30, LT4: 22, HT5: 15, LT5: 10,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(12px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.78, opacity: 0, y: 28 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.80, opacity: 0, y: 18 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-[340px] rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg,#14141d 0%,#0d0d14 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.9)",
        }}
      >
        {/* header glow */}
        <div className="absolute inset-x-0 top-0 h-36 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(255,215,0,0.14) 0%, transparent 65%)" }}
        />

        {/* close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <X size={16} className="text-gray-400" />
        </button>

        <div className="relative z-10 flex flex-col items-center px-7 pt-9 pb-7 gap-4">

          {/* Full body skin */}
          <div className="w-24 h-24 relative">
            <div
              className="w-24 h-24 rounded-full overflow-hidden ring-4"
              style={{ "--tw-ring-color": "#FFD700", boxShadow: "0 0 30px rgba(255,215,0,0.3)", background: "#181828" } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://minotar.net/helm/${name}/96.png`}
                alt={name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = fallbackSrc(96); }}
              />
            </div>
          </div>

          {/* Name */}
          <h2 className="text-[22px] font-extrabold text-white tracking-tight leading-none">{name}</h2>

          {/* Role badge */}
          <div className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold"
            style={{ background: "linear-gradient(135deg,#6b4e00,#3e2c00)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.22)" }}>
            ⚡ RearMC Player
          </div>

          {/* NameMC */}
          <a href={`https://namemc.com/profile/${name}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-300 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-5 h-5 rounded bg-[#3C8527] flex items-center justify-center text-white text-[11px] font-black">N</div>
            NameMC <ExternalLink size={11} className="text-gray-500" />
          </a>

          <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.07)" }} />

          {/* Position */}
          <div className="w-full">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-500 mb-2.5">Position</p>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,215,0,0.07)", border: "1px solid rgba(255,215,0,0.16)" }}>
              <div className="h-8 px-3 rounded-lg flex items-center justify-center text-black font-extrabold text-base"
                style={{ background: "linear-gradient(135deg,#FFD700,#FFA500)", minWidth: 44 }}>
                {rank}.
              </div>
              <span className="text-base">🏆</span>
              <span className="text-white font-bold text-sm uppercase tracking-wide">Overall</span>
              <div className="ml-auto font-bold text-sm" style={{ color: "#FFD700" }}>{score} pts</div>
            </div>
          </div>

          {/* Tiers */}
          {ratedKits.length > 0 && (
            <div className="w-full">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-500 mb-3">Tiers</p>
              <div className="flex flex-wrap gap-3 p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {ratedKits.map(kit => (
                  <KitCircle key={kit.key} kit={kit} tier={stats[kit.key]!} size={40} />
                ))}
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
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.045)", zIndex: 10 }}
      whileTap={{ scale: 0.99 }}
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
        className="flex-shrink-0 overflow-hidden relative z-10 transition-transform duration-300 group-hover:scale-110"
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
        <div className="text-white font-extrabold text-[19px] leading-tight tracking-wide">{name}</div>
        <div className="flex items-center gap-1.5 mt-1">
          <svg width="14" height="14" viewBox="0 0 14 14" className="text-[#fbbf24] flex-shrink-0">
            <path d="M7 0L9.2 4.5L14 5.2L10.5 8.6L11.3 13.5L7 11.2L2.7 13.5L3.5 8.6L0 5.2L4.8 4.5L7 0Z" fill="currentColor" />
          </svg>
          <span className="text-gray-300 font-medium text-xs">Combat Master</span>
          <span className="text-gray-500 font-medium text-xs">({score} points)</span>
        </div>
      </div>

      {/* Region Badge */}
      <div className="flex-shrink-0 relative z-10 px-6">
        <div
          className="px-2 py-1 rounded-md text-xs font-black uppercase tracking-wider border"
          style={{ background: regionStyle.bg, color: regionStyle.color, borderColor: `${regionStyle.color}33` }}
        >
          {region}
        </div>
      </div>

      {/* Tiers — 2-row grid of icon circles */}
      <div className="flex-shrink-0 w-[240px] relative z-10">
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

/* ─────────────────────────────────── Column (Category view) ─────────── */
function TierColumn({ col, players, idx, onPlayerClick }: {
  col: typeof TIER_COLS[0]; players: string[]; idx: number;
  onPlayerClick: (name: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07 }}
      className="flex flex-col min-w-[185px] flex-1 rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3" style={{ background: col.hdrBg }}>
        <span className="text-lg leading-none">🏆</span>
        <span className="font-bold text-[15px]" style={{ color: col.color }}>{col.label}</span>
        <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${col.color}22`, color: col.color }}>{players.length}</span>
      </div>
      <div className="h-px" style={{ background: "rgba(255,255,255,0.08)" }} />

      {/* Player rows */}
      <div className="flex-1 bg-[#0d0d0d] p-2 space-y-0.5">
        {players.length === 0
          ? <p className="text-center text-gray-700 text-xs py-4 italic">Empty</p>
          : players.map((p, i) => (
            <motion.button
              key={p}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.025 }}
              whileHover={{ scale: 1.03, x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onPlayerClick(p)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/8 transition-colors group text-left"
            >
              <div className="w-8 h-8 rounded shrink-0 overflow-hidden bg-[#181818] ring-1 ring-white/10 group-hover:ring-white/30 transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://minotar.net/helm/${p}/32.png`} alt={p}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = fallbackSrc(32); }}
                />
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate flex-1">{p}</span>
              {/* MCTiers chevrons */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5 flex-shrink-0">
                <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 2l3 3-3 3M5 2l3 3-3 3" stroke="#9ca3af" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
              </div>
            </motion.button>
          ))
        }
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

  /* Leaderboard */
  const leaderboard = data
    ? Object.entries(data)
        .map(([name, record]) => ({ name, record, score: calcScore(record.tiers) }))
        .sort((a, b) => b.score - a.score)
        .filter(({ name }) => !search || name.toLowerCase().includes(search.toLowerCase()))
    : [];

  /* Category columns */
  function buildCols(cat: Category) {
    if (!data) return [];
    return TIER_COLS.map(col => {
      const players: string[] = [];
      col.tiers.forEach(tier => {
        Object.entries(data).forEach(([n, record]) => {
          if (record.tiers[cat as keyof PlayerData] === tier && (!search || n.toLowerCase().includes(search.toLowerCase())))
            players.push(n);
        });
      });
      players.sort();
      return { ...col, players };
    }).filter(col => col.players.length > 0);
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
              {/* Table header */}
              <div className="flex items-center gap-4 px-5 py-2 mb-2">
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
                      <TierColumn key={col.label} col={col} players={col.players} idx={i} onPlayerClick={setSelected} />
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
