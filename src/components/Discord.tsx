"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, Mic, Bell } from "lucide-react";
import { useState, useEffect } from "react";

export default function Discord() {
  const [discordUrl, setDiscordUrl] = useState("https://discord.gg/p7ENwb6Pz7");
  const [onlineMembers, setOnlineMembers] = useState(1459);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscordData = async () => {
      try {
        let url = "https://discord.gg/p7ENwb6Pz7";
        try {
          const settingsRes = await fetch("/api/settings");
          const settings = await settingsRes.json();
          if (settings.discordUrl) {
            url = settings.discordUrl;
            setDiscordUrl(url);
          }
        } catch (e) {}

        const inviteCode = url.split("/").pop();
        const res = await fetch(`https://discord.com/api/v9/invites/${inviteCode}?with_counts=true`);
        const data = await res.json();
        if (data.approximate_presence_count) {
          setOnlineMembers(data.approximate_presence_count);
          setTotalMembers(data.approximate_member_count);
        }
      } catch (error) {
        console.error("Failed to fetch Discord data");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscordData();
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, type: "spring", stiffness: 300, damping: 25 }}
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative group transition-transform duration-700 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, rgba(88, 101, 242, 0.1) 0%, rgba(10, 10, 10, 0.8) 100%)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(88,101,242,0.2)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.8), inset 0 0 40px rgba(88,101,242,0.05)"
          }}
        >
          {/* Background and Blur */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#5865F2]/40 rounded-full blur-[120px] z-0 pointer-events-none group-hover:bg-[#5865F2]/50 transition-colors duration-700" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#5865F2]/20 rounded-full blur-[100px] z-0 pointer-events-none group-hover:bg-[#5865F2]/30 transition-colors duration-700" />
          
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
            
            <div className="flex-1 text-center md:text-left">
              <div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl text-[#5865F2] mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                style={{ background: "rgba(88, 101, 242, 0.15)", border: "1px solid rgba(88, 101, 242, 0.3)", boxShadow: "0 0 30px rgba(88,101,242,0.3)" }}
              >
                <MessageSquare size={36} className="drop-shadow-[0_0_10px_rgba(88,101,242,0.8)]" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-4 text-white tracking-wide drop-shadow-lg">
                Join our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5865F2] to-[#8ea1e1] drop-shadow-[0_0_15px_rgba(88,101,242,0.5)]">Discord</span>
              </h2>
              <p className="text-gray-300 text-lg mb-10 max-w-md mx-auto md:mx-0 font-medium leading-relaxed group-hover:text-gray-200 transition-colors">
                Join thousands of Indian PvP players. Find team members, participate in tournaments, and chat with staff.
              </p>
              <a
                href={discordUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-10 py-5 rounded-2xl font-black text-lg text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden relative"
                style={{
                  background: "linear-gradient(135deg, #5865F2 0%, #4752C4 100%)",
                  boxShadow: "0 10px 30px -5px rgba(88,101,242,0.6), inset 0 2px 5px rgba(255,255,255,0.3)",
                  border: "1px solid rgba(142, 161, 225, 0.5)"
                }}
              >
                <span className="relative z-10 uppercase tracking-widest drop-shadow-md">Join Server</span>
              </a>
            </div>

            <div 
              className="w-full md:w-[420px] rounded-3xl p-7 transition-transform duration-500 hover:scale-105"
              style={{
                background: "rgba(20,20,20,0.7)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)"
              }}
            >
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#111] rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                    <img src="/logo.png" alt="RearMC" className="w-10 h-10 object-contain drop-shadow-md" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg tracking-wide drop-shadow-md">RearMC Network</h3>
                    <div className="text-[10px] font-bold text-[#5865F2] uppercase tracking-widest mt-1">Official Community</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div 
                  className="flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-[#5865F2]/10 cursor-pointer group/stat"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex items-center gap-4 text-gray-300">
                    <Users size={22} className="text-[#5865F2] group-hover/stat:scale-110 transition-transform" />
                    <span className="font-black tracking-wide text-sm">Online Members</span>
                  </div>
                  <span className="font-mono font-black text-white text-lg drop-shadow-md">{loading ? "-" : onlineMembers}</span>
                </div>
                
                <div 
                  className="flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10 cursor-pointer group/stat"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex items-center gap-4 text-gray-300">
                    <Mic size={22} className="text-emerald-400 group-hover/stat:scale-110 transition-transform" />
                    <span className="font-black tracking-wide text-sm">Total Members</span>
                  </div>
                  <span className="font-mono font-black text-white text-lg drop-shadow-md">{loading ? "-" : totalMembers}</span>
                </div>
                
                <div 
                  className="flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10 cursor-pointer group/stat"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex items-center gap-4 text-gray-300">
                    <Bell size={22} className="text-amber-400 group-hover/stat:scale-110 transition-transform" />
                    <span className="font-black tracking-wide text-sm">Announcements</span>
                  </div>
                  <span className="text-[10px] bg-brand-red text-white px-2 py-1 rounded-md font-black tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.5)]">NEW</span>
                </div>
              </div>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
}
