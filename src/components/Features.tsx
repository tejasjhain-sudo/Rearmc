"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Trophy, Activity, Target, Users } from "lucide-react";

const FEATURES = [
  {
    icon: <Zap size={32} />,
    title: "Ultra Low Ping",
    description: "Optimized routing for Indian players ensuring extremely responsive gameplay under 30ms.",
  },
  {
    icon: <Target size={32} />,
    title: "Smooth Knockback",
    description: "Custom knockback system designed specifically for competitive PvP and combos.",
  },
  {
    icon: <Trophy size={32} />,
    title: "Ranked Queues",
    description: "Fight equally skilled players and climb the seasonal leaderboard to prove your worth.",
  },
  {
    icon: <Shield size={32} />,
    title: "Tier Testing",
    description: "Professional tier testing system. Get tested by staff and receive your official rank.",
  },
  {
    icon: <Activity size={32} />,
    title: "Live Statistics",
    description: "View player profiles, win rates, streaks, and peak Elo directly on the website.",
  },
  {
    icon: <Users size={32} />,
    title: "Active Community",
    description: "Join thousands of players in our Discord and participate in weekly tournaments.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 overflow-hidden bg-brand-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Premium <span className="text-brand-red">Features</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Experience Minecraft PvP like never before. Built from the ground up for the Indian competitive scene.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
              className="group p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 relative overflow-hidden cursor-pointer"
              style={{
                background: "linear-gradient(135deg, rgba(20,20,20,0.6) 0%, rgba(10,10,10,0.8) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}
            >
              {/* Subtle hover glow behind the card */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "inset 0 0 30px rgba(239, 68, 68, 0.1)" }} />
              
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-brand-red mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-brand-red group-hover:text-white group-hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}
              >
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black tracking-wide text-white mb-3 group-hover:text-brand-red transition-colors duration-300 drop-shadow-sm">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
