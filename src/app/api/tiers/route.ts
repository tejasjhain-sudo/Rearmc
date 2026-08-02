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
  } catch (error) {
    console.error("Error fetching pages from external API:", error);
  }

  return allPlayers;
}

export async function GET() {
  try {
    const [players, profiles] = await Promise.all([
      fetchAllPlayers(),
      getProfiles()
    ]);

    // Transform to Record<username, { tiers, region, profile }>
    const mappedData: Record<string, any> = {};
    players.forEach((player: any) => {
      if (player.minecraftUsername) {
        const username = player.minecraftUsername;
        const playerTiers = { ...player.tiers };
        
        // Example hardcoded override
        if (username.toLowerCase() === "shadowgenz" && playerTiers.sword === "LT1") {
          playerTiers.sword = "LT5";
        }

        // Check if there is a profile for this user (case-insensitive key match if needed, but here exact for simplicity, or we can check lowercased)
        const profile = profiles[username] || profiles[username.toLowerCase()] || {};

        mappedData[username] = {
          tiers: playerTiers,
          region: player.region ?? "AS",
          profile: profile
        };
      }
    });

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error("Failed to fetch tiers from external API:", error);
    return NextResponse.json({}, { status: 500 });
  }
}

