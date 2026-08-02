import { NextResponse } from "next/server";
import { getProfiles, saveProfiles, ProfileCustomization } from "@/lib/kv";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, customization } = body;

    if (!username || !customization) {
      return NextResponse.json({ error: "Missing username or customization data" }, { status: 400 });
    }

    const profiles = await getProfiles();
    
    // Merge existing profile data with the new customizations
    const existingProfile = profiles[username] || {};
    profiles[username] = {
      ...existingProfile,
      ...customization,
      updatedAt: Date.now(),
    };

    await saveProfiles(profiles);

    return NextResponse.json({ success: true, profile: profiles[username] });
  } catch (error) {
    console.error("Failed to update profile customization:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
