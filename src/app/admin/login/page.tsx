"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../actions";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(password);
      if (res.success) {
        router.push("/admin");
      } else {
        setError(res.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-red/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="glass w-full max-w-md p-8 rounded-2xl border border-white/10 relative z-10 shadow-2xl">
        <div className="w-16 h-16 bg-brand-red/10 border border-brand-red/30 rounded-2xl flex items-center justify-center text-brand-red mx-auto mb-6">
          <Lock size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h1>
        <p className="text-gray-400 text-center text-sm mb-8">
          Enter the administrator password to manage the website configuration.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-red/50 transition-colors"
              autoFocus
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
