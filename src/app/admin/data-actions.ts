/* eslint-disable */

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
    const allPlayers: any[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await fetch(`http://wings.sprintmc.fun:7020/api/players?limit=100&page=${page}`, {
        cache: "no-store"
      });
      if (!response.ok) break;
      const json = await response.json();
      if (json && Array.isArray(json.data)) {
        allPlayers.push(...json.data);
      }
      totalPages = json?.pagination?.pages ?? 1;
      page++;
    } while (page <= totalPages);

    const mappedData: Record<string, PlayerData> = {};
    allPlayers.forEach((player: any) => {
      if (player.minecraftUsername) {
        const playerTiers = { ...player.tiers };
        if (player.minecraftUsername.toLowerCase() === "shadowgenz" && playerTiers.sword === "LT1") {
          playerTiers.sword = "LT5";
        }
        mappedData[player.minecraftUsername] = playerTiers;
      }
    });
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
