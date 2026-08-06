/* eslint-disable react-hooks/purity */
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ─────────────────────────────────── 1. Supernova Burst ───────────────────────────── */
export function SupernovaIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none rounded-2xl overflow-hidden flex items-center justify-center bg-[#030008]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.6, times: [0, 0.85, 1] }}
    >
      <motion.div
        className="w-40 h-40 rounded-full border-4 border-cyan-400 shadow-[0_0_100px_#38bdf8] bg-cyan-400/20"
        animate={{ scale: [3, 0.1, 4.5], rotate: [0, 180, 360], opacity: [0.8, 1, 0] }}
        transition={{ duration: 2.2, times: [0, 0.35, 1], ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{ opacity: [0, 0, 1, 0] }}
        transition={{ duration: 2.2, times: [0, 0.33, 0.45, 1] }}
      />
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i / 32) * Math.PI * 2;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-200 rounded-full shadow-[0_0_15px_#38bdf8]"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: [0, Math.cos(angle) * 350],
              y: [0, Math.sin(angle) * 350],
              opacity: [0, 0, 1, 0],
              scale: [0, 1, 2.5, 0],
            }}
            transition={{ duration: 2.2, times: [0, 0.35, 0.5, 1], ease: "easeOut" }}
          />
        );
      })}
    </motion.div>
  );
}

