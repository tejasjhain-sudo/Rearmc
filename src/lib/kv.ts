import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

// Define our types
export type Category = "sword" | "axe" | "nethpot" | "dpot" | "uhc" | "smp" | "crystal" | "mace";

export interface PlayerData {
  sword: string | null;
  axe: string | null;
  nethpot: string | null;
  dpot: string | null;
  uhc: string | null;
  smp: string | null;
  crystal: string | null;
  mace: string | null;
}

export interface Review {
  id: string;
  url: string; // e.g. https://youtu.be/...
  reviewer: string;
  title: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface PlayerPermissions {
  allowedIntroEffects?: string[];
  allowedCardThemes?: string[];
  allowedParticles?: string[];
  canUseCustomMusic?: boolean;
}

export interface ProfileCustomization {
  cardEffect?: string;
  introEffect?: string;
  badgeIcon?: string;
  titleBanner?: string;
  updatedAt?: number;
  particles?: string;
  tag?: string;
  tagColor?: string;
  cardTheme?: string;
  cardLayout?: string;
  musicUrl?: string;
  musicName?: string;
  permissions?: PlayerPermissions;
}

export interface SiteSettings {
  serverIp: string;
  serverPort: string;
  heroBadgeText: string;
  heroHeadline: string;
  heroSubtitle: string;
  announcementText: string;
  announcementActive: boolean;
  discordUrl: string;
  storeUrl: string;
  youtubeUrl: string;
  gallery: GalleryImage[];
  reviews: Review[];
  features: FeatureItem[];
}

// Default initial state
const DEFAULT_SETTINGS: SiteSettings = {
  serverIp: "play.rearmc.in",
  serverPort: "25565",
  heroBadgeText: "🔥 INDIA'S #1 COMPETITIVE MC PVP SERVER",
  heroHeadline: "DOMINATE THE RANKED PVP ARENA",
  heroSubtitle: "Compete against top Indian PvP warriors with ultra-low latency, custom knockback, ranked matchmaking, and professional tier testing.",
  announcementText: "🎉 SEASON 2 PVP TOURNAMENT IS LIVE! SIGN UP NOW ON DISCORD!",
  announcementActive: true,
  discordUrl: "https://discord.gg/p7ENwb6Pz7",
  storeUrl: "https://store.rearmc.in",
  youtubeUrl: "https://youtube.com/@rearmcpvp",
  gallery: [
    { id: "1", src: "/banner.jpg", title: "PvP Arena" },
    { id: "2", src: "https://images.wallpapersden.com/image/download/minecraft-4k-game_bGhnZmyUmZqaraWkpJRmbmdlrWZnZWU.jpg", title: "Spawn" },
    { id: "3", src: "https://images.hdqwalls.com/download/minecraft-2020-4k-42-1920x1080.jpg", title: "Tournament" }
  ],
  reviews: [
    { id: "1", url: "https://youtu.be/1PslYC-DTDA", reviewer: "Rajesh", title: "RearMC Server Review" },
    { id: "2", url: "https://www.youtube.com/watch?v=rOdJc6Bv3V4", reviewer: "RearMC PvP", title: "RearMC Gameplay Showcase" }
  ],
  features: [
    { id: "1", title: "Ultra-Low Latency", description: "Hosted in Mumbai datacenters for 10-25ms ping across India.", icon: "Zap" },
    { id: "2", title: "Custom Knockback Engine", description: "Optimized 1.8 & 1.20 hit detection and smooth knockback physics.", icon: "Shield" },
    { id: "3", title: "Ranked Tier Testing", description: "Official HT1 to LT5 ranking leaderboard verified by staff.", icon: "Trophy" }
  ]
};

// Local fallback helper for development
const getLocalData = <T>(key: string, defaultValue: T): T => {
  try {
    const filePath = path.join(process.cwd(), `.local_${key}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setLocalData = <T>(key: string, value: T) => {
  try {
    const filePath = path.join(process.cwd(), `.local_${key}.json`);
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
  } catch (e) {
    console.error(`Failed to write local data for ${key}`, e);
  }
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const { data } = await supabase.from('rearmc_kv').select('value').eq('key', 'rearmc:settings').single();
    if (data?.value) return data.value as SiteSettings;
  } catch (e) {
    console.error("Supabase getSettings error", e);
  }
  return getLocalData('settings', DEFAULT_SETTINGS);
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  try {
    await supabase.from('rearmc_kv').upsert({ key: 'rearmc:settings', value: settings });
  } catch (e) {
    console.error("Supabase saveSettings error", e);
  }
  setLocalData('settings', settings);
}

export async function getTiers(): Promise<Record<string, PlayerData>> {
  try {
    const { data } = await supabase.from('rearmc_kv').select('value').eq('key', 'rearmc:tiers').single();
    if (data?.value) return data.value;
  } catch (e) {
    console.error("Supabase getTiers error", e);
  }
  return getLocalData('tiers', {});
}

export async function saveTiers(tiers: Record<string, PlayerData>): Promise<void> {
  try {
    await supabase.from('rearmc_kv').upsert({ key: 'rearmc:tiers', value: tiers });
  } catch (e) {
    console.error("Supabase saveTiers error", e);
  }
  setLocalData('tiers', tiers);
}

export async function getProfiles(): Promise<Record<string, ProfileCustomization>> {
  try {
    const { data } = await supabase.from('rearmc_kv').select('value').eq('key', 'rearmc:profiles').single();
    if (data?.value) return data.value;
  } catch (e) {
    console.error("Supabase getProfiles error", e);
  }
  return getLocalData('profiles', {});
}

export async function saveProfiles(profiles: Record<string, ProfileCustomization>): Promise<void> {
  try {
    await supabase.from('rearmc_kv').upsert({ key: 'rearmc:profiles', value: profiles });
  } catch (e) {
    console.error("Supabase saveProfiles error", e);
  }
  setLocalData('profiles', profiles);
}
