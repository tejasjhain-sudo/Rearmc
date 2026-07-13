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
    <section className="relative py-20 bg-brand-red/5 border-y border-brand-red/10 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=')]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center max-w-4xl mx-auto">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 font-mono mb-1 md:mb-2 drop-shadow-md">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <div className="text-xs sm:text-sm md:text-base text-brand-red font-bold uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
