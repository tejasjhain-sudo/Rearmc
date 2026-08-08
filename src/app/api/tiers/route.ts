/* eslint-disable */

import { NextResponse } from "next/server";
import { getProfiles } from "@/lib/kv";

export const dynamic = "force-dynamic";

async function fetchAllPlayers() {
  const allPlayers: any[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const response = await fetch(`http://wings.desact.in:2000/api/players?limit=100&page=${page}`, {
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
  } catch (error) {
    console.error("Error fetching pages from external API:", error);
  }

  return allPlayers;
}

export async function GET() {
  try {
    const { getTiers } = await import("@/lib/kv");
    const [players, profiles, kvTiers] = await Promise.all([
      fetchAllPlayers(),
      getProfiles(),
      getTiers(),
    ]);

    // Transform to Record<username, { tiers, region, profile }>
    const mappedData: Record<string, any> = {};
    
    // First map external players API data
    players.forEach((player: any) => {
      if (player.minecraftUsername) {
        const username = player.minecraftUsername;
        const playerTiers = { ...player.tiers };
        
        // Merge with local KV overrides if any
        if (kvTiers[username]) {
          Object.assign(playerTiers, kvTiers[username]);
        }

        if (username.toLowerCase() === "shadowgenz" && playerTiers.sword === "LT1") {
          playerTiers.sword = "LT5";
        }

        const profile = profiles[username] || profiles[username.toLowerCase()] || {};

        mappedData[username] = {
          tiers: playerTiers,
          region: player.region ?? "AS",
          profile: profile
        };
      }
    });

    // Also include manually added admin players in KV that aren't in external API
    Object.keys(kvTiers).forEach((username) => {
      if (!mappedData[username]) {
        mappedData[username] = {
          tiers: kvTiers[username],
          region: "AS",
          profile: profiles[username] || profiles[username.toLowerCase()] || {}
        };
      } else {
        // Ensure kvTiers override external API data for existing players
        Object.assign(mappedData[username].tiers, kvTiers[username]);
      }
    });

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error("Failed to fetch tiers from external API:", error);
    return NextResponse.json({}, { status: 500 });
  }
}

