/* eslint-disable */
"use client";

import { useState } from "react";
import { SiteSettings, PlayerData, Category, ProfileCustomization } from "@/lib/kv";
import { updateSettings, updateTiers, updatePlayerCustomizationPermissions, deleteSinglePlayerTiers } from "./data-actions";
import { logout } from "./actions";
import { Save, LogOut, Plus, Trash2, Edit2, Settings, Users, Shield, Sparkles, Image as ImageIcon, MessageSquare, Check, X, Search, Lock, Unlock } from "lucide-react";

const KITS: Category[] = ["sword", "axe", "nethpot", "dpot", "uhc", "smp", "crystal", "mace"];
const TIER_GRADES = ["HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5"];

const ALL_INTRO_ANIMATIONS = [
  { id: "supernova", label: "💫 Supernova Burst" },
  { id: "portal", label: "🌀 Dimensional Portal" },
  { id: "cyber_matrix", label: "🌐 Cyber Matrix Scan" },
  { id: "eclipse", label: "🌑 Celestial Eclipse" },
  { id: "ender_dragon", label: "🐉 Ender Dragon Void" },
  { id: "steve_slash", label: "⚔️ Steve Diamond Slash" },
  { id: "diamond_armor", label: "💎 Diamond Armor Level-Up" },
  { id: "herobrine_horror", label: "👁️ Herobrine Curse" },
  { id: "entity303_glitch", label: "☠️ Entity 303 Nightmare" },
  { id: "enderman", label: "👁️ Enderman Teleport Jumpscare" },
  { id: "warden", label: "🔊 Warden Sculk Sonic Roar" },
  { id: "wither", label: "☠️ Wither Boss Spawn" },
  { id: "zombie", label: "🧟 Zombie Mob Ambush" },
  { id: "skeleton", label: "🏹 Skeleton Archer Strike" },
];

const ALL_CARD_THEMES = [
  { id: "minecraft_chest", label: "Minecraft Chest" },
  { id: "dark_dragon", label: "Dark Dragon" },
  { id: "neon_cyber", label: "Neon Cyberpunk" },
  { id: "golden_king", label: "Golden King" },
  { id: "holographic_prism", label: "🌈 Holographic Foil Prism" },
  { id: "glitch_matrix", label: "👾 Glitch Matrix RGB Shifter" },
  { id: "herobrine_void", label: "👁️ Herobrine Blood Void" },
  { id: "sculk_warden", label: "🔊 Sculk Warden Deep Darkness" },
  { id: "enderman_teleport", label: "👁️ Enderman Void Pulse" },
  { id: "wither_boss", label: "☠️ Wither Boss Nether Flame" },
  { id: "steve_diamond", label: "💎 Steve Diamond Armor" },
  { id: "supernova_galaxy", label: "💫 Supernova Cosmic Galaxy" },
];

