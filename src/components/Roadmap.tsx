"use client";

import { motion } from "framer-motion";

const ROADMAP_ITEMS = [
  {
    date: "1 Year Ago",
    title: "The Beginning",
    description: "RearMC was created with the vision of providing the best competitive PvP experience for Indian players.",
    status: "completed",
  },
  {
    date: "After 5 Months",
    title: "The Prime Era",
    description: "We hit our peak. In just 3 days, over 160+ players joined the server, creating a massive and active community.",
    status: "completed",
  },
  {
    date: "The Fall",
    title: "High Downtime",
    description: "Unfortunately, due to technical issues and high downtime, we lost our player base. It was a tough time for the server.",
    status: "completed",
  },
  {
    date: "Present",
    title: "The Comeback",
    description: "We are back and stronger than ever! Rebuilt from the ground up with ultra-low latency, custom knockback, and a professional tier testing system.",
    status: "active",
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our <span className="text-brand-red">Journey</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            The story of RearMC from its creation to our ultimate comeback.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-brand-red/20 -translate-x-1/2" />

          <div className="space-y-12">
            {ROADMAP_ITEMS.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center md:justify-between flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rounded-full bg-brand-dark border-2 border-brand-red -translate-x-1/2 z-10 shadow-[0_0_10px_rgba(255,45,45,0.8)]" />

                <div className={`ml-12 md:ml-0 w-full md:w-[45%] ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                  <div className={`glass p-6 rounded-2xl border ${item.status === "active" ? "border-brand-red/50 shadow-[0_0_20px_rgba(255,45,45,0.15)]" : "border-white/5"}`}>
                    <span className="text-brand-red font-bold text-sm uppercase tracking-wider mb-2 block">
                      {item.date}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
