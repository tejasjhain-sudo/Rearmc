/* eslint-disable */

"use client";

import { useState } from "react";
import { SiteSettings, PlayerData, Category } from "@/lib/kv";
import { updateSettings, updateTiers } from "./data-actions";
import { logout } from "./actions";
import { Save, LogOut, Plus, Trash2, Edit2, Settings, Users, Image as ImageIcon, MessageSquare } from "lucide-react";

const KITS: Category[] = ["sword", "axe", "nethpot", "dpot", "uhc", "smp", "crystal", "mace"];
const TIER_GRADES = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"];

export default function AdminDashboard({ initialSettings, initialTiers }: { initialSettings: SiteSettings, initialTiers: Record<string, PlayerData> }) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [tiers, setTiers] = useState<Record<string, PlayerData>>(initialTiers);
  
  const [activeTab, setActiveTab] = useState<"tiers" | "gallery" | "reviews" | "settings">("tiers");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  // Tier Management state
  const [searchPlayer, setSearchPlayer] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleSaveSettings = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await updateSettings(settings);
      setMessage({ text: "Settings saved successfully", type: "success" });
    } catch (e) {
      setMessage({ text: "Failed to save settings", type: "error" });
    }
    setLoading(false);
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleSaveTiers = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await updateTiers(tiers);
      setMessage({ text: "Tiers saved successfully", type: "success" });
    } catch (e) {
      setMessage({ text: "Failed to save tiers", type: "error" });
    }
    setLoading(false);
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim() || tiers[newPlayerName.trim()]) return;
    setTiers({
      ...tiers,
      [newPlayerName.trim()]: {
        sword: null, axe: null, nethpot: null, dpot: null, uhc: null, smp: null, crystal: null, mace: null
      }
    });
    setNewPlayerName("");
  };

  const handleRemovePlayer = (name: string) => {
    const newTiers = { ...tiers };
    delete newTiers[name];
    setTiers(newTiers);
  };

  const handleUpdatePlayerTier = (name: string, kit: Category, grade: string | null) => {
    setTiers({
      ...tiers,
      [name]: {
        ...tiers[name],
        [kit]: grade
      }
    });
  };

  const filteredPlayers = Object.keys(tiers).filter(name => name.toLowerCase().includes(searchPlayer.toLowerCase()));

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-red">RearMC</span> Admin
          </h1>
        </div>
        
        <div className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab("tiers")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "tiers" ? "bg-brand-red/10 text-brand-red" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <Users size={18} /> Player Tiers
          </button>
          <button onClick={() => setActiveTab("gallery")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "gallery" ? "bg-brand-red/10 text-brand-red" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <ImageIcon size={18} /> Server Gallery
          </button>
          <button onClick={() => setActiveTab("reviews")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "reviews" ? "bg-brand-red/10 text-brand-red" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <MessageSquare size={18} /> Reviews
          </button>
          <button onClick={() => setActiveTab("settings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "settings" ? "bg-brand-red/10 text-brand-red" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <Settings size={18} /> Global Settings
          </button>
        </div>

        <div className="p-4 mt-auto">
          <button onClick={() => logout()} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0d0d0d]">
          <h2 className="text-2xl font-bold text-white capitalize">{activeTab} Manager</h2>
          
          <div className="flex items-center gap-4">
            {message.text && (
              <span className={`text-sm font-medium ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
                {message.text}
              </span>
            )}
            {activeTab !== "tiers" && (
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="flex items-center gap-2 bg-brand-red hover:bg-brand-red/90 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-lg"
              >
                <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#111]">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* TIERS TAB */}
            {activeTab === "tiers" && (
              <>
                <div className="glass p-6 rounded-2xl border border-white/5 bg-brand-red/10">
                  <h3 className="text-lg font-bold text-white mb-2">Read-Only Mode</h3>
                  <p className="text-gray-300">
                    Tiers are now directly synced from the Minecraft server plugin backend. Editing players and tiers from the website is disabled.
                  </p>
                </div>

                <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                  <div className="p-6 border-b border-white/5 bg-[#161616]">
                    <input
                      type="text"
                      placeholder="Search players..."
                      value={searchPlayer}
                      onChange={(e) => setSearchPlayer(e.target.value)}
                      className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-red/50 text-sm"
                    />
                  </div>
                  <div className="divide-y divide-white/5">
                    {filteredPlayers.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">No players found.</div>
                    ) : (
                      filteredPlayers.map(player => (
                        <div key={player} className="p-6 hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={`https://minotar.net/helm/${player}/32.png`} alt="" className="w-8 h-8 rounded-md" />
                              <span className="text-lg font-bold text-white">{player}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                            {KITS.map(kit => (
                              <div key={kit} className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider pl-1">{kit}</label>
                                <div className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white">
                                  {tiers[player][kit] || "None"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {/* GALLERY TAB */}
            {activeTab === "gallery" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Configure the images shown in the Server Gallery.</p>
                  <button
                    onClick={() => setSettings({ ...settings, gallery: [...settings.gallery, { id: Date.now().toString(), src: "", title: "" }] })}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Image
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {settings.gallery.map((img, i) => (
                    <div key={img.id} className="glass p-5 rounded-2xl border border-white/5 space-y-4 relative group">
                      <button
                        onClick={() => setSettings({ ...settings, gallery: settings.gallery.filter(g => g.id !== img.id) })}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      
                      <div className="aspect-video bg-black/50 rounded-xl overflow-hidden border border-white/5 relative">
                        {img.src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img.src} alt="" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23222"/%3E%3C/svg%3E'} />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-600">No Image URL</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Image URL</label>
                        <input
                          type="text"
                          value={img.src}
                          onChange={(e) => {
                            const newGallery = [...settings.gallery];
                            newGallery[i].src = e.target.value;
                            setSettings({ ...settings, gallery: newGallery });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                          placeholder="/banner.jpg or https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Title</label>
                        <input
                          type="text"
                          value={img.title}
                          onChange={(e) => {
                            const newGallery = [...settings.gallery];
                            newGallery[i].title = e.target.value;
                            setSettings({ ...settings, gallery: newGallery });
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                          placeholder="PvP Arena"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Manage YouTube video reviews from Content Creators.</p>
                  <button
                    onClick={() => setSettings({ ...settings, reviews: [...settings.reviews, { id: Date.now().toString(), url: "", reviewer: "", title: "" }] })}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Review
                  </button>
                </div>

                <div className="space-y-4">
                  {settings.reviews.map((review, i) => (
                    <div key={review.id} className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-1 space-y-4 w-full">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">YouTube URL</label>
                          <input
                            type="text"
                            value={review.url}
                            onChange={(e) => {
                              const newReviews = [...settings.reviews];
                              newReviews[i].url = e.target.value;
                              setSettings({ ...settings, reviews: newReviews });
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                            placeholder="https://youtu.be/..."
                          />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Reviewer Name</label>
                            <input
                              type="text"
                              value={review.reviewer}
                              onChange={(e) => {
                                const newReviews = [...settings.reviews];
                                newReviews[i].reviewer = e.target.value;
                                setSettings({ ...settings, reviews: newReviews });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                              placeholder="e.g. Rajesh"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Review Title</label>
                            <input
                              type="text"
                              value={review.title}
                              onChange={(e) => {
                                const newReviews = [...settings.reviews];
                                newReviews[i].title = e.target.value;
                                setSettings({ ...settings, reviews: newReviews });
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                              placeholder="RearMC Server Review"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setSettings({ ...settings, reviews: settings.reviews.filter(r => r.id !== review.id) })}
                        className="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors mt-6"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="glass p-8 rounded-2xl border border-white/5 max-w-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Settings size={20} className="text-brand-red" /> Global Site Settings
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Discord Server URL</label>
                    <input
                      type="text"
                      value={settings.discordUrl}
                      onChange={(e) => setSettings({ ...settings, discordUrl: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red/50"
                      placeholder="https://discord.gg/..."
                    />
                    <p className="text-xs text-gray-500 mt-2">This links the "Join Discord" buttons across the entire website.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Fixed Floating Bottom Save Bar for easy access anywhere */}
        {activeTab !== "tiers" && (
          <div className="fixed bottom-6 right-8 z-50 flex items-center gap-4 bg-[#141414]/95 backdrop-blur-md p-3 px-6 rounded-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            {message.text && (
              <span className={`text-sm font-medium ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
                {message.text}
              </span>
            )}
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="flex items-center gap-2 bg-brand-red hover:bg-brand-red/90 text-white px-6 py-2.5 rounded-xl font-bold transition-all hover:scale-105 shadow-xl disabled:opacity-50"
            >
              <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
