"use client";
import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Coords {
  lat: number;
  lon: number;
  name: string;
}

interface Props {
  onLocation: (coords: Coords) => void;
}

const QUICK_LOCATIONS: Coords[] = [
  { lat: -1.9441, lon: 30.0619, name: "Kigali, Rwanda" },
  { lat: -3.3822, lon: 29.3644, name: "Bujumbura, Burundi" },
  { lat: -1.2921, lon: 36.8219, name: "Nairobi, Kenya" },
  { lat: 0.3476, lon: 32.5825, name: "Kampala, Uganda" },
  { lat: -6.7924, lon: 39.2083, name: "Dar es Salaam, Tanzania" },
  { lat: 40.7128, lon: -74.006, name: "New York, United States" },
  { lat: 28.6139, lon: 77.209, name: "New Delhi, India" },
  { lat: 51.5074, lon: -0.1278, name: "London, United Kingdom" },
  { lat: -33.8688, lon: 151.2093, name: "Sydney, Australia" },
  { lat: 48.8566, lon: 2.3522, name: "Paris, France" },
];

export function LocationSearch({ onLocation }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<Coords[]>([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced autocomplete — fires after 400ms of no typing
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setSuggestionLoading(false);
      return;
    }
    setSuggestionLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geo?q=${encodeURIComponent(query)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.suggestions)) {
            setSuggestions(data.suggestions);
          } else if (data.lat && data.lon) {
            setSuggestions([{ lat: data.lat, lon: data.lon, name: data.name ?? query }]);
          }
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      }
      setSuggestionLoading(false);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    // If we already have suggestions, just pick the first one
    if (suggestions.length > 0) {
      selectSuggestion(suggestions[0]);
      return;
    }
    setLoading(true);
    setError(null);
    setShowDropdown(false);
    try {
      const res = await fetch(`/api/geo?q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Location not found");
      onLocation({ lat: data.lat, lon: data.lon, name: data.name ?? query });
      setQuery("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function selectSuggestion(loc: Coords) {
    onLocation(loc);
    setQuery("");
    setShowDropdown(false);
    setSuggestions([]);
  }

  function useMyLocation() {
    setGeoLoading(true);
    setError(null);
    setShowDropdown(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude, name: "My Location" });
        setGeoLoading(false);
      },
      () => {
        setError("Location access denied.");
        setGeoLoading(false);
      }
    );
  }

  const displayList = query.length < 2 ? QUICK_LOCATIONS : suggestions;
  const showQuickLabel = query.length < 2;

  return (
    <div className="space-y-1" ref={containerRef}>
      <form onSubmit={search} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); setError(null); }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search any city or farm location…"
            className="w-full pl-9 pr-8 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setSuggestions([]); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {showDropdown && (displayList.length > 0 || suggestionLoading) && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden max-h-64 overflow-y-auto">
              {showQuickLabel && (
                <p className="px-3 py-1.5 text-xs text-muted-foreground font-medium bg-muted/50 sticky top-0">
                  Quick locations
                </p>
              )}
              {suggestionLoading && (
                <div className="flex items-center gap-2 px-3 py-2.5 text-xs text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Searching…
                </div>
              )}
              {!suggestionLoading && displayList.map((loc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectSuggestion(loc)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-accent transition-colors border-b border-border/50 last:border-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{loc.name}</span>
                </button>
              ))}
              {!suggestionLoading && query.length >= 2 && suggestions.length === 0 && (
                <p className="px-3 py-2.5 text-xs text-muted-foreground">No locations found for &quot;{query}&quot;</p>
              )}
            </div>
          )}
        </div>

        <Button type="submit" size="sm" disabled={loading || suggestionLoading}>
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
          {geoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
        </Button>
      </form>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
