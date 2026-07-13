import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://163.61.39.244:25567/api/players", {
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
          mappedData[player.minecraftUsername] = {
            tiers: player.tiers,
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