/* ─────────────────────────────────── 2. Dimensional Portal ───────────────────────────── */
export function DimensionalPortalIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none rounded-2xl overflow-hidden flex items-center justify-center bg-[#020617]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.6, times: [0, 0.85, 1] }}
    >
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border-2 border-indigo-500/60 shadow-[0_0_50px_#6366f1]"
          style={{ width: ring * 120, height: ring * 120 }}
          animate={{
            rotate: ring % 2 === 0 ? [0, 360] : [360, 0],
            scale: [0.2, 1.4, 0.8, 2],
            opacity: [0, 0.8, 1, 0],
          }}
          transition={{ duration: 2.2, ease: "easeInOut", delay: ring * 0.1 }}
        />
      ))}
      <motion.div
        className="w-24 h-24 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 blur-md shadow-[0_0_80px_#818cf8]"
        animate={{ scale: [0, 2.5, 0], rotate: [0, 720] }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────── 3. Cyber Matrix Grid ───────────────────────────── */
export function CyberMatrixIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none rounded-2xl overflow-hidden bg-[#030712] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.4, times: [0, 0.85, 1] }}
    >
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(16,185,129,0.3) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(16,185,129,0.3) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "40px 80px"], opacity: [0, 0.8, 0] }}
        transition={{ duration: 2.2, ease: "linear" }}
      />
      <motion.div
        className="absolute w-full h-1 bg-emerald-400 shadow-[0_0_25px_#34d399]"
        animate={{ top: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-12 bg-gradient-to-b from-emerald-300 to-transparent shadow-[0_0_10px_#10b981]"
          style={{ left: `${(i * 5) % 100}%` }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: [ -100, 450 ], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, delay: (i % 5) * 0.1, ease: "linear" }}
        />
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────── 4. Celestial Eclipse ───────────────────────────── */
export function CelestialEclipseIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none rounded-2xl overflow-hidden flex items-center justify-center bg-[#070510]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.6, times: [0, 0.85, 1] }}
    >
      <motion.div
        className="w-56 h-56 rounded-full bg-amber-400/30 blur-2xl shadow-[0_0_120px_#f59e0b]"
        animate={{ scale: [0.5, 1.4, 0.8], opacity: [0, 1, 0] }}
        transition={{ duration: 2.3, ease: "easeInOut" }}
      />
      <motion.div
        className="w-40 h-40 rounded-full bg-[#070510] border-2 border-amber-300/40 shadow-[inset_0_0_30px_rgba(245,158,11,0.5)]"
        animate={{ x: [-200, 0, 200], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 2.3, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────── 5. Ender Dragon Void (Minecraft) ───────────────────────────── */
export function EnderDragonVoidIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none rounded-2xl overflow-hidden flex items-center justify-center bg-[#0d0714]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.6, times: [0, 0.85, 1] }}
    >
      <motion.div
        className="w-64 h-64 rounded-full bg-gradient-to-r from-fuchsia-600 via-purple-700 to-indigo-900 blur-3xl shadow-[0_0_140px_#d946ef]"
        animate={{ scale: [0, 2.2, 0], opacity: [0, 0.9, 0] }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <motion.div
            key={i}
            className="absolute h-0.5 bg-fuchsia-400 shadow-[0_0_15px_#e879f9]"
            style={{ width: "100%", transformOrigin: "50% 50%" }}
            initial={{ rotate: (angle * 180) / Math.PI, scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1.4, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, delay: i * 0.08, ease: "easeInOut" }}
          />
        );
      })}
    </motion.div>
  );
}

/* ─────────────────────────────────── 6. Minecraft Steve Sword Slash ───────────────────────────── */
export function MinecraftSteveSlashIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none rounded-2xl overflow-hidden flex items-center justify-center bg-[#070b14]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.6, times: [0, 0.85, 1] }}
    >
      <motion.div
        className="absolute left-2 bottom-0 w-36 h-56 pointer-events-none drop-shadow-[0_0_35px_#38bdf8]"
        initial={{ x: -220, opacity: 0, scale: 0.8 }}
        animate={{ x: [-220, 10, 0], opacity: [0, 1, 0], scale: [0.8, 1.1, 0.95] }}
        transition={{ duration: 1.8, times: [0, 0.4, 1], ease: "easeOut" }}
      >
        <img
          src="https://visage.surgeplay.com/full/384/MHF_Steve"
          alt="Minecraft Steve Full Body"
          className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(56,189,248,0.8)]"
        />
      </motion.div>
      <motion.div
        className="absolute w-[120%] h-3 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_30px_#38bdf8]"
        initial={{ rotate: -45, scaleX: 0, opacity: 0 }}
        animate={{ rotate: [-45, -20, 10], scaleX: [0, 1.4, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 1.6, delay: 0.3, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────── 7. Minecraft Diamond Armor Level Up ───────────────────────────── */
export function DiamondArmorIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-[#02131d]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.6, times: [0, 0.85, 1] }}
    >
      <motion.div
        className="w-48 h-48 rounded-2xl border-4 border-cyan-300 shadow-[0_0_80px_#38bdf8] bg-cyan-400/10"
        animate={{ scale: [0.2, 1.2, 1], rotate: [0, 90, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────── 8. Herobrine Creepypasta Jumpscare ───────────────────────────── */
export function HerobrineHorrorIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 3, times: [0, 0.9, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-[#3a0007]"
        animate={{ opacity: [0.95, 0.2, 0.9, 0.1, 0.95, 0.3, 0] }}
        transition={{ duration: 2.7, times: [0, 0.1, 0.18, 0.4, 0.48, 0.75, 1] }}
      />
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{ opacity: [0, 0.95, 0, 1, 0, 0.9, 0] }}
        transition={{ duration: 2.7, times: [0, 0.12, 0.15, 0.45, 0.48, 0.72, 1] }}
      />
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #ff0033 2px, #ff0033 4px)", backgroundSize: "100% 4px" }}
      />
      <motion.div
        className="relative flex flex-col items-center justify-center pointer-events-none drop-shadow-[0_0_80px_#ffffff]"
        initial={{ scale: 0.3, y: 50, opacity: 0 }}
        animate={{
          scale: [0.3, 0.9, 1.4, 3.8],
          y: [50, 20, -10, -30],
          opacity: [0, 1, 1, 0],
          x: [0, -8, 8, -12, 12, 0],
          filter: ["brightness(0.8) contrast(2)", "brightness(1.5) contrast(3)", "brightness(4) contrast(4)", "brightness(10)"]
        }}
        transition={{ duration: 2.5, times: [0, 0.3, 0.7, 1] }}
      >
        <div className="relative w-[280px] h-[340px] flex items-center justify-center">
          <img
            src="https://visage.surgeplay.com/full/512/MHF_Steve"
            alt="Herobrine Full Body"
            className="w-full h-full object-contain filter contrast-200 grayscale"
          />
          <div className="absolute top-[16%] left-[34%] w-5 h-4 bg-white rounded-sm shadow-[0_0_25px_#ffffff,0_0_50px_#ffffff]" />
          <div className="absolute top-[16%] right-[34%] w-5 h-4 bg-white rounded-xs shadow-[0_0_25px_#ffffff,0_0_50px_#ffffff]" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────── 9. Entity 303 Glitch Nightmare ───────────────────────────── */
export function Entity303GlitchIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2700);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-[#050000]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.7, times: [0, 0.88, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-red-600 mix-blend-difference"
        animate={{ x: [0, -20, 20, -10, 10, 0], opacity: [0, 0.8, 0.2, 0.9, 0] }}
        transition={{ duration: 1.6, repeat: 1 }}
      />
      <motion.div
        className="absolute inset-0 bg-black opacity-30"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #ef4444 2px, #ef4444 4px)", backgroundSize: "100% 4px" }}
        animate={{ opacity: [0.1, 0.7, 0.1] }}
        transition={{ duration: 1.8 }}
      />
      <motion.div
        className="relative flex flex-col items-center justify-center"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{
          scale: [0.4, 1.4, 1.1, 3.5],
          opacity: [0, 1, 1, 0],
          skewX: [0, -15, 15, 0]
        }}
        transition={{ duration: 2.3, times: [0, 0.3, 0.7, 1] }}
      >
        <div className="w-36 h-36 relative bg-white/10 border-2 border-red-500 rounded-2xl overflow-hidden shadow-[0_0_60px_#ef4444]">
          <div className="w-full h-full bg-[#e5e5e5] relative flex items-center justify-center">
            <div className="w-28 h-28 bg-[#111] rounded-full flex items-center justify-center relative">
              <div className="w-4 h-4 bg-red-600 rounded-full shadow-[0_0_20px_#dc2626] absolute left-5" />
              <div className="w-4 h-4 bg-red-600 rounded-full shadow-[0_0_20px_#dc2626] absolute right-5" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────── 10. Enderman Teleport Jumpscare ───────────────────────────── */
export function EndermanTeleportIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2700);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none rounded-2xl overflow-hidden flex items-center justify-center bg-[#05000c]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.7, times: [0, 0.88, 1] }}
    >
      {/* Void Space Distortion Ring */}
      <motion.div
        className="absolute w-72 h-72 rounded-full border-4 border-fuchsia-500/80 shadow-[0_0_80px_#d946ef] bg-fuchsia-950/20"
        animate={{ scale: [0.2, 1.8, 0], rotate: [0, 360], opacity: [0, 1, 0] }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />

      {/* Floating Ender Particles */}
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-fuchsia-300 rounded-full shadow-[0_0_12px_#e879f9]"
          style={{ top: `${(i * 13) % 90}%`, left: `${(i * 17) % 90}%` }}
          animate={{
            y: [-30, 30, -30],
            x: [-20, 20, -20],
            scale: [0.5, 1.8, 0],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 1.8, delay: i * 0.05, repeat: 1 }}
        />
      ))}

      {/* 3D Enderman Character with Teleport Flash & White Eye Beams */}
      <motion.div
        className="relative w-48 h-80 flex items-center justify-center filter drop-shadow-[0_0_70px_#c084fc]"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{
          opacity: [0, 1, 0.2, 1, 1, 0],
          x: [-120, 100, -30, 0, 0],
          scale: [0.4, 1.1, 0.7, 1.5, 0],
        }}
        transition={{ duration: 2.4, times: [0, 0.2, 0.4, 0.65, 0.9, 1] }}
      >
        <img
          src="https://visage.surgeplay.com/full/512/MHF_Enderman"
          alt="Minecraft Enderman"
          className="w-full h-full object-contain filter contrast-200 brightness-110"
        />
        {/* Intense Eye Flares */}
        <div className="absolute top-[14%] left-[33%] w-5 h-3 bg-fuchsia-200 rounded-sm shadow-[0_0_20px_#f0abfc,0_0_40px_#e879f9]" />
        <div className="absolute top-[14%] right-[33%] w-5 h-3 bg-fuchsia-200 rounded-sm shadow-[0_0_20px_#f0abfc,0_0_40px_#e879f9]" />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────── 11. Warden Dark Sculk Roar ───────────────────────────── */
export function WardenRoarIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none rounded-2xl overflow-hidden flex items-center justify-center bg-[#010912]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.8, times: [0, 0.88, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-[#001426]"
        animate={{ opacity: [1, 0.2, 0.9, 0.1, 0.8, 0] }}
        transition={{ duration: 2.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
      />
      <motion.div
        className="w-64 h-64 rounded-full border-8 border-cyan-400 shadow-[0_0_100px_#06b6d4] bg-cyan-500/10"
        animate={{ scale: [0.1, 3], opacity: [1, 0] }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
      />
      <motion.div
        className="relative w-52 h-72 flex items-center justify-center filter drop-shadow-[0_0_60px_#0891b2]"
        initial={{ y: 150, opacity: 0 }}
        animate={{
          y: [150, 0, -20, 0],
          scale: [0.5, 1.2, 1.4, 0],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 2.4, times: [0, 0.35, 0.75, 1] }}
      >
        <img
          src="https://visage.surgeplay.com/full/512/MHF_WSkeleton"
          alt="Warden Sculk Mob"
          className="w-full h-full object-contain filter hue-rotate-180 brightness-125 contrast-200"
        />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────── 12. Wither Boss Summon ───────────────────────────── */
export function WitherBossIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2700);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none rounded-2xl overflow-hidden flex items-center justify-center bg-[#070707]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.7, times: [0, 0.88, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-blue-950/60 mix-blend-screen"
        animate={{ opacity: [0, 0.9, 0, 1, 0] }}
        transition={{ duration: 2.2, times: [0, 0.3, 0.5, 0.8, 1] }}
      />
      <motion.div
        className="relative w-48 h-72 flex items-center justify-center filter drop-shadow-[0_0_60px_#3b82f6]"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{
          scale: [0.2, 1.3, 1.6, 0],
          rotate: [0, -10, 10, 0],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 2.3, times: [0, 0.3, 0.75, 1] }}
      >
        <img
          src="https://visage.surgeplay.com/full/512/MHF_Wither"
          alt="Minecraft Wither Boss"
          className="w-full h-full object-contain filter contrast-200 brightness-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://visage.surgeplay.com/full/512/MHF_WSkeleton";
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────── 13. Zombie Horde Ambush ───────────────────────────── */
export function ZombieHordeIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none rounded-2xl overflow-hidden flex items-center justify-center bg-[#031408]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.6, times: [0, 0.88, 1] }}
    >
      <motion.div
        className="absolute inset-0 bg-emerald-950/60 mix-blend-color-dodge"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.div
        className="relative w-44 h-64 flex items-center justify-center filter drop-shadow-[0_0_50px_#22c55e]"
        initial={{ y: 150, opacity: 0 }}
        animate={{
          y: [150, 0, -10, 0],
          scale: [0.6, 1.2, 1.4, 0],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 2.3, times: [0, 0.35, 0.75, 1] }}
      >
        <img
          src="https://visage.surgeplay.com/full/512/MHF_Zombie"
          alt="Minecraft Zombie Mob"
          className="w-full h-full object-contain filter contrast-150"
        />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────── 14. Skeleton Archer Strike ───────────────────────────── */
export function SkeletonArcherIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none rounded-2xl overflow-hidden flex items-center justify-center bg-[#0a0d14]"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.6, times: [0, 0.88, 1] }}
    >
      <motion.div
        className="relative w-44 h-64 flex items-center justify-center filter drop-shadow-[0_0_50px_#94a3b8]"
        initial={{ x: 180, opacity: 0 }}
        animate={{
          x: [180, 0, -10, 0],
          scale: [0.6, 1.2, 1.3, 0],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 2.3, times: [0, 0.35, 0.75, 1] }}
      >
        <img
          src="https://visage.surgeplay.com/full/512/MHF_Skeleton"
          alt="Minecraft Skeleton Mob"
          className="w-full h-full object-contain filter contrast-150"
        />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────── CONTINUOUS PARTICLE EFFECTS ───────────────────────────── */
export function EnchantmentParticles() {
  const RUNES = ["ᔑ", "ʖ", "ᓵ", "↸", "ᒷ", "⎓", "⊣", "⍑", "╎", "⋮", "ꖎ", "ᑑ"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-[13px] font-black text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.9)]"
          style={{ top: `${10 + (i * 7) % 80}%`, left: `${8 + (i * 13) % 84}%` }}
          animate={{ y: [-10, -40, -10], x: [-6, 6, -6], opacity: [0, 1, 0], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 2 + (i % 4) * 0.4, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {RUNES[i % RUNES.length]}
        </motion.div>
      ))}
    </div>
  );
}

export function FireParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-500 shadow-[0_0_12px_#f59e0b]"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            top: "100%",
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -120 - Math.random() * 60],
            x: [0, (Math.random() - 0.5) * 40],
            opacity: [0, 0.9, 0],
            scale: [1.2, 0.4],
          }}
          transition={{
            duration: 1.4 + Math.random(),
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

export function CherryBlossomParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-pink-300 rounded-[50%_0_50%_50%] shadow-[0_0_8px_#fbcfe8]"
          style={{
            width: Math.random() * 10 + 6,
            height: Math.random() * 10 + 6,
            top: "-10%",
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, 450],
            x: [0, (Math.random() - 0.5) * 120],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export function DarkDragonAura() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-purple-950 rounded-full blur-md mix-blend-screen"
          style={{
            width: Math.random() * 24 + 12,
            height: Math.random() * 48 + 24,
            bottom: "-10%",
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -220 - Math.random() * 100],
            x: [0, (Math.random() - 0.5) * 80],
            opacity: [0, 0.6, 0],
            scale: [1, 1.8],
          }}
          transition={{
            duration: 2.5 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function ElectricParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-[0_0_8px_#facc15]"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
          animate={{
            x: [0, (Math.random() - 0.5) * 40],
            y: [0, (Math.random() - 0.5) * 40],
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{ duration: 0.8 + Math.random() * 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
