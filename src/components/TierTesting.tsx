"use client";

import { motion } from "framer-motion";
import { UserPlus, Clock, Swords, Award } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const STEPS = [
  {
    icon: <UserPlus size={24} />,
    title: "Register",
    description: "Create an account on the website and link your Discord and Minecraft profile.",
  },
  {
    icon: <Clock size={24} />,
    title: "Join Queue",
    description: "Enter the tier testing queue and wait for the next available staff member.",
  },
  {
    icon: <Swords size={24} />,
    title: "Fight Staff",
    description: "Play a Bo3 or Bo5 against our highly skilled tier testing staff in your chosen mode.",
  },
  {
    icon: <Award size={24} />,
    title: "Receive Tier",
    description: "Get evaluated and receive your official RearMC tier displayed on your profile.",
  },
];

export default function TierTesting() {
  const [waitingPlayers, setWaitingPlayers] = useState(12);

  // Simulate queue fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitingPlayers((prev) => {
        const change = Math.floor(Math.random() * 3) - 1; // -1 to +1
        return Math.max(3, prev + change);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="tier-testing" className="relative py-24 overflow-hidden bg-brand-dark">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="flex-1 w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white flex items-center gap-4 flex-wrap">
                <span>Professional <span className="text-brand-red">Tier Testing</span></span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Prove your skills in our official tier testing system. Get tested by the best and earn your rank across various supported modes including Sword, Axe, Pot, Crystal, and SMP.
              </p>
              
              <Link href="/tierlist" className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red/90 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-[0_0_20px_rgba(255,45,45,0.4)]">
                View Tier List Rankings
              </Link>
            </motion.div>
          </div>

          <div className="flex-1 w-full lg:w-1/2">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-8 md:left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-brand-red/50 via-brand-red/20 to-transparent" />
              
              <div className="space-y-8">
                {STEPS.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="relative flex items-start pl-12 md:pl-20"
                  >
                    <div className="absolute left-0 top-0 w-12 h-12 md:w-16 md:h-16 rounded-full glass border border-brand-red/30 flex items-center justify-center text-brand-red z-10 bg-brand-dark shadow-[0_0_15px_rgba(255,45,45,0.2)]">
                      {step.icon}
                    </div>
                    <div className="glass p-5 md:p-6 rounded-2xl border border-white/5 w-full">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 flex items-center justify-between flex-wrap gap-2">
                        {step.title}
                        {index === STEPS.length - 1 && (
                          <span className="text-[10px] md:text-xs font-bold bg-white/10 text-gray-300 px-2 py-1 rounded uppercase tracking-wider">Beta</span>
                        )}
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
