"use client";
import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Coords {
  lat: number;
  lon: number;
  name: string;
}

interface Props {
  onLocation: (coords: Coords) => void;
}

export function LocationSearch({ onLocation }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/geo?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Location not found");
      const loc = data.location ?? data;
      onLocation({ lat: loc.lat, lon: loc.lon, name: loc.name ?? query });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function useMyLocation() {
    setGeoLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          name: "My Location",
        });
        setGeoLoading(false);
      },
      () => {
        setError("Location access denied.");
        setGeoLoading(false);
      }
    );
  }

  return (
    <div className="space-y-2">
      <form onSubmit={search} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or farm location…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={useMyLocation}
          disabled={geoLoading}
          title="Use my location"
        >
          {geoLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
        </Button>
      </form>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
