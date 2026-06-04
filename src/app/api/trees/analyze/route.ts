import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.WEATHER_AI_BASE_URL ?? "https://api.weather-ai.co";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const upstream = await fetch(`${BASE}/v1/trees/analyze`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}` },
    body: formData,
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
