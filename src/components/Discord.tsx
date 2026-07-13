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
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative"
        >
          {/* Background and Blur */}
          <div className="absolute inset-0 bg-[#5865F2]/10 backdrop-blur-md border border-[#5865F2]/20 z-0" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#5865F2]/30 rounded-full blur-[100px] z-0" />
          
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12">
            
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#5865F2]/20 text-[#5865F2] mb-6 shadow-[0_0_20px_rgba(88,101,242,0.3)]">
                <MessageSquare size={32} />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                Join our <span className="text-[#5865F2]">Discord</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto md:mx-0">
                Join thousands of Indian PvP players. Find team members, participate in tournaments, and chat with staff.
              </p>
              <a
                href={discordUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(88,101,242,0.4)] transition-all hover:scale-105"
              >
                Join Server
              </a>
            </div>

            <div className="w-full md:w-[400px] bg-brand-dark/80 rounded-2xl p-6 border border-white/5 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-white/10">
                    <img src="/logo.png" alt="RearMC" className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">RearMC Network</h3>
                    <div className="text-xs text-gray-400">Official Community</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Users size={20} className="text-[#5865F2]" />
                    <span className="font-medium">Online Members</span>
                  </div>
                  <span className="font-mono font-bold text-white">{loading ? "-" : onlineMembers}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mic size={20} className="text-green-400" />
                    <span className="font-medium">Total Members</span>
                  </div>
                  <span className="font-mono font-bold text-white">{loading ? "-" : totalMembers}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Bell size={20} className="text-yellow-400" />
                    <span className="font-medium">Announcements</span>
                  </div>
                  <span className="text-xs bg-brand-red text-white px-2 py-1 rounded font-bold">NEW</span>
                </div>
              </div>
            </div>
            
          </div>
        </motion.div>
      </div>
    </section>
  );
}
