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

/* ─────────────────────────────────── Steve Sprite ───────────────────── */
function SteveSprite({ running }: { running?: boolean }) {
  return (
    <motion.div
      className="flex flex-col items-center select-none"
      animate={running ? { y: [0, -6, 0] } : {}}
      transition={{ duration: 0.35, repeat: running ? Infinity : 0 }}
      style={{ imageRendering: "pixelated" }}
    >
      {/* Head */}
      <div style={{ width: 36, height: 36, background: "#c89c7c", border: "3px solid #7a5c3a", position: "relative", boxShadow: "inset -4px -4px 0 #a07850" }}>
        <div style={{ position: "absolute", top: 10, left: 5, width: 8, height: 8, background: "#fff" }} />
        <div style={{ position: "absolute", top: 10, right: 5, width: 8, height: 8, background: "#fff" }} />
        <div style={{ position: "absolute", top: 12, left: 7, width: 4, height: 5, background: "#224488" }} />
        <div style={{ position: "absolute", top: 12, right: 7, width: 4, height: 5, background: "#224488" }} />
        <div style={{ position: "absolute", bottom: 6, left: 8, right: 8, height: 3, background: "#7a3a2a" }} />
      </div>
      {/* Body */}
      <div style={{ width: 40, height: 44, background: "#5577aa", border: "3px solid #334488", boxShadow: "inset -4px -4px 0 #334488" }} />
      {/* Legs */}
      <div style={{ display: "flex" }}>
        <motion.div
          style={{ width: 18, height: 28, background: "#335599", border: "2px solid #224488", boxShadow: "inset -2px -2px 0 #224488" }}
          animate={running ? { rotate: [-18, 18] } : {}}
          transition={{ duration: 0.35, repeat: running ? Infinity : 0, repeatType: "reverse" }}
        />
        <motion.div
          style={{ width: 18, height: 28, background: "#335599", border: "2px solid #224488", boxShadow: "inset -2px -2px 0 #224488" }}
          animate={running ? { rotate: [18, -18] } : {}}
          transition={{ duration: 0.35, repeat: running ? Infinity : 0, repeatType: "reverse" }}
        />
      </div>
    </motion.div>
  );
}

function TNTBlock({ flash }: { flash: boolean }) {
  return (
    <motion.div
      style={{ width: 38, height: 38, position: "relative", border: "3px solid #333", boxShadow: "0 0 20px rgba(255,60,0,0.8)" }}
      animate={flash ? {
        background: ["#cc1100", "#ffffff", "#cc1100", "#ffffff", "#cc1100"],
        boxShadow: ["0 0 20px rgba(255,60,0,0.8)", "0 0 60px rgba(255,200,0,1)", "0 0 20px rgba(255,60,0,0.8)"],
      } : { background: "#cc1100" }}
      transition={{ duration: 0.25, repeat: flash ? Infinity : 0 }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 8, fontWeight: 900, color: "#cc1100", letterSpacing: 1 }}>TNT</span>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "25%", background: "#fff" }} />
      <div style={{ position: "absolute", inset: "40% 0 25%", background: "#cc1100" }} />
    </motion.div>
  );
}

/* ─────────────────────────────────── Steve TNT Intro ────────────────── */
type IntroPhase = "run" | "plant" | "flash" | "explode" | "done";

function SteveTNTIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<IntroPhase>("run");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("plant"), 1100);
    const t2 = setTimeout(() => setPhase("flash"), 1700);
    const t3 = setTimeout(() => setPhase("explode"), 2500);
    const t4 = setTimeout(() => { setPhase("done"); onDone(); }, 3300);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onDone]);

  const EXPLOSION_PARTICLES = Array.from({ length: 32 }, (_, i) => {
    const angle = (i / 32) * 360;
    const dist = 70 + (i % 5) * 30;
    const size = 5 + (i % 4) * 4;
    const color = ["#ff4400","#ff8800","#ffcc00","#ffffff","#ff2222","#ffee00"][i % 6];
    return { id: i, angle, dist, size, color };
  });

  if (phase === "done") return null;

  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-end justify-center overflow-hidden rounded-3xl"
      style={{ background: "linear-gradient(180deg, #050508 0%, #0a0005 100%)" }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Scan-line overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
        zIndex: 1,
      }} />

      {/* Ground */}
      <div className="absolute bottom-0 inset-x-0 h-16" style={{
        background: "repeating-linear-gradient(90deg, #3a2810 0px, #3a2810 16px, #2a1a08 16px, #2a1a08 32px)",
        borderTop: "3px solid #5a3818",
      }} />

      {/* Steve running → planting */}
      <div className="absolute bottom-14 flex items-end gap-3" style={{ zIndex: 2 }}>
        <AnimatePresence mode="wait">
          {phase === "run" && (
            <motion.div
              key="steve-run"
              initial={{ x: 320, opacity: 1 }}
              animate={{ x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            >
              <SteveSprite running />
            </motion.div>
          )}
          {(phase === "plant" || phase === "flash") && (
            <motion.div key="steve-plant" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
              <SteveSprite />
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <TNTBlock flash={phase === "flash"} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Steve runs away when flash starts */}
      <AnimatePresence>
        {phase === "flash" && (
          <motion.div
            key="steve-flee"
            className="absolute bottom-14 z-10"
            initial={{ x: 0 }}
            animate={{ x: -400 }}
            transition={{ duration: 0.6, ease: "easeIn" }}
          >
            <SteveSprite running />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explosion */}
      <AnimatePresence>
        {phase === "explode" && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
            {/* Flash white */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.25 }}
              style={{ background: "#fff" }}
            />
            {/* Boom emoji */}
            <motion.div
              className="text-[80px] absolute z-10"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 2, 2.5], opacity: [1, 1, 0] }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >💥</motion.div>
            {/* Particles */}
            {EXPLOSION_PARTICLES.map(p => (
              <motion.div
                key={p.id}
                className="absolute rounded-sm"
                style={{ width: p.size, height: p.size, background: p.color, boxShadow: `0 0 ${p.size}px ${p.color}` }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((p.angle * Math.PI) / 180) * p.dist,
                  y: Math.sin((p.angle * Math.PI) / 180) * p.dist,
                  opacity: 0, scale: 0,
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            ))}
            {/* Smoke */}
            {[0,1,2,3,4].map(i => (
              <motion.div key={`smoke-${i}`}
                className="absolute rounded-full"
                style={{ width: 20 + i * 10, height: 20 + i * 10, background: "rgba(80,80,80,0.6)" }}
                initial={{ scale: 0, y: 0, opacity: 0.8 }}
                animate={{ scale: 3 + i, y: -80 - i * 20, opacity: 0 }}
                transition={{ duration: 0.8, delay: i * 0.06 }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Eerie red light ambient */}
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.04, 0.12, 0.04] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ background: "radial-gradient(ellipse at center, rgba(255,40,0,0.3) 0%, transparent 70%)" }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────── Profile Card ───────────────────── */
function ProfileCard({ name, stats, rank, onClose }: {
  name: string; stats: PlayerData; rank: number; onClose: () => void;
}) {
  const score = calcScore(stats);
  const ratedKits = KITS.filter(k => stats[k.key] !== null);
  const [introOver, setIntroOver] = useState(false);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(14px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-[340px] rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg,#0c0c0e 0%,#080810 100%)",
          border: "1px solid rgba(255,80,0,0.2)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.98), 0 0 40px rgba(255,60,0,0.1)",
          minHeight: 340,
        }}
      >
        {/* Steve TNT Intro overlay */}
        <AnimatePresence>
          {!introOver && <SteveTNTIntro onDone={() => setIntroOver(true)} />}
        </AnimatePresence>

        {/* Red crack lines top */}
        <div className="absolute inset-x-0 top-0 h-0.5 pointer-events-none"
          style={{ background: "linear-gradient(90deg,transparent,#ff3300,#ff6600,#ff3300,transparent)" }} />

        {/* Subtle ember glow */}
        <div className="absolute inset-x-0 top-0 h-32 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,60,0,0.08) 0%, transparent 70%)" }} />

        {/* close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-red-900/40"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <X size={14} className="text-gray-400" />
        </button>

        <div className="relative z-10 flex flex-col items-center px-6 pt-8 pb-7 gap-4">

          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 0 0 2px rgba(255,60,0,0.4), 0 0 30px rgba(255,60,0,0.2)", background: "#111" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://minotar.net/helm/${name}/96.png`} alt={name}
                className="w-full h-full object-cover" style={{ imageRendering: "pixelated" }}
                onError={e => { (e.target as HTMLImageElement).src = fallbackSrc(96); }}
              />
            </div>
            {/* Explosion mark */}
            <motion.div className="absolute -bottom-1 -right-1 text-base"
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
            >💥</motion.div>
          </div>

          {/* Name */}
          <div className="text-center">
            <h2 className="text-[22px] font-black tracking-tight text-white">{name}</h2>
            <div className="text-xs font-bold mt-0.5 tracking-widest uppercase" style={{ color: "#ff5500" }}>⚡ RearMC Player</div>
          </div>

          {/* NameMC */}
          <a href={`https://namemc.com/profile/${name}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-300 hover:text-white transition-all hover:scale-105"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-5 h-5 rounded bg-[#3C8527] flex items-center justify-center text-white text-[11px] font-black">N</div>
            NameMC <ExternalLink size={11} className="text-gray-500" />
          </a>

          <div className="w-full h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(255,80,0,0.35),transparent)" }} />

          {/* Position */}
          <div className="w-full">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-600 mb-2">Position</p>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "rgba(255,60,0,0.07)", border: "1px solid rgba(255,60,0,0.18)" }}>
              <div className="h-8 px-3 rounded-lg flex items-center justify-center font-extrabold text-base text-white"
                style={{ background: "linear-gradient(135deg,#cc2200,#ff5500)", minWidth: 44 }}>
                {rank}.
              </div>
              <span className="text-base">🏆</span>
              <span className="text-white font-bold text-sm uppercase">Overall</span>
              <div className="ml-auto font-bold text-sm" style={{ color: "#ff5500" }}>{score} pts</div>
            </div>
          </div>

          {/* Tiers */}
          {ratedKits.length > 0 && (
            <div className="w-full">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-600 mb-3">Tiers</p>
              <div className="flex flex-wrap gap-3 p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {ratedKits.map(kit => (
                  <KitCircle key={kit.key} kit={kit} tier={stats[kit.key]!} size={40} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom line */}
        <div className="absolute inset-x-0 bottom-0 h-0.5"
          style={{ background: "linear-gradient(90deg,transparent,#ff3300,#ff6600,#ff3300,transparent)" }} />
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