export default function AdminDashboard({
  initialSettings,
  initialTiers,
  initialProfiles,
}: {
  initialSettings: SiteSettings;
  initialTiers: Record<string, PlayerData>;
  initialProfiles: Record<string, ProfileCustomization>;
}) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [tiers, setTiers] = useState<Record<string, PlayerData>>(initialTiers);
  const [profiles, setProfiles] = useState<Record<string, ProfileCustomization>>(initialProfiles);

  const [activeTab, setActiveTab] = useState<"tiers" | "permissions" | "gallery" | "reviews" | "settings">("tiers");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Player Search & Manage State
  const [searchPlayer, setSearchPlayer] = useState("");
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Bulk Selection State for Permissions
  const [selectedPlayersList, setSelectedPlayersList] = useState<string[]>([]);

  // Permissions Modal state for selected player(s)
  const [editingPermissionsUser, setEditingPermissionsUser] = useState<string | null>(null);
  const [permAllowedIntros, setPermAllowedIntros] = useState<string[]>([]);
  const [permAllowedThemes, setPermAllowedThemes] = useState<string[]>([]);
  const [permCanMusic, setPermCanMusic] = useState<boolean>(true);

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

  const handleSaveAllTiers = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await updateTiers(tiers);
      setMessage({ text: "All Tiers saved successfully", type: "success" });
    } catch (e) {
      setMessage({ text: "Failed to save tiers", type: "error" });
    }
    setLoading(false);
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    const name = newPlayerName.trim();
    if (!tiers[name]) {
      setTiers({
        ...tiers,
        [name]: {
          sword: null, axe: null, nethpot: null, dpot: null, uhc: null, smp: null, crystal: null, mace: null
        }
      });
    }
    setNewPlayerName("");
  };

  const handleRemovePlayer = async (name: string) => {
    if (!confirm(`Are you sure you want to remove player ${name}?`)) return;
    const newTiers = { ...tiers };
    delete newTiers[name];
    setTiers(newTiers);
    await deleteSinglePlayerTiers(name);
  };

  const handleUpdatePlayerTier = (name: string, kit: Category, grade: string | null) => {
    setTiers({
      ...tiers,
      [name]: {
        ...tiers[name],
        [kit]: grade === "NONE" ? null : grade
      }
    });
  };

  // Open Permission Editor Modal for single player
  const handleOpenPermissionsModal = (username: string) => {
    setEditingPermissionsUser(username);
    const existingPerms = profiles[username]?.permissions;
    setPermAllowedIntros(existingPerms?.allowedIntroEffects || ALL_INTRO_ANIMATIONS.map(i => i.id));
    setPermAllowedThemes(existingPerms?.allowedCardThemes || ALL_CARD_THEMES.map(t => t.id));
    setPermCanMusic(existingPerms?.canUseCustomMusic !== false);
  };

  const handleSavePermissions = async () => {
    if (!editingPermissionsUser) return;
    setLoading(true);
    try {
      const updatedPerms = {
        allowedIntroEffects: permAllowedIntros,
        allowedCardThemes: permAllowedThemes,
        canUseCustomMusic: permCanMusic,
      };
      const res = await updatePlayerCustomizationPermissions(editingPermissionsUser, updatedPerms);
      if (res.success) {
        setProfiles({
          ...profiles,
          [editingPermissionsUser]: res.profile,
        });
        setMessage({ text: `Updated permissions for ${editingPermissionsUser}`, type: "success" });
        setEditingPermissionsUser(null);
      }
    } catch (e) {
      setMessage({ text: "Failed to update permissions", type: "error" });
    }
    setLoading(false);
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  // Bulk Grant Permissions
  const handleBulkGrantPermissions = async (allowAll: boolean) => {
    if (selectedPlayersList.length === 0) return;
    setLoading(true);
    try {
      for (const username of selectedPlayersList) {
        const updatedPerms = {
          allowedIntroEffects: allowAll ? ALL_INTRO_ANIMATIONS.map(i => i.id) : [],
          allowedCardThemes: allowAll ? ALL_CARD_THEMES.map(t => t.id) : [],
          canUseCustomMusic: allowAll,
        };
        const res = await updatePlayerCustomizationPermissions(username, updatedPerms);
        if (res.success) {
          profiles[username] = res.profile;
        }
      }
      setProfiles({ ...profiles });
      setMessage({ text: `Updated permissions for ${selectedPlayersList.length} players`, type: "success" });
      setSelectedPlayersList([]);
    } catch (e) {
      setMessage({ text: "Failed bulk update", type: "error" });
    }
    setLoading(false);
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const filteredPlayers = Object.keys(tiers).filter(name => name.toLowerCase().includes(searchPlayer.toLowerCase()));

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-red">RearMC</span> Admin Console
          </h1>
        </div>
        
        <div className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab("tiers")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "tiers" ? "bg-brand-red/10 text-brand-red font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <Users size={18} /> Tier List Manager
          </button>
          <button onClick={() => setActiveTab("permissions")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "permissions" ? "bg-brand-red/10 text-brand-red font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <Shield size={18} /> Customization Perms
          </button>
          <button onClick={() => setActiveTab("gallery")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "gallery" ? "bg-brand-red/10 text-brand-red font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <ImageIcon size={18} /> Server Gallery
          </button>
          <button onClick={() => setActiveTab("reviews")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "reviews" ? "bg-brand-red/10 text-brand-red font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
            <MessageSquare size={18} /> Reviews
          </button>
          <button onClick={() => setActiveTab("settings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "settings" ? "bg-brand-red/10 text-brand-red font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
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
          <h2 className="text-2xl font-bold text-white capitalize">{activeTab} Dashboard</h2>
          
          <div className="flex items-center gap-4">
            {message.text && (
              <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                {message.text}
              </span>
            )}
            
            {activeTab === "tiers" && (
              <button
                onClick={handleSaveAllTiers}
                disabled={loading}
                className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg"
              >
                <Save size={18} /> {loading ? "Saving Tiers..." : "Save All Tiers"}
              </button>
            )}

            {activeTab !== "tiers" && (
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="flex items-center gap-2 bg-brand-red hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg"
              >
                <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#111]">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* TIERS MANAGER TAB */}
            {activeTab === "tiers" && (
              <div className="space-y-6">
                {/* Add Player Control */}
                <div className="glass p-6 rounded-2xl border border-white/10 bg-[#161616] flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <input
                      type="text"
                      placeholder="New Player Minecraft Username..."
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-red text-sm w-full md:w-72"
                    />
                    <button
                      onClick={handleAddPlayer}
                      className="bg-brand-red hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shrink-0"
                    >
                      <Plus size={18} /> Add Player
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="🔍 Search existing players..."
                    value={searchPlayer}
                    onChange={(e) => setSearchPlayer(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-red text-sm w-full md:w-80"
                  />
                </div>

                {/* Player List */}
                <div className="glass rounded-2xl border border-white/10 overflow-hidden bg-[#161616]">
                  <div className="divide-y divide-white/5">
                    {filteredPlayers.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">No players found.</div>
                    ) : (
                      filteredPlayers.map(player => (
                        <div key={player} className="p-6 hover:bg-white/[0.02] transition-colors space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={`https://minotar.net/helm/${player}/36.png`} alt="" className="w-9 h-9 rounded-lg shadow-sm" />
                              <span className="text-xl font-bold text-white">{player}</span>
                            </div>

                            <button
                              onClick={() => handleRemovePlayer(player)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-semibold"
                            >
                              <Trash2 size={16} /> Delete Player
                            </button>
                          </div>

                          {/* Kit Grade Selectors */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                            {KITS.map(kit => (
                              <div key={kit} className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider pl-1">{kit}</label>
                                <select
                                  value={tiers[player][kit] || "NONE"}
                                  onChange={(e) => handleUpdatePlayerTier(player, kit, e.target.value)}
                                  className="w-full bg-[#222] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-brand-red"
                                >
                                  <option value="NONE">None</option>
                                  {TIER_GRADES.map(grade => (
                                    <option key={grade} value={grade}>{grade}</option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOMIZATION PERMISSIONS TAB */}
            {activeTab === "permissions" && (
              <div className="space-y-6">
                {/* Header Info & Bulk Actions */}
                <div className="glass p-6 rounded-2xl border border-white/10 bg-[#161616] flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="text-brand-red" size={20} /> Player Customization Permissions
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Grant or revoke specific intro animations, card themes, and music permissions for single or multiple players.
                    </p>
                  </div>

                  {selectedPlayersList.length > 0 && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleBulkGrantPermissions(true)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5"
                      >
                        <Unlock size={14} /> Grant All to ({selectedPlayersList.length})
                      </button>
                      <button
                        onClick={() => handleBulkGrantPermissions(false)}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5"
                      >
                        <Lock size={14} /> Lock All for ({selectedPlayersList.length})
                      </button>
                    </div>
                  )}
                </div>

                {/* Player List with Perm Toggle Controls */}
                <div className="glass rounded-2xl border border-white/10 overflow-hidden bg-[#161616]">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <input
                      type="text"
                      placeholder="🔍 Search player permissions..."
                      value={searchPlayer}
                      onChange={(e) => setSearchPlayer(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand-red text-sm w-80"
                    />
                    <div className="text-xs text-gray-400">
                      Showing {filteredPlayers.length} players
                    </div>
                  </div>

                  <div className="divide-y divide-white/5">
                    {filteredPlayers.map(player => {
                      const perm = profiles[player]?.permissions;
                      const introsCount = perm?.allowedIntroEffects?.length ?? ALL_INTRO_ANIMATIONS.length;
                      const themesCount = perm?.allowedCardThemes?.length ?? ALL_CARD_THEMES.length;
                      const canMusic = perm?.canUseCustomMusic !== false;
                      const isSelected = selectedPlayersList.includes(player);

                      return (
                        <div key={player} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) setSelectedPlayersList([...selectedPlayersList, player]);
                                else setSelectedPlayersList(selectedPlayersList.filter(p => p !== player));
                              }}
                              className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-red focus:ring-0"
                            />
                            <img src={`https://minotar.net/helm/${player}/32.png`} alt="" className="w-8 h-8 rounded-md" />
                            <div>
                              <span className="text-base font-bold text-white block">{player}</span>
                              <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                                <span>Intros: <strong className="text-brand-red">{introsCount}/{ALL_INTRO_ANIMATIONS.length}</strong></span>
                                <span>Themes: <strong className="text-brand-red">{themesCount}/{ALL_CARD_THEMES.length}</strong></span>
                                <span>Music: <strong className={canMusic ? "text-emerald-400" : "text-red-400"}>{canMusic ? "Allowed" : "Blocked"}</strong></span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleOpenPermissionsModal(player)}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                          >
                            <Edit2 size={14} /> Manage Perms
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === "gallery" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Server Gallery Images</h3>
                    <p className="text-gray-400 text-sm">Drag and drop images below or upload image files directly into the gallery.</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, gallery: [...settings.gallery, { id: Date.now().toString(), src: "", title: "New Screenshot" }] })}
                    className="bg-brand-red hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-lg"
                  >
                    <Plus size={16} /> Add Image Slot
                  </button>
                </div>

                {/* Drag and Drop Upload Dropzone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
                    if (files.length === 0) return;

                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (uploadEvent) => {
                        const base64Data = uploadEvent.target?.result as string;
                        setSettings(prev => ({
                          ...prev,
                          gallery: [
                            ...prev.gallery,
                            { id: Date.now().toString() + Math.random(), src: base64Data, title: file.name.replace(/\.[^/.]+$/, "") }
                          ]
                        }));
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  className="border-2 border-dashed border-white/20 hover:border-brand-red bg-white/[0.02] hover:bg-brand-red/5 transition-all rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group"
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="gallery-file-input"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []).filter(file => file.type.startsWith("image/"));
                      files.forEach(file => {
                        const reader = new FileReader();
                        reader.onload = (uploadEvent) => {
                          const base64Data = uploadEvent.target?.result as string;
                          setSettings(prev => ({
                            ...prev,
                            gallery: [
                              ...prev.gallery,
                              { id: Date.now().toString() + Math.random(), src: base64Data, title: file.name.replace(/\.[^/.]+$/, "") }
                            ]
                          }));
                        };
                        reader.readAsDataURL(file);
                      });
                    }}
                  />
                  <label htmlFor="gallery-file-input" className="cursor-pointer flex flex-col items-center">
                    <div className="w-14 h-14 bg-brand-red/10 border border-brand-red/30 rounded-2xl flex items-center justify-center text-brand-red mb-3 group-hover:scale-110 transition-transform">
                      <ImageIcon size={28} />
                    </div>
                    <span className="text-base font-bold text-white mb-1">Drag & Drop Images Here</span>
                    <span className="text-xs text-gray-400">or click to browse image files from your Mac</span>
                  </label>
                </div>

                {/* Gallery Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {settings.gallery.map((img, index) => (
                    <div key={img.id || index} className="p-4 rounded-2xl bg-[#161616] border border-white/10 space-y-3 relative group overflow-hidden shadow-xl">
                      <div className="relative w-full h-40 bg-black/50 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                        {img.src ? (
                          <img src={img.src} alt={img.title || "Gallery Preview"} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-500 text-xs gap-1">
                            <ImageIcon size={24} />
                            <span>No Image Source</span>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            const next = [...settings.gallery];
                            next.splice(index, 1);
                            setSettings({ ...settings, gallery: next });
                          }}
                          className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors shadow-md"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Image Title / Caption</label>
                        <input
                          type="text"
                          placeholder="e.g. Spawn Arena PvP"
                          value={img.title}
                          onChange={(e) => {
                            const next = [...settings.gallery];
                            next[index].title = e.target.value;
                            setSettings({ ...settings, gallery: next });
                          }}
                          className="w-full bg-[#222] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-brand-red"
                        />

                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Or Image URL</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={img.src}
                          onChange={(e) => {
                            const next = [...settings.gallery];
                            next[index].src = e.target.value;
                            setSettings({ ...settings, gallery: next });
                          }}
                          className="w-full bg-[#222] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-brand-red truncate"
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
                  <p className="text-gray-400">Configure YouTube reviews shown on the home page.</p>
                  <button
                    onClick={() => setSettings({ ...settings, reviews: [...settings.reviews, { id: Date.now().toString(), url: "", reviewer: "", title: "" }] })}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Review
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settings.reviews.map((rev, index) => (
                    <div key={rev.id || index} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-400">Review #{index + 1}</span>
                        <button
                          onClick={() => {
                            const next = [...settings.reviews];
                            next.splice(index, 1);
                            setSettings({ ...settings, reviews: next });
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="YouTube Video URL"
                        value={rev.url}
                        onChange={(e) => {
                          const next = [...settings.reviews];
                          next[index].url = e.target.value;
                          setSettings({ ...settings, reviews: next });
                        }}
                        className="w-full bg-[#222] border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Reviewer Name"
                        value={rev.reviewer}
                        onChange={(e) => {
                          const next = [...settings.reviews];
                          next[index].reviewer = e.target.value;
                          setSettings({ ...settings, reviews: next });
                        }}
                        className="w-full bg-[#222] border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Review Title"
                        value={rev.title}
                        onChange={(e) => {
                          const next = [...settings.reviews];
                          next[index].title = e.target.value;
                          setSettings({ ...settings, reviews: next });
                        }}
                        className="w-full bg-[#222] border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GLOBAL SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="space-y-8 max-w-4xl">
                {/* Server IP & Port Settings */}
                <div className="glass p-6 rounded-2xl border border-white/10 bg-[#161616] space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    🌐 Server Connectivity & IP Configuration
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Server Domain / IP</label>
                      <input
                        type="text"
                        value={settings.serverIp || "play.rearmc.in"}
                        onChange={(e) => setSettings({ ...settings, serverIp: e.target.value })}
                        className="w-full bg-[#222] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-brand-red"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Server Port</label>
                      <input
                        type="text"
                        value={settings.serverPort || "25565"}
                        onChange={(e) => setSettings({ ...settings, serverPort: e.target.value })}
                        className="w-full bg-[#222] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-brand-red"
                      />
                    </div>
                  </div>
                </div>

                {/* Announcement Banner Settings */}
                <div className="glass p-6 rounded-2xl border border-white/10 bg-[#161616] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      📣 Top Announcement Banner
                    </h3>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.announcementActive !== false}
                        onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-red focus:ring-0"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Banner Announcement Text</label>
                    <input
                      type="text"
                      placeholder="e.g. 🎉 SEASON 2 TOURNAMENT IS LIVE!"
                      value={settings.announcementText || ""}
                      onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                      className="w-full bg-[#222] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                {/* Hero Section Content Settings */}
                <div className="glass p-6 rounded-2xl border border-white/10 bg-[#161616] space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    ⚔️ Landing Page Hero Text Content
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Badge Tagline Text</label>
                      <input
                        type="text"
                        value={settings.heroBadgeText || ""}
                        onChange={(e) => setSettings({ ...settings, heroBadgeText: e.target.value })}
                        className="w-full bg-[#222] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-brand-red"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Main Headline Title</label>
                      <input
                        type="text"
                        value={settings.heroHeadline || ""}
                        onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                        className="w-full bg-[#222] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-brand-red"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Subtitle Description</label>
                      <textarea
                        rows={3}
                        value={settings.heroSubtitle || ""}
                        onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                        className="w-full bg-[#222] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-brand-red resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Social & Store Links */}
                <div className="glass p-6 rounded-2xl border border-white/10 bg-[#161616] space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    🔗 Social & Store Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Discord Invite URL</label>
                      <input
                        type="text"
                        value={settings.discordUrl || ""}
                        onChange={(e) => setSettings({ ...settings, discordUrl: e.target.value })}
                        className="w-full bg-[#222] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-brand-red"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Server Store URL</label>
                      <input
                        type="text"
                        value={settings.storeUrl || ""}
                        onChange={(e) => setSettings({ ...settings, storeUrl: e.target.value })}
                        className="w-full bg-[#222] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-brand-red"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">YouTube Channel URL</label>
                      <input
                        type="text"
                        value={settings.youtubeUrl || ""}
                        onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                        className="w-full bg-[#222] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-brand-red"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* PERMISSIONS MODAL FOR A SINGLE PLAYER */}
      {editingPermissionsUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#181818] rounded-2xl border border-white/10 shadow-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto flex flex-col space-y-6 my-8 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="text-brand-red" size={20} /> Permissions: {editingPermissionsUser}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Toggle allowed customization features for this player</p>
              </div>
              <button onClick={() => setEditingPermissionsUser(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Allowed Intro Animations Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white">Allowed Intro Animations</label>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setPermAllowedIntros(ALL_INTRO_ANIMATIONS.map(i => i.id))}
                    className="text-brand-red hover:underline"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => setPermAllowedIntros([])}
                    className="text-gray-400 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-[#111] rounded-xl border border-white/5">
                {ALL_INTRO_ANIMATIONS.map(item => (
                  <label key={item.id} className="flex items-center gap-2.5 text-xs text-gray-300 cursor-pointer p-1.5 hover:bg-white/5 rounded-lg">
                    <input
                      type="checkbox"
                      checked={permAllowedIntros.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) setPermAllowedIntros([...permAllowedIntros, item.id]);
                        else setPermAllowedIntros(permAllowedIntros.filter(i => i !== item.id));
                      }}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-red focus:ring-0"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Allowed Card Themes Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white">Allowed Card Themes</label>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setPermAllowedThemes(ALL_CARD_THEMES.map(t => t.id))}
                    className="text-brand-red hover:underline"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => setPermAllowedThemes([])}
                    className="text-gray-400 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-[#111] rounded-xl border border-white/5">
                {ALL_CARD_THEMES.map(item => (
                  <label key={item.id} className="flex items-center gap-2.5 text-xs text-gray-300 cursor-pointer p-1.5 hover:bg-white/5 rounded-lg">
                    <input
                      type="checkbox"
                      checked={permAllowedThemes.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) setPermAllowedThemes([...permAllowedThemes, item.id]);
                        else setPermAllowedThemes(permAllowedThemes.filter(t => t !== item.id));
                      }}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-brand-red focus:ring-0"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Toggle Music */}
            <div className="flex items-center justify-between p-3 bg-[#111] rounded-xl border border-white/5">
              <span className="text-sm font-bold text-white">Can Use Custom iTunes Music</span>
              <input
                type="checkbox"
                checked={permCanMusic}
                onChange={(e) => setPermCanMusic(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-brand-red focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="sticky bottom-0 pt-4 pb-2 bg-[#181818] border-t border-white/10 flex justify-end gap-3 z-20">
              <button
                onClick={() => setEditingPermissionsUser(null)}
                className="px-5 py-2 rounded-xl text-gray-400 hover:text-white text-sm font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                disabled={loading}
                className="bg-brand-red hover:bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg"
              >
                {loading ? "Saving Perms..." : "Save Permissions"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
