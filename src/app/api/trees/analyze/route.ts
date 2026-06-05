import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.WEATHER_AI_BASE_URL ?? "https://api.weather-ai.co";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json({ error: "image file is required" }, { status: 400 });
    }

    const upstream = await fetch(`${BASE}/v1/trees/analyze`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}` },
      body: formData,
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
