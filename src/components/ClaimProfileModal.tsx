"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Loader2, CheckCircle, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function ClaimProfileModal({ ign, onClose, onClaimed }: { ign: string; onClose: () => void; onClaimed: () => void }) {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let isActive = true;
    
    async function initClaim() {
      // Generate a secure-looking random code
      const generatedCode = "REAR-" + Math.random().toString(36).substring(2, 7).toUpperCase();
      
      try {
        const { error: insertError } = await supabase
          .from("profile_claims")
          .insert([{ code: generatedCode, ign, status: "pending" }]);
          
        if (insertError) throw insertError;
        
        if (isActive) {
          setCode(generatedCode);
        }
      } catch (err: unknown) {
        if (isActive) {
          setError((err as Error).message || "Failed to securely connect to database.");
        }
      }
    }
    
    initClaim();
    
    return () => {
      isActive = false;
    };
  }, [ign]);

  // Polling for status
  useEffect(() => {
    if (!code || verified || error) return;
    
    const checkStatus = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("profile_claims")
          .select("status")
          .eq("code", code)
          .single();
          
        if (!fetchError && data?.status === "verified") {
          setVerified(true);
          if (pollingRef.current) clearInterval(pollingRef.current);
          
          // Save authorization securely to local storage
          const claims = JSON.parse(localStorage.getItem("rearmc_claims") || "{}");
          claims[ign] = true;
          localStorage.setItem("rearmc_claims", JSON.stringify(claims));
          
          // Wait 1.5 seconds to show the green checkmark before firing callback
          setTimeout(() => {
            onClaimed();
          }, 1500);
        }
      } catch (err) {}
    };
    
    // Check every 2.5 seconds
    pollingRef.current = setInterval(checkStatus, 2500);
    
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [code, verified, error, ign, onClaimed]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-16 h-16 rounded-full bg-brand-red/10 flex items-center justify-center mb-4 border border-brand-red/20 shadow-[0_0_30px_rgba(255,45,45,0.2)]">
            <ShieldAlert className="text-brand-red w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-black italic tracking-tight text-white mb-2 uppercase">
            Claim Profile
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            You must verify ownership of <strong className="text-white">{ign}</strong> to customize this profile card.
          </p>

          {error ? (
            <div className="w-full bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          ) : verified ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full bg-green-500/10 border border-green-500/30 rounded-xl p-6 flex flex-col items-center"
            >
              <CheckCircle className="text-green-400 w-12 h-12 mb-3" />
              <p className="text-green-400 font-bold">Successfully Verified!</p>
              <p className="text-xs text-green-400/70 mt-1">Unlocking customization...</p>
            </motion.div>
          ) : (
            <div className="w-full space-y-4">
              <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5 relative group">
                <div className="absolute inset-0 bg-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <p className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">Your Verification Code</p>
                {code ? (
                  <div className="flex items-center justify-center gap-3">
                    <code className="text-3xl font-mono font-black text-white tracking-widest">{code}</code>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[40px]">
                    <Loader2 className="w-6 h-6 text-brand-red animate-spin" />
                  </div>
                )}
              </div>

              <div className="bg-[#1a1a1a] rounded-xl p-4 text-left border border-white/5">
                <p className="text-sm text-gray-300">
                  <span className="text-brand-red font-bold mr-2">1.</span>
                  Join the official RearMC Discord Server.
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="text-brand-red font-bold mr-2">2.</span>
                  Type <code className="bg-black px-1.5 py-0.5 rounded text-white text-xs">/register {code || "..."}</code> in any channel.
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <span className="text-brand-red font-bold mr-2">3.</span>
                  Waiting for verification... <Loader2 className="w-3 h-3 inline animate-spin ml-1 text-gray-500" />
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
