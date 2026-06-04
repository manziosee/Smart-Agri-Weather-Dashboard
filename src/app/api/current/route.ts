import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.WEATHER_AI_BASE_URL ?? "https://api.weather-ai.co";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const units = searchParams.get("units") ?? "metric";

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  const upstream = await fetch(
    `${BASE}/v1/current?lat=${lat}&lon=${lon}&units=${units}&ai=true`,
    {
      headers: { Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}` },
      next: { revalidate: 60 },
    }
  );

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
