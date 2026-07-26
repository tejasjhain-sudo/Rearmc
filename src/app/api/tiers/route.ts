import { NextResponse } from "next/server";

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
    const players = await fetchAllPlayers();

    // Transform to Record<username, { tiers, region }>
    const mappedData: Record<string, any> = {};
    players.forEach((player: any) => {
      if (player.minecraftUsername) {
        const playerTiers = { ...player.tiers };
        if (player.minecraftUsername.toLowerCase() === "shadowgenz" && playerTiers.sword === "LT1") {
          playerTiers.sword = "LT5";
        }
        mappedData[player.minecraftUsername] = {
          tiers: playerTiers,
          region: player.region ?? "AS",
        };
      }
    });

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error("Failed to fetch tiers from external API:", error);
    return NextResponse.json({}, { status: 500 });
  }
}

