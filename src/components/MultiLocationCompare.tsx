"use client";
import { useState, useEffect } from "react";
import { LayoutGrid, Loader2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { scoreFarmingDay, weeklyRainTotal } from "@/lib/farmAdvisory";
import { formatTemp } from "@/lib/utils";
import { WeatherIcon } from "@/components/WeatherIcon";

interface Location {
  lat: number;
  lon: number;
  name: string;
}

interface LocationWeather {
  location: Location;
  temp: number;
  condition_code: string;
  farmScore: "good" | "caution" | "poor";
  weeklyRain: number;
  tempMax: number;
  tempMin: number;
  loading: boolean;
  error: boolean;
}

interface Props {
  unit: "metric" | "imperial";
  onSelect: (loc: Location) => void;
}

const STORAGE_KEY = "fp_bookmarks";
const SCORE_BADGE: Record<string, "success" | "warning" | "destructive"> = {
  good: "success",
  caution: "warning",
  poor: "destructive",
};

export function MultiLocationCompare({ unit, onSelect }: Props) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [data, setData] = useState<LocationWeather[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const stored: Location[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      setLocations(stored);
    } catch {}
  }, [open]);

  useEffect(() => {
    if (!open || locations.length === 0) return;
    const placeholders = locations.map((loc) => ({
      location: loc,
      temp: 0,
      condition_code: "0",
      farmScore: "good" as const,
      weeklyRain: 0,
      tempMax: 0,
      tempMin: 0,
      loading: true,
      error: false,
    }));
    setData(placeholders);

    locations.forEach(async (loc, i) => {
      try {
        const res = await fetch(`/api/weather?lat=${loc.lat}&lon=${loc.lon}&units=${unit}&days=7`);
        if (!res.ok) throw new Error();
        const w = await res.json();
        const today = w.daily?.[0];
        const score = today ? scoreFarmingDay(today) : null;
        setData((prev) =>
          prev.map((d, j) =>
            j === i
              ? {
                  ...d,
                  temp: Math.round(w.current.temperature),
                  condition_code: w.current.condition_code,
                  farmScore: score?.score ?? "good",
                  weeklyRain: weeklyRainTotal(w.daily ?? []),
                  tempMax: Math.round(today?.temp_max ?? 0),
                  tempMin: Math.round(today?.temp_min ?? 0),
                  loading: false,
                }
              : d
          )
        );
      } catch {
        setData((prev) =>
          prev.map((d, j) => (j === i ? { ...d, loading: false, error: true } : d))
        );
      }
    });
  }, [open, locations, unit]);

  if (locations.length < 2) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-primary" />
            Compare Farms
          </span>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setOpen(!open)}>
            {open ? "Hide" : `Compare ${locations.length}`}
          </Button>
        </CardTitle>
      </CardHeader>
      {open && (
        <CardContent className="px-3 sm:px-6">
          <div className="w-full overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs min-w-[320px]">
              <thead>
                <tr className="text-muted-foreground bg-muted/50">
                  <th className="text-left px-3 py-2 font-medium">Farm</th>
                  <th className="text-center px-2 py-2 font-medium">Now</th>
                  <th className="text-center px-2 py-2 font-medium hidden sm:table-cell">Hi / Lo</th>
                  <th className="text-center px-2 py-2 font-medium">Rain</th>
                  <th className="text-center px-2 py-2 font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr
                    key={i}
                    className="border-t border-border hover:bg-accent/40 cursor-pointer transition-colors"
                    onClick={() => onSelect(d.location)}
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                        <span className="truncate max-w-[90px] sm:max-w-[120px]">{d.location.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      {d.loading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-muted-foreground" />
                      ) : d.error ? (
                        <span className="text-destructive">—</span>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <WeatherIcon code={d.condition_code} className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-medium">{formatTemp(d.temp, unit)}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2.5 text-center text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                      {d.loading ? "…" : d.error ? "—" : `${formatTemp(d.tempMax, unit)} / ${formatTemp(d.tempMin, unit)}`}
                    </td>
                    <td className="px-2 py-2.5 text-center text-muted-foreground whitespace-nowrap">
                      {d.loading ? "…" : d.error ? "—" : `${d.weeklyRain}mm`}
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      {d.loading ? "…" : d.error ? "—" : (
                        <Badge variant={SCORE_BADGE[d.farmScore]} className="text-xs capitalize py-0">
                          {d.farmScore}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">Tap a row to load that farm</p>
        </CardContent>
      )}
    </Card>
  );
}
