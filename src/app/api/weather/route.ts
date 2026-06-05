import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.WEATHER_AI_BASE_URL ?? "https://api.weather-ai.co";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const days = searchParams.get("days") ?? "7";
  const units = searchParams.get("units") ?? "metric";

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon are required" }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `${BASE}/v1/weather?lat=${lat}&lon=${lon}&days=${days}&units=${units}&ai=true`,
      {
        headers: { Authorization: `Bearer ${process.env.WEATHER_AI_API_KEY}` },
        next: { revalidate: 300 },
      }
    );

    const data = await upstream.json();

    // WeatherAI returns 500 for unsupported regions — surface a clear message
    if (!upstream.ok) {
      const message = data?.message ?? data?.error ?? null;
      const isUnsupported = upstream.status === 500 || message?.toLowerCase().includes("not supported");
      return NextResponse.json(
        {
          error: isUnsupported
            ? "Weather data is not available for this location. Please try a different city."
            : (message ?? "Failed to load weather data"),
        },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the weather service. Please try again." },
      { status: 503 }
    );
  }
}
