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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group glass p-8 rounded-2xl border border-white/5 hover:border-brand-red/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,45,45,0.1)]"
            >
              <div className="w-14 h-14 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand-red group-hover:text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
