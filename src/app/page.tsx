"use client";
import { useState, useEffect, useCallback } from "react";
import { Leaf, RefreshCw, AlertCircle, Moon, Sun as SunIcon } from "lucide-react";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { ForecastChart } from "@/components/ForecastChart";
import { HourlyChart } from "@/components/HourlyChart";
import { UsageMeter } from "@/components/UsageMeter";
import { TreeAnalysisPanel } from "@/components/TreeAnalysisPanel";
import { LocationSearch } from "@/components/LocationSearch";
import { SunriseSunsetCard } from "@/components/SunriseSunsetCard";
import { FarmSummaryCard } from "@/components/FarmSummaryCard";
import { WindCompass } from "@/components/WindCompass";
import { CropAdvisoryPanel } from "@/components/CropAdvisoryPanel";
import { BookmarkedLocations } from "@/components/BookmarkedLocations";
import { ShareButton } from "@/components/ShareButton";
import { AISummaryCard } from "@/components/AISummaryCard";
import { IrrigationCard } from "@/components/IrrigationCard";
import { WeatherAlertsPanel } from "@/components/WeatherAlertsPanel";
import { MultiLocationCompare } from "@/components/MultiLocationCompare";
import { PestRiskPanel } from "@/components/PestRiskPanel";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { useAutoLocation } from "@/hooks/useAutoLocation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { weeklyRainTotal } from "@/lib/farmAdvisory";
import type { WeatherResponse, UsageData } from "@/lib/types";

interface Coords {
  lat: number;
  lon: number;
  name: string;
}

const DEFAULT_LOCATION: Coords = { lat: -1.9441, lon: 30.0619, name: "Kigali, Rwanda" };

export default function Home() {
  const [location, setLocation] = useState<Coords>(DEFAULT_LOCATION);
  const [unit, setUnit] = useLocalStorage<"metric" | "imperial">("fp_unit", "metric");
  const [dark, setDark] = useLocalStorage<boolean>("fp_dark", false);

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

  useEffect(() => { fetchWeather(location); }, [location, unit, fetchWeather]);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  function handleLocation(coords: Coords) { setLocation(coords); }
  useAutoLocation(handleLocation);

  const today = weather?.daily?.[0];
  const humidity = weather?.hourly?.[0]?.humidity ?? 60;
  const weeklyRain = weather ? weeklyRainTotal(weather.daily) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm sm:text-base tracking-tight">FarmPulse</span>
          </div>

          {/* Search — takes remaining space, hidden on mobile (shown below header) */}
          <div className="flex-1 min-w-0 hidden sm:block">
            <LocationSearch onLocation={handleLocation} />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1 ml-auto shrink-0">
            {weather && (
              <div className="hidden xs:block">
                <ShareButton targetId="weather-snapshot" filename="farmpulse-weather.png" />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
              className="text-xs px-2 h-8 font-semibold"
            >
              {unit === "metric" ? "°C" : "°F"}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDark(!dark)}>
              {dark ? <SunIcon className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => fetchWeather(location)}
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Mobile search */}
        <div className="sm:hidden">
          <LocationSearch onLocation={handleLocation} />
        </div>

        {/* Location + timestamp bar */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate max-w-[60%] font-medium">{location.name}</span>
          <div className="flex items-center gap-2 shrink-0">
            {weather && (
              <div className="sm:hidden">
                <ShareButton targetId="weather-snapshot" filename="farmpulse-weather.png" />
              </div>
            )}
            {lastUpdated && (
              <span>
                {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="min-w-0">{error}</span>
          </div>
        )}

        {/* Skeleton */}
        {loading && !weather && <DashboardSkeleton />}

        {/* Dashboard grid */}
        {weather && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

            {/* ── Main column (spans 2 on lg) ── */}
            <div id="weather-snapshot" className="md:col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
              <CurrentWeatherCard data={weather} locationName={location.name} unit={unit} />

              {weather.ai_summary && <AISummaryCard summary={weather.ai_summary} />}

              {/* Sunrise + Wind — side by side from sm up */}
              {today && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <SunriseSunsetCard today={today} />
                  <WindCompass direction={weather.current.wind_direction} speed={weather.current.wind_speed} />
                </div>
              )}

              {weather.daily?.length > 0 && <FarmSummaryCard daily={weather.daily} />}
              {weather.daily?.length > 0 && <ForecastChart daily={weather.daily} unit={unit} />}
              {weather.hourly?.length > 0 && <HourlyChart hourly={weather.hourly} />}
              {today && <WeatherAlertsPanel daily={weather.daily} />}
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-4 sm:space-y-6">
              {usage && <UsageMeter data={usage} />}
              <MultiLocationCompare unit={unit} onSelect={handleLocation} />
              <BookmarkedLocations current={location} onSelect={handleLocation} />
              <CropAdvisoryPanel weather={weather} />
              {today && <IrrigationCard weather={weather} />}
              {today && (
                <PestRiskPanel
                  tempMax={today.temp_max}
                  tempMin={today.temp_min}
                  humidity={humidity}
                  weeklyRain={weeklyRain}
                />
              )}
              <TreeAnalysisPanel />
            </div>

          </div>
        )}
      </main>

      <footer className="border-t mt-8 sm:mt-12 py-4 text-center text-xs text-muted-foreground">
        Powered by{" "}
        <a href="https://weather-ai.co" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          WeatherAI
        </a>{" "}
        · FarmPulse © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
