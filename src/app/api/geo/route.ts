import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.WEATHER_AI_BASE_URL ?? "https://api.weather-ai.co";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "q is required" }, { status: 400 });
  }

  const upstream = await fetch(
    `${BASE}/v1/weather-geo?q=${encodeURIComponent(q)}&ai=false`,
    {
      headers: { Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}` },
      next: { revalidate: 3600 },
    }
  );

  const data = await upstream.json();
  if (!upstream.ok) return NextResponse.json(data, { status: upstream.status });

  const loc = data.location;
  return NextResponse.json({ lat: loc.lat, lon: loc.lon, name: q });
}
