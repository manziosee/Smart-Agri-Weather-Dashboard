import { NextResponse } from "next/server";

const BASE = process.env.WEATHER_AI_BASE_URL ?? "https://api.weather-ai.co";

export async function GET() {
  const upstream = await fetch(`${BASE}/v1/ip-lookup`, {
    headers: { Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}` },
    next: { revalidate: 3600 },
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
