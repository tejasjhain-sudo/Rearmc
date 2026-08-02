/* eslint-disable react-hooks/purity */
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* ─────────────────────────────────── Lightning ───────────────────────────── */
export function LightningIntroEffect() {
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
      <motion.div
        className="absolute inset-0 bg-[#080b14]"
        animate={{ opacity: [0.95, 0.3, 0.9, 0.1, 0.8, 0] }}
        transition={{ duration: 2.2, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
      />
      <motion.div
        className="absolute inset-0 bg-cyan-100"
        animate={{ opacity: [0, 0.8, 0, 0.95, 0, 0.7, 0] }}
        transition={{ duration: 2.2, times: [0, 0.25, 0.3, 0.55, 0.6, 0.75, 1] }}
      />
      <motion.svg
        className="absolute inset-0 w-full h-full text-cyan-300 drop-shadow-[0_0_15px_#38bdf8]"
        viewBox="0 0 360 420" fill="none" stroke="currentColor" strokeWidth="4"
        animate={{ opacity: [0, 1, 0, 1, 0, 0.8, 0], scale: [0.95, 1.05, 0.98, 1.02, 1] }}
        transition={{ duration: 2.2, times: [0, 0.2, 0.3, 0.55, 0.7, 0.85, 1] }}
      >
        <path d="M 180 0 L 165 90 L 195 120 L 140 210 L 175 230 L 130 330 L 160 340 L 120 420" />
      </motion.svg>
    </motion.div>
  );
}

/* ─────────────────────────────────── Enchantment ───────────────────────────── */
export function EnchantmentParticles() {
  const RUNES = ["ᔑ", "ʖ", "ᓵ", "↸", "ᒷ", "⎓", "⊣", "⍑", "╎", "⋮", "ꖎ", "ᑑ"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-[11px] font-bold text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]"
          style={{ top: `${15 + (i * 7) % 70}%`, left: `${10 + (i * 13) % 80}%` }}
          animate={{ y: [-8, -32, -8], x: [-4, 4, -4], opacity: [0, 0.85, 0], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2.2 + (i % 4) * 0.4, delay: i * 0.25, repeat: Infinity, ease: "easeInOut" }}
        >
          {RUNES[i % RUNES.length]}
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────── Fire ───────────────────────────── */
export function FireParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]"
          style={{
            width: Math.random() * 6 + 4,
            height: Math.random() * 6 + 4,
            top: "100%",
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100 - Math.random() * 50],
            x: [0, (Math.random() - 0.5) * 30],
            opacity: [0, 0.8, 0],
            scale: [1, 0.5],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────── Cherry Blossom ───────────────────────────── */
export function CherryBlossomParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-pink-300 rounded-[50%_0_50%_50%] shadow-[0_0_5px_#fbcfe8]"
          style={{
            width: Math.random() * 8 + 6,
            height: Math.random() * 8 + 6,
            top: "-10%",
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, 400],
            x: [0, (Math.random() - 0.5) * 100],
            rotate: [0, 360],
            opacity: [0, 0.9, 0],
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

/* ─────────────────────────────────── Void Galaxy ───────────────────────────── */
export function VoidGalaxyIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none overflow-hidden flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.5, times: [0, 0.8, 1] }}
    >
      {/* Expanding void hole */}
      <motion.div
        className="rounded-full bg-purple-900 blur-xl shadow-[0_0_60px_#581c87]"
        animate={{
          scale: [0, 4],
          opacity: [0.8, 0],
        }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{ width: 100, height: 100 }}
      />
      {/* Stars rushing past */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: [0, Math.cos(angle) * 300],
              y: [0, Math.sin(angle) * 300],
              opacity: [0, 1, 0],
              scale: [0.5, 2, 0],
            }}
            transition={{ duration: 1.5, ease: "easeIn" }}
          />
        );
      })}
    </motion.div>
  );
}

