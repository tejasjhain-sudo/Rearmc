"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const COMPARISON = [
  { feature: "Server Location", rearmc: "Mumbai, India", others: "Europe / NA" },
  { feature: "Average Ping", rearmc: "< 30ms", others: "150ms - 250ms" },
  { feature: "Knockback", rearmc: "Smooth & Consistent", others: "Laggy & Delayed" },
  { feature: "Matchmaking", rearmc: "Ranked & Fair", others: "Random" },
  { feature: "Tier Testing", rearmc: "Professional Staff", others: "None" },
  { feature: "Website & Stats", rearmc: "Live Profiles", others: "Basic or None" },
];

export default function Comparison() {
  return (
    <section className="relative py-24 overflow-hidden bg-brand-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Why <span className="text-brand-red">RearMC?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            See how we compare against standard international practice servers.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass rounded-3xl overflow-hidden border border-white/10"
        >
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-3 bg-white/5 p-4 sm:p-6 border-b border-white/10">
                <div className="font-bold text-gray-400">Features</div>
                <div className="font-bold text-brand-red text-center text-lg">RearMC</div>
                <div className="font-bold text-gray-500 text-center">Others</div>
              </div>
              
              <div className="divide-y divide-white/5">
                {COMPARISON.map((row, index) => (
                  <div key={index} className="grid grid-cols-3 p-4 sm:p-6 items-center hover:bg-white/5 transition-colors">
                    <div className="font-medium text-white">{row.feature}</div>
                    <div className="flex flex-col items-center justify-center text-center">
                      <Check className="text-brand-red mb-2" size={24} />
                      <span className="text-xs sm:text-sm font-medium text-gray-300">{row.rearmc}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center opacity-50">
                      <X className="text-gray-500 mb-2" size={24} />
                      <span className="text-xs sm:text-sm text-gray-500">{row.others}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
