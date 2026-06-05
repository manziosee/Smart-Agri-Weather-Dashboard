import { NextRequest, NextResponse } from "next/server";

const NOMINATIM = "https://nominatim.openstreetmap.org";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const limit = searchParams.get("limit") ?? "6";

  if (!q) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const url = `${NOMINATIM}/search?q=${encodeURIComponent(q)}&format=json&limit=${limit}&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "FarmPulse-AgriWeatherDashboard/1.0",
        "Accept-Language": "en",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ suggestions: [] });
    }

    const results = await res.json();

    if (!results || results.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = results.map((r: {
      lat: string;
      lon: string;
      display_name: string;
      address?: {
        city?: string;
        town?: string;
        village?: string;
        country?: string;
      };
    }) => {
      const addr = r.address ?? {};
      const city = addr.city ?? addr.town ?? addr.village ?? "";
      const country = addr.country ?? "";
      const name = city && country
        ? `${city}, ${country}`
        : r.display_name.split(",").slice(0, 2).join(",").trim();
      return { lat: parseFloat(r.lat), lon: parseFloat(r.lon), name };
    });

    return NextResponse.json({ ...suggestions[0], suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
