/* eslint-disable */

"use client";

import { motion } from "framer-motion";
import { Copy, CheckCircle2, Play, Users } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [serverData, setServerData] = useState({
    online: false,
    players: 0,
    ping: 0,
    tps: 0,
    loading: true
  });
  const [serverIp, setServerIp] = useState("play.rearmc.in");
  const [discordUrl, setDiscordUrl] = useState("https://discord.gg/p7ENwb6Pz7");

  const copyIp = () => {
    navigator.clipboard.writeText(serverIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Fetch Settings
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data.discordUrl) setDiscordUrl(data.discordUrl);
      if (data.serverIp) setServerIp(data.serverIp);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${serverIp}`);
        const data = await res.json();
        
        if (data.online) {
          setServerData({
            online: true,
            players: data.players?.online || 0,
            ping: 24,
            tps: 20.0, 
            loading: false
          });
        } else {
          setServerData({
            online: false,
            players: 0,
            ping: 0,
            tps: 0.0,
            loading: false
          });
        }
      } catch (error) {
        setServerData({
          online: false,
          players: 0,
          ping: 0,
          tps: 0.0,
          loading: false
        });
      }
    };

    fetchServerData();
    const interval = setInterval(fetchServerData, 60000);
    return () => clearInterval(interval);
  }, [serverIp]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Banner with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/banner.jpg"
          alt="RearMC Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/60 to-brand-dark" />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,45,45,0.15)_0,rgba(0,0,0,0)_50%)] animate-pulse-slow" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-4 py-1.5 text-sm font-medium text-brand-red mb-6 shadow-[0_0_15px_rgba(255,45,45,0.2)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
            </span>
            Season 5 is LIVE
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg">
            India's Smoothest <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-red-500">
              PvP Practice
            </span> Server
          </h1>
          
          <p className="text-base sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
            Compete against the best Indian players with ultra-low latency, ranked matchmaking, professional tier testing, and the smoothest knockback experience.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
            <button
              onClick={copyIp}
              className="group relative flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-black text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(185, 28, 28, 0.95) 100%)",
                boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.8), inset 0 2px 5px rgba(255,255,255,0.3)",
                border: "1px solid rgba(255,100,100,0.5)"
              }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <Play fill="currentColor" size={20} className="drop-shadow-md" />
              <div className="flex flex-col items-start leading-none drop-shadow-md">
                <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">Play Now</span>
                <span className="font-mono text-lg tracking-tight">{copied ? "COPIED!" : serverIp}</span>
              </div>
              {copied ? <CheckCircle2 className="absolute right-5 drop-shadow-md" size={20} /> : <Copy className="absolute right-5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:right-4 drop-shadow-md" size={20} />}
            </button>
            
            <a
              href={discordUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
              }}
            >
              <span className="group-hover:text-brand-red transition-colors text-sm uppercase tracking-widest">Join Discord</span>
            </a>
          </div>
        </motion.div>

        {/* Right Content - Server Status Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="flex-1 w-full max-w-md animate-float"
        >
          <div 
            className="rounded-3xl p-7 relative overflow-hidden transition-all duration-500 hover:scale-105 group cursor-pointer"
            style={{
              background: "linear-gradient(135deg, rgba(20,20,20,0.6) 0%, rgba(5,5,5,0.8) 100%)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)"
            }}
          >
            {/* Inner neon glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 rounded-full bg-brand-red/30 blur-[60px] group-hover:bg-brand-red/40 transition-colors duration-500 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-brand-red/20 blur-[50px] group-hover:bg-brand-red/30 transition-colors duration-500 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div 
                  className="h-14 w-14 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-500"
                  style={{
                    background: "rgba(255,45,45,0.1)",
                    border: "1px solid rgba(255,45,45,0.3)",
                    boxShadow: "0 0 20px rgba(255,45,45,0.2)"
                  }}
                >
                  <Image src="/logo.png" alt="Logo" width={38} height={38} className="object-contain drop-shadow-[0_0_10px_rgba(255,45,45,0.5)]" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-white tracking-wide drop-shadow-md">RearMC Network</h3>
                  <div className="flex items-center gap-2 text-sm mt-0.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${serverData.online ? "animate-ping bg-green-500" : "bg-red-500"}`}></span>
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${serverData.online ? "bg-green-500" : "bg-red-500"} shadow-[0_0_8px_currentColor]`}></span>
                    </span>
                    <span className={`font-bold uppercase tracking-widest text-[10px] ${serverData.online ? "text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" : "text-red-400"}`}>
                      {serverData.loading ? "LOADING..." : (serverData.online ? "ONLINE" : "OFFLINE")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div 
                className="rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:bg-brand-red/10 group/stat"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <Users className="text-brand-red mb-2 group-hover/stat:scale-110 transition-transform" size={24} />
                <span className="text-3xl font-black text-white font-mono drop-shadow-md leading-none mb-1">{serverData.loading ? "-" : serverData.players}</span>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Players Online</span>
              </div>
              
              <div 
                className="rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:bg-white/5 group/stat"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="text-brand-red mb-2 group-hover/stat:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
                </div>
                <span className="text-3xl font-black text-white font-mono drop-shadow-md leading-none mb-1">{serverData.loading ? "-" : (serverData.online ? serverData.ping : 0)}</span>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Avg Ping (ms)</span>
              </div>
              
              <div 
                className="rounded-2xl p-5 flex flex-col items-center justify-center text-center col-span-2 transition-all duration-300 hover:scale-105 hover:bg-white/5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span className={`text-2xl font-black font-mono leading-none mb-1 ${serverData.online ? "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "text-red-400"}`}>
                  {serverData.loading ? "-" : (serverData.online ? serverData.tps.toFixed(1) : "0.0")}
                </span>
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Server TPS</span>
                {/* Thin HUD TPS Bar */}
                <div className="w-full h-1 bg-white/5 rounded-full mt-3 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${serverData.online ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" : "bg-red-500"}`} style={{ width: serverData.online ? '100%' : '0%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
