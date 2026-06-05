import { NextRequest, NextResponse } from "next/server";

// Uses OpenStreetMap Nominatim — free, no API key, accurate global coverage
const NOMINATIM = "https://nominatim.openstreetmap.org";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const limit = searchParams.get("limit") ?? "5";

  if (!q) {
    return NextResponse.json({ error: "q is required" }, { status: 400 });
  }

  const url = `${NOMINATIM}/search?q=${encodeURIComponent(q)}&format=json&limit=${limit}&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "FarmPulse-AgriWeatherDashboard/1.0",
      "Accept-Language": "en",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 502 });
  }

  const results = await res.json();

  if (!results || results.length === 0) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  // Return array of suggestions, each with lat/lon/name/country
  const suggestions = results.map((r: {
    lat: string;
    lon: string;
    display_name: string;
    address?: {
      city?: string;
      town?: string;
      village?: string;
      state?: string;
      country?: string;
      country_code?: string;
    };
  }) => {
    const addr = r.address ?? {};
    const city = addr.city ?? addr.town ?? addr.village ?? "";
    const country = addr.country ?? "";
    const name = city && country ? `${city}, ${country}` : r.display_name.split(",").slice(0, 2).join(",").trim();
    return {
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
      name,
    };
  });

  // If only one result, also return flat shape for backward compat
  return NextResponse.json({
    ...suggestions[0],
    suggestions,
  });
}
