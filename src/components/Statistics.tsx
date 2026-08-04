"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedCounter({ value, prefix = "", suffix = "", decimals = 0 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => 
    prefix + (latest.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + suffix
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}

export default function Statistics() {
  const [totalPlayers, setTotalPlayers] = useState(0);

  useEffect(() => {
    fetch("/api/tiers")
      .then(res => res.json())
      .then(data => {
        setTotalPlayers(Object.keys(data).length);
      })
      .catch(() => setTotalPlayers(0));
  }, []);

  const STATS = [
    { value: totalPlayers, label: "Ranked Players", suffix: "", decimals: 0 },
    { value: 99.9, label: "Server Uptime", suffix: "%", decimals: 1 },
    { value: 24, label: "Average Ping", prefix: "<", suffix: "ms", decimals: 0 },
  ];

  return (
    <section className="relative py-20 overflow-hidden" style={{ background: "rgba(10,10,10,0.8)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      {/* Background radial glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[800px] h-[300px] bg-brand-red/20 blur-[120px] rounded-[100%]" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-5xl mx-auto">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
              className="p-8 rounded-3xl transition-transform duration-500 hover:scale-110 cursor-default"
              style={{
                background: "linear-gradient(135deg, rgba(20,20,20,0.4) 0%, rgba(5,5,5,0.6) 100%)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
              }}
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 font-mono mb-2 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] tracking-tight">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <div className="text-[11px] text-brand-red font-black uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