/* ─────────────────────────────────── Dark Dragon Aura ───────────────────────────── */
export function DarkDragonAura() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-purple-900 rounded-full blur-md mix-blend-screen"
          style={{
            width: Math.random() * 20 + 10,
            height: Math.random() * 40 + 20,
            bottom: "-10%",
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -200 - Math.random() * 100],
            x: [0, (Math.random() - 0.5) * 60],
            opacity: [0, 0.4, 0],
            scale: [1, 1.5],
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

/* ─────────────────────────────────── Cyber Glitch ───────────────────────────── */
export function CyberGlitchIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none overflow-hidden bg-black rounded-lg"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2, times: [0, 0.85, 1] }}
    >
      {/* Glitch layers */}
      <motion.div
        className="absolute inset-0 bg-red-500 mix-blend-screen opacity-50"
        animate={{ x: [0, -10, 10, -5, 5, 0], opacity: [0.5, 0.8, 0.2, 0.9, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div
        className="absolute inset-0 bg-blue-500 mix-blend-screen opacity-50"
        animate={{ x: [0, 10, -10, 5, -5, 0], opacity: [0.5, 0.2, 0.8, 0.3, 0] }}
        transition={{ duration: 1.3, repeat: Infinity, repeatType: "mirror" }}
      />
      
      {/* Scanline / Static */}
      <motion.div
        className="absolute inset-0 bg-white opacity-20"
        animate={{
          backgroundPosition: ["0px 0px", "0px 100px", "0px 200px"],
          opacity: [0, 0.8, 0, 1, 0, 0.5, 0]
        }}
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)", backgroundSize: "100% 4px" }}
        transition={{ duration: 1.8 }}
      />
      
      {/* Center text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center font-mono font-black text-3xl text-white mix-blend-difference"
        animate={{ scale: [1, 1.2, 0.9, 1.5, 0], opacity: [0, 1, 0, 1, 0], skewX: [0, -20, 20, 0] }}
        transition={{ duration: 1.8, times: [0, 0.2, 0.4, 0.6, 1] }}
      >
        SYSTEM OVERRIDE
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────── Shattered Glass ───────────────────────────── */
export function ShatteredGlassIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none overflow-hidden flex items-center justify-center bg-black rounded-lg"
      style={{ perspective: "1000px" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.2, times: [0, 0.85, 1] }}
    >
      {/* Glass shards */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/20 backdrop-blur-md"
          style={{
            width: Math.random() * 100 + 100, height: Math.random() * 100 + 100,
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            border: "1px solid rgba(255,255,255,0.4)",
            transformStyle: "preserve-3d"
          }}
          initial={{ scale: 1, x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0, z: 0 }}
          animate={{
            scale: [1, 1, 0],
            x: (Math.random() - 0.5) * 800,
            y: (Math.random() - 0.5) * 800,
            z: Math.random() * 1000 + 500, // Fly towards camera in Z space
            rotateX: (Math.random() - 0.5) * 720,
            rotateY: (Math.random() - 0.5) * 720,
            rotateZ: (Math.random() - 0.5) * 360,
            opacity: [1, 0]
          }}
          transition={{ duration: 1.8, delay: 0.2, ease: "easeIn" }}
        />
      ))}
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, times: [0, 0.6, 1] }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────── Holy Light ───────────────────────────── */
export function HolyLightIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none overflow-hidden flex items-center justify-center rounded-lg"
      style={{ perspective: "800px" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.8, times: [0, 0.8, 1] }}
    >
      {/* Dark background fading */}
      <motion.div
        className="absolute inset-0 bg-amber-950"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 2 }}
      />
      {/* Giant 3D light beam */}
      <motion.div
        className="absolute w-full bg-gradient-to-b from-yellow-200 to-transparent origin-top"
        style={{ height: "200%", top: "-50%", transformStyle: "preserve-3d" }}
        animate={{
          scaleX: [0, 1.5, 2],
          rotateX: [-30, 0, 30],
          opacity: [0, 1, 0],
          y: [-100, 0, 100],
          z: [-200, 0, 200]
        }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
      {/* Floating holy particles in 3D */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-yellow-100 shadow-[0_0_15px_#fde047]"
          initial={{ x: (Math.random() - 0.5) * 300, y: Math.random() * 400 + 100, z: -200, opacity: 0 }}
          animate={{
            y: -200,
            z: [ -200, Math.random() * 400 + 200, 500 ],
            opacity: [0, 1, 0],
            scale: [0.5, 2, 0.5]
          }}
          transition={{ duration: 2, delay: Math.random() }}
        />
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────── Creeper Blast ───────────────────────────── */
export function CreeperBlastIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/90 rounded-lg overflow-hidden"
      style={{ perspective: "1000px" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.4, times: [0, 0.85, 1] }}
    >
      {/* 3D Creeper Face mapped from creeper.png */}
      <motion.div
        className="relative flex flex-col items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ scale: 0, opacity: 0, z: -500, rotateY: -180, rotateX: 45 }}
        animate={{ 
          scale: [0, 1, 1, 1.2, 3],
          z: [-500, 0, 200, 400, 600],
          rotateY: [-180, 0, 10, -10, 0],
          rotateX: [45, 0, -10, 10, 0],
          opacity: [0, 1, 1, 1, 0],
          filter: ["brightness(1)", "brightness(1)", "brightness(1.5)", "brightness(5)", "brightness(10)"]
        }}
        transition={{ duration: 1.8, times: [0, 0.4, 0.6, 0.8, 1] }}
      >
        {/* The 3D Creeper Head uses the 64x32 creeper.png skin. 
            Face is 8x8. We want face to be 96x96 (12x scale).
            Background size = 768px 384px. */}
        {/* Front */}
        <div className="w-24 h-24 absolute image-rendering-pixelated shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
             style={{ backgroundImage: "url('/textures/creeper.png')", backgroundSize: "768px 384px", backgroundPosition: "-96px -96px", transform: "translateZ(48px)" }}></div>
        {/* Back */}
        <div className="w-24 h-24 absolute image-rendering-pixelated"
             style={{ backgroundImage: "url('/textures/creeper.png')", backgroundSize: "768px 384px", backgroundPosition: "-288px -96px", transform: "rotateY(180deg) translateZ(48px)" }}></div>
        {/* Right */}
        <div className="w-24 h-24 absolute image-rendering-pixelated"
             style={{ backgroundImage: "url('/textures/creeper.png')", backgroundSize: "768px 384px", backgroundPosition: "0px -96px", transform: "rotateY(90deg) translateZ(48px)" }}></div>
        {/* Left */}
        <div className="w-24 h-24 absolute image-rendering-pixelated"
             style={{ backgroundImage: "url('/textures/creeper.png')", backgroundSize: "768px 384px", backgroundPosition: "-192px -96px", transform: "rotateY(-90deg) translateZ(48px)" }}></div>
        {/* Top */}
        <div className="w-24 h-24 absolute image-rendering-pixelated"
             style={{ backgroundImage: "url('/textures/creeper.png')", backgroundSize: "768px 384px", backgroundPosition: "-96px 0px", transform: "rotateX(90deg) translateZ(48px)" }}></div>
        {/* Bottom */}
        <div className="w-24 h-24 absolute image-rendering-pixelated"
             style={{ backgroundImage: "url('/textures/creeper.png')", backgroundSize: "768px 384px", backgroundPosition: "-192px 0px", transform: "rotateX(-90deg) translateZ(48px)" }}></div>
      </motion.div>

      {/* 3D Explosion Particles */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-orange-500 w-4 h-4 image-rendering-pixelated"
          style={{ transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, x: 0, y: 0, z: 0, scale: 0 }}
          animate={{
            opacity: [0, 0, 1, 0],
            x: (Math.random() - 0.5) * 800,
            y: (Math.random() - 0.5) * 800,
            z: (Math.random() - 0.5) * 600 + 200,
            rotateX: Math.random() * 720,
            rotateY: Math.random() * 720,
            scale: [0, 0, Math.random() * 3 + 1, 0],
            backgroundColor: Math.random() > 0.5 ? "#f97316" : "#ef4444"
          }}
          transition={{ duration: 2.4, times: [0, 0.75, 0.8, 1], ease: "easeOut" }}
        />
      ))}
      
      {/* Explosion Flash */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 0] }}
        transition={{ duration: 2.4, times: [0, 0.75, 0.8, 1] }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────── TNT Pop ───────────────────────────── */
export function TntPopIntro() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black/90 rounded-lg overflow-hidden"
      style={{ perspective: "1000px" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.4, times: [0, 0.85, 1] }}
    >
      {/* 3D TNT Cube falling in */}
      <motion.div
        className="relative w-24 h-24 image-rendering-pixelated"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ y: -400, z: -200, rotateX: 45, rotateY: 45, rotateZ: 0 }}
        animate={{ 
          y: [-400, 0, -50, 0, 0], 
          z: [-200, 0, 100, 200, 400],
          rotateX: [45, 360, 400, 450, 450],
          rotateY: [45, 360, 400, 450, 450],
          rotateZ: [0, 180, 360, 360, 360],
          scale: [1, 1, 1, 1.2, 3],
          opacity: [1, 1, 1, 1, 0],
          filter: ["brightness(1)", "brightness(1)", "brightness(2)", "brightness(5)", "brightness(10)"]
        }}
        transition={{ duration: 1.8, times: [0, 0.4, 0.5, 0.7, 1] }}
      >
        {/* Front */}
        <div className="absolute w-24 h-24 bg-cover image-rendering-pixelated shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]" 
             style={{ backgroundImage: "url('/textures/tnt_side.png')", transform: "translateZ(48px)" }}></div>
        {/* Back */}
        <div className="absolute w-24 h-24 bg-cover image-rendering-pixelated shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]" 
             style={{ backgroundImage: "url('/textures/tnt_side.png')", transform: "rotateY(180deg) translateZ(48px)" }}></div>
        {/* Right */}
        <div className="absolute w-24 h-24 bg-cover image-rendering-pixelated shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]" 
             style={{ backgroundImage: "url('/textures/tnt_side.png')", transform: "rotateY(90deg) translateZ(48px)" }}></div>
        {/* Left */}
        <div className="absolute w-24 h-24 bg-cover image-rendering-pixelated shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]" 
             style={{ backgroundImage: "url('/textures/tnt_side.png')", transform: "rotateY(-90deg) translateZ(48px)" }}></div>
        {/* Top */}
        <div className="absolute w-24 h-24 bg-cover image-rendering-pixelated shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]" 
             style={{ backgroundImage: "url('/textures/tnt_top.png')", transform: "rotateX(90deg) translateZ(48px)" }}></div>
        {/* Bottom */}
        <div className="absolute w-24 h-24 bg-cover image-rendering-pixelated shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]" 
             style={{ backgroundImage: "url('/textures/tnt_bottom.png')", transform: "rotateX(-90deg) translateZ(48px)" }}></div>
      </motion.div>

      {/* 3D Explosion Particles */}
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white w-4 h-4 image-rendering-pixelated"
          style={{ transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, x: 0, y: 0, z: 0, scale: 0 }}
          animate={{
            opacity: [0, 0, 1, 0],
            x: (Math.random() - 0.5) * 1000,
            y: (Math.random() - 0.5) * 1000,
            z: (Math.random() - 0.5) * 800 + 300, // explode outwards and towards camera
            rotateX: Math.random() * 720,
            rotateY: Math.random() * 720,
            scale: [0, 0, Math.random() * 4 + 1, 0],
            backgroundColor: Math.random() > 0.6 ? "#ffffff" : (Math.random() > 0.3 ? "#ef4444" : "#f97316")
          }}
          transition={{ duration: 2.4, times: [0, 0.75, 0.8, 1], ease: "easeOut" }}
        />
      ))}
      
      {/* Explosion Flash */}
      <motion.div
        className="absolute inset-0 bg-orange-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 0] }}
        transition={{ duration: 2.4, times: [0, 0.75, 0.8, 1] }}
      />
    </motion.div>
  );
}
