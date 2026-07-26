import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://wings.sprintmc.fun:7020/api/players", {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    // Transform to Record<username, { tiers, region }>
    const mappedData: Record<string, any> = {};
    if (json && json.data && Array.isArray(json.data)) {
      json.data.forEach((player: any) => {
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
    }

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error("Failed to fetch tiers from external API:", error);
    return NextResponse.json({}, { status: 500 });
  }
}

