/* eslint-disable */

"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Search, Music, Loader2, Play } from "lucide-react";

interface ProfileCustomizationModalProps {
  username: string;
  currentCustomization: any;
  onClose: () => void;
  onSave: (customization: any) => void;
  renderPreview: (customizationState: any) => React.ReactNode;
}

export function ProfileCustomizationModal({
  username,
  currentCustomization,
  onClose,
  onSave,
  renderPreview,
}: ProfileCustomizationModalProps) {
  const [introEffect, setIntroEffect] = useState(currentCustomization?.introEffect || "lightning");
  const [particles, setParticles] = useState(currentCustomization?.particles || "enchantment");
  const [tag, setTag] = useState(currentCustomization?.tag || "⭐ RearMC Master");
  const [tagColor, setTagColor] = useState(currentCustomization?.tagColor || "amber");
  const [cardTheme, setCardTheme] = useState(currentCustomization?.cardTheme || "minecraft_chest");
  const [cardLayout, setCardLayout] = useState(currentCustomization?.cardLayout || "standard");
  const [musicUrl, setMusicUrl] = useState(currentCustomization?.musicUrl || "");
  const [musicName, setMusicName] = useState(currentCustomization?.musicName || "");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [saving, setSaving] = useState(false);

  const currentPreviewState = {
    introEffect,
    particles,
    tag,
    tagColor,
    cardTheme,
    cardLayout,
    musicUrl,
    musicName,
  };

  const handleSearchMusic = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&limit=5&entity=song`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Music search failed", error);
    }
    setIsSearching(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      username,
      customization: currentPreviewState,
    };

    try {
      const res = await fetch("/api/customize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        onSave(data.profile);
        onClose();
      } else {
        alert("Failed to save customization.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl items-start justify-center mt-10 pointer-events-none">
        
        {/* Live Preview Area */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col items-center pointer-events-auto">
          <h3 className="text-white font-bold mb-4 bg-black/50 px-4 py-2 rounded-full border border-white/10 shadow-lg">
            Live Preview
          </h3>
          <div className="pointer-events-none w-full flex justify-center scale-90 sm:scale-100 origin-top">
            {renderPreview(currentPreviewState)}
          </div>
        </div>

        {/* Customization Controls */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full lg:w-[450px] bg-[#181818] rounded-xl border border-white/10 shadow-2xl p-6 relative z-10 pointer-events-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Customize Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Card Theme</label>
              <select
                value={cardTheme}
                onChange={(e) => setCardTheme(e.target.value)}
                className="w-full bg-[#222] border border-white/10 rounded-lg p-2 text-white outline-none focus:border-brand-red transition-colors"
              >
                <option value="minecraft_chest">Minecraft Chest (Default)</option>
                <option value="dark_dragon">Dark Dragon</option>
                <option value="neon_cyber">Neon Cyberpunk</option>
                <option value="golden_king">Golden King</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Card Layout</label>
              <select
                value={cardLayout}
                onChange={(e) => setCardLayout(e.target.value)}
                className="w-full bg-[#222] border border-white/10 rounded-lg p-2 text-white outline-none focus:border-brand-red transition-colors"
              >
                <option value="standard">Standard</option>
                <option value="compact">Compact</option>
                <option value="tall">Tall</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Intro Animation</label>
              <select
                value={introEffect}
                onChange={(e) => setIntroEffect(e.target.value)}
                className="w-full bg-[#222] border border-white/10 rounded-lg p-2 text-white outline-none focus:border-brand-red transition-colors"
              >
                <option value="none">None</option>
                <option value="lightning">Lightning Strike</option>
                <option value="void_galaxy">Void Galaxy</option>
                <option value="cyber_glitch">Cyber Glitch</option>
                <option value="shattered_glass">Shattered Glass</option>
                <option value="holy_light">Holy Light</option>
                <option value="creeper_blast">Creeper Blast</option>
                <option value="tnt_pop">TNT Pop</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Theme Music (iTunes Search)</label>
              <form onSubmit={handleSearchMusic} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a song..."
                    className="w-full bg-[#222] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white outline-none focus:border-brand-red transition-colors"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-brand-red hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isSearching ? <Loader2 size={18} className="animate-spin" /> : "Search"}
                </button>
              </form>

              {/* Selected Music Display */}
              {musicName && (
                <div className="flex items-center justify-between bg-brand-red/10 border border-brand-red/30 rounded-lg p-2 px-3 mt-1">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Music size={16} className="text-brand-red shrink-0" />
                    <span className="text-sm font-semibold text-brand-red truncate">{musicName}</span>
                  </div>
                  <button onClick={() => { setMusicUrl(""); setMusicName(""); }} className="text-gray-400 hover:text-white shrink-0 ml-2">
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                  {searchResults.map((track) => (
                    <button
                      key={track.trackId}
                      type="button"
                      onClick={() => {
                        setMusicUrl(track.previewUrl);
                        setMusicName(`${track.trackName} - ${track.artistName}`);
                        setSearchResults([]);
                        setSearchQuery("");
                      }}
                      className="w-full flex items-center gap-3 p-2 hover:bg-[#333] transition-colors text-left border-b border-white/5 last:border-0"
                    >
                      <img src={track.artworkUrl60} alt={track.trackName} className="w-10 h-10 rounded shadow-sm object-cover" />
                      <div className="flex flex-col overflow-hidden flex-1">
                        <span className="text-white text-sm font-bold truncate">{track.trackName}</span>
                        <span className="text-gray-400 text-xs truncate">{track.artistName}</span>
                      </div>
                      <Play size={16} className="text-brand-red opacity-0 group-hover:opacity-100 mr-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Continuous Particles</label>
              <select
                value={particles}
                onChange={(e) => setParticles(e.target.value)}
                className="w-full bg-[#222] border border-white/10 rounded-lg p-2 text-white outline-none focus:border-brand-red transition-colors"
              >
                <option value="none">None</option>
                <option value="enchantment">Enchantment Runes</option>
                <option value="fire">Fire Sparks</option>
                <option value="cherry_blossom">Cherry Blossoms</option>
                <option value="dark_dragon_aura">Dark Dragon Aura</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Profile Tag</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                maxLength={30}
                className="w-full bg-[#222] border border-white/10 rounded-lg p-2 text-white outline-none focus:border-brand-red transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tag Color</label>
              <select
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                className="w-full bg-[#222] border border-white/10 rounded-lg p-2 text-white outline-none focus:border-brand-red transition-colors"
              >
                <option value="amber">Amber</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-brand-red hover:bg-red-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
