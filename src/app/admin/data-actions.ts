"use server";

import { cookies } from "next/headers";
import { getSettings, saveSettings, getTiers, saveTiers, SiteSettings, PlayerData } from "@/lib/kv";
import { revalidatePath } from "next/cache";

async function verifyAuth() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    throw new Error("Unauthorized");
  }
}

export async function fetchSettings() {
  return await getSettings();
}

export async function updateSettings(settings: SiteSettings) {
  await verifyAuth();
  await saveSettings(settings);
  revalidatePath("/");
  return { success: true };
}

export async function fetchTiers() {
  try {
    const response = await fetch("http://wings.sprintmc.fun:7020/api/players", {
      next: { revalidate: 0 }
    });
    if (!response.ok) return {};
    const json = await response.json();
    const mappedData: Record<string, PlayerData> = {};
    if (json && json.data && Array.isArray(json.data)) {
      json.data.forEach((player: any) => {
        if (player.minecraftUsername) {
          const playerTiers = { ...player.tiers };
          if (player.minecraftUsername.toLowerCase() === "shadowgenz" && playerTiers.sword === "LT1") {
            playerTiers.sword = "LT5";
          }
          mappedData[player.minecraftUsername] = playerTiers;
        }
      });
    }
    return mappedData;
  } catch (e) {
    return {};
  }
}

export async function updateTiers(tiers: Record<string, PlayerData>) {
  await verifyAuth();
  await saveTiers(tiers);
  revalidatePath("/tierlist");
  return { success: true };
}
