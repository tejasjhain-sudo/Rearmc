"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "What is Tier Testing?",
    answer: "Tier Testing is our official ranking system. You register on the website, join the queue, and play a best-of-3 or best-of-5 match against our specialized tier testing staff. Based on your performance, you are awarded an official tier which is displayed on your profile and in-game."
  },
  {
    question: "How do I register?",
    answer: "You can register by logging into the server with the IP play.rearmc.fun and running the /register command. Then link your Discord account using /discord link to sync your roles and tiers."
  },
  {
    question: "Is RearMC free?",
    answer: "Yes! RearMC is completely free to play. We offer optional store ranks and cosmetics to support the server, but they provide no competitive advantage (No P2W)."
  },
  {
    question: "Which Minecraft versions are supported?",
    answer: "RearMC supports versions 1.16 through 1.20+. However, we highly recommend using 1.16.5 or 1.20.4 depending on the specific mode you are playing for the best PvP experience."
  },
  {
    question: "How do I get ranked?",
    answer: "You can get ranked either through our official Tier Testing system (assessed by staff) or by playing Ranked Matches which affect your Elo. The top Elo players are featured on our Leaderboards."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 overflow-hidden bg-brand-dark border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Frequently Asked <span className="text-brand-red">Questions</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass border border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-lg text-white">{faq.question}</span>
                <ChevronDown
                  className={`text-brand-red transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  size={20}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
