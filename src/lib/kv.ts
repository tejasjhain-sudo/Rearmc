import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

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

export interface SiteSettings {
  discordUrl: string;
  gallery: GalleryImage[];
  reviews: Review[];
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
}

// Default initial state
const DEFAULT_SETTINGS: SiteSettings = {
  discordUrl: "https://discord.gg/p7ENwb6Pz7",
  gallery: [
    { id: "1", src: "/banner.jpg", title: "PvP Arena" },
    { id: "2", src: "https://images.wallpapersden.com/image/download/minecraft-4k-game_bGhnZmyUmZqaraWkpJRmbmdlrWZnZWU.jpg", title: "Spawn" },
    { id: "3", src: "https://images.hdqwalls.com/download/minecraft-2020-4k-42-1920x1080.jpg", title: "Tournament" }
  ],
  reviews: [
    { id: "1", url: "https://youtu.be/1PslYC-DTDA", reviewer: "Rajesh", title: "RearMC Server Review" },
    { id: "2", url: "https://www.youtube.com/watch?v=rOdJc6Bv3V4", reviewer: "RearMC PvP", title: "RearMC Gameplay Showcase" }
  ]
};

// Check if we are running with Vercel KV or need local fallback
const useKV = !!process.env.KV_REST_API_URL;

// Local fallback helper
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
  if (useKV) {
    const data = await kv.get<SiteSettings>('rearmc:settings');
    return data || DEFAULT_SETTINGS;
  } else {
    return getLocalData('settings', DEFAULT_SETTINGS);
  }
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  if (useKV) {
    await kv.set('rearmc:settings', settings);
  } else {
    setLocalData('settings', settings);
  }
}

export async function getTiers(): Promise<Record<string, PlayerData>> {
  if (useKV) {
    const data = await kv.get<Record<string, PlayerData>>('rearmc:tiers');
    return data || {};
  } else {
    return getLocalData('tiers', {});
  }
}

export async function saveTiers(tiers: Record<string, PlayerData>): Promise<void> {
  if (useKV) {
    await kv.set('rearmc:tiers', tiers);
  } else {
    setLocalData('tiers', tiers);
  }
}

export async function getProfiles(): Promise<Record<string, ProfileCustomization>> {
  if (useKV) {
    const data = await kv.get<Record<string, ProfileCustomization>>('rearmc:profiles');
    return data || {};
  } else {
    return getLocalData('profiles', {});
  }
}

export async function saveProfiles(profiles: Record<string, ProfileCustomization>): Promise<void> {
  if (useKV) {
    await kv.set('rearmc:profiles', profiles);
  } else {
    setLocalData('profiles', profiles);
  }
}
