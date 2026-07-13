import { NextResponse } from "next/server";
import { getSettings } from "@/lib/kv";

export async function GET() {
  try {
    const data = await getSettings();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
}
