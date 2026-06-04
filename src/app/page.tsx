"use client";
import { useState, useEffect, useCallback } from "react";
import { Leaf, RefreshCw, Loader2, AlertCircle, Moon, Sun as SunIcon } from "lucide-react";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { ForecastChart } from "@/components/ForecastChart";
import { HourlyChart } from "@/components/HourlyChart";
import { UsageMeter } from "@/components/UsageMeter";
import { TreeAnalysisPanel } from "@/components/TreeAnalysisPanel";
import { LocationSearch } from "@/components/LocationSearch";
import { Button } from "@/components/ui/button";
import type { WeatherResponse, UsageData } from "@/lib/types";

interface Coords {
  lat: number;
  lon: number;
  name: string;
}

const DEFAULT_LOCATION: Coords = { lat: -1.9441, lon: 30.0619, name: "Kigali, Rwanda" };

export default function Home() {
  const [location, setLocation] = useState<Coords>(DEFAULT_LOCATION);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [dark, setDark] = useState(false);

  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeather = useCallback(async (coords: Coords) => {
    setLoading(true);
    setError(null);
    try {
      const params = `lat=${coords.lat}&lon=${coords.lon}&units=${unit}&days=7`;
      const [weatherRes, usageRes] = await Promise.all([
        fetch(`/api/weather?${params}`),
        fetch(`/api/usage`),
      ]);

      const [w, u] = await Promise.all([weatherRes.json(), usageRes.json()]);

      if (!weatherRes.ok) throw new Error(w.error ?? w.message ?? "Failed to load weather");

      setWeather(w);
      if (usageRes.ok) setUsage(u);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load weather data");
    } finally {
      setLoading(false);
    }
  }, [unit]);

  useEffect(() => {
    fetchWeather(location);
  }, [location, unit, fetchWeather]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-base tracking-tight">FarmPulse</span>
          </div>

          <div className="flex-1 max-w-md hidden sm:block">
            <LocationSearch onLocation={setLocation} />
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
              className="text-xs px-2"
            >
              {unit === "metric" ? "°C" : "°F"}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDark(!dark)}>
              {dark ? <SunIcon className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchWeather(location)}
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="sm:hidden">
          <LocationSearch onLocation={setLocation} />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{location.name}</span>
          {lastUpdated && (
            <span>Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {loading && !weather && (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Loading weather data…</p>
          </div>
        )}

        {weather && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CurrentWeatherCard data={weather} locationName={location.name} unit={unit} />
              {weather.daily?.length > 0 && (
                <ForecastChart daily={weather.daily} unit={unit} />
              )}
              {weather.hourly?.length > 0 && <HourlyChart hourly={weather.hourly} />}
            </div>

            <div className="space-y-6">
              {usage && <UsageMeter data={usage} />}
              <TreeAnalysisPanel />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-12 py-4 text-center text-xs text-muted-foreground">
        Powered by{" "}
        <a href="https://weather-ai.co" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          WeatherAI
        </a>{" "}
        · FarmPulse © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
