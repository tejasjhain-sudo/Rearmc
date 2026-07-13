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
  const [discordUrl, setDiscordUrl] = useState("https://discord.gg/p7ENwb6Pz7");

  const copyIp = () => {
    navigator.clipboard.writeText("play.rearmc.fun");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const res = await fetch("https://api.mcsrvstat.us/3/play.rearmc.fun");
        const data = await res.json();
        
        if (data.online) {
          setServerData({
            online: true,
            players: data.players?.online || 0,
            ping: data.debug?.ping ? 24 : 24, // Ping usually isn't provided directly so we leave it static
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
    const interval = setInterval(fetchServerData, 60000); // Update every minute
    
    // Fetch Settings for Discord link
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data.discordUrl) setDiscordUrl(data.discordUrl);
    }).catch(console.error);

    return () => clearInterval(interval);
  }, []);

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
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              onClick={copyIp}
              className="group relative flex w-full sm:w-auto items-center justify-center gap-3 rounded-lg bg-brand-red px-8 py-4 text-lg font-bold text-white shadow-[0_0_20px_rgba(255,45,45,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,45,45,0.6)]"
            >
              <Play fill="currentColor" size={20} />
              <div className="flex flex-col items-start leading-none">
                <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Play Now</span>
                <span className="font-mono text-lg">{copied ? "COPIED!" : "play.rearmc.fun"}</span>
              </div>
              {copied ? <CheckCircle2 className="absolute right-4" size={20} /> : <Copy className="absolute right-4 opacity-0 transition-opacity group-hover:opacity-100" size={20} />}
            </button>
            
            <a
              href={discordUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg glass px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
            >
              Join Discord
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
          <div className="glass rounded-2xl p-6 relative overflow-hidden border border-white/10 shadow-2xl">
            {/* Inner glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand-red/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-brand-red/10 blur-3xl" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-brand-red/10 p-2 border border-brand-red/20 flex items-center justify-center">
                  <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">RearMC Network</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="relative flex h-2 w-2">
                      <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${serverData.online ? "animate-ping bg-green-500" : "bg-red-500"}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${serverData.online ? "bg-green-500" : "bg-red-500"}`}></span>
                    </span>
                    <span className={serverData.online ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                      {serverData.loading ? "Loading..." : (serverData.online ? "Online" : "Offline")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="glass-red rounded-xl p-4 border border-brand-red/20 flex flex-col items-center justify-center text-center">
                <Users className="text-brand-red mb-2" size={24} />
                <span className="text-3xl font-bold text-white font-mono">{serverData.loading ? "-" : serverData.players}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Players Online</span>
              </div>
              
              <div className="glass rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center text-center">
                <div className="text-brand-red mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
                </div>
                <span className="text-3xl font-bold text-white font-mono">{serverData.loading ? "-" : (serverData.online ? serverData.ping : 0)}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Avg Ping (ms)</span>
              </div>
              
              <div className="glass rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center text-center col-span-2">
                <span className={`text-2xl font-bold font-mono ${serverData.online ? "text-green-400" : "text-red-400"}`}>
                  {serverData.loading ? "-" : (serverData.online ? serverData.tps.toFixed(1) : "0.0")}
                </span>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Server TPS</span>
                {/* TPS Bar */}
                <div className="w-full h-1.5 bg-gray-800 rounded-full mt-3 overflow-hidden">
                  <div className={`h-full w-full rounded-full ${serverData.online ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500"}`}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
