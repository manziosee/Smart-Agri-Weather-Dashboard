"use client";
import { Droplets, Wind, Thermometer, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherIcon } from "@/components/WeatherIcon";
import { formatTemp, getWindDirection } from "@/lib/utils";
import { wmoLabel } from "@/lib/wmo";
import type { WeatherResponse } from "@/lib/types";

interface Props {
  data: WeatherResponse;
  locationName: string;
  unit: "metric" | "imperial";
}

export function CurrentWeatherCard({ data, locationName, unit }: Props) {
  const { location, current, hourly } = data;
  const now = hourly[0];
  const isNight = (() => {
    const today = data.daily?.[0];
    if (!today) return false;
    const nowMs = Date.now();
    return nowMs < new Date(today.sunrise).getTime() || nowMs > new Date(today.sunset).getTime();
  })();

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-primary/80 to-primary p-4 sm:p-6 text-primary-foreground">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm opacity-90 mb-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{locationName}, {location.country}</span>
            </div>
            <div className="text-5xl sm:text-6xl font-bold leading-none mt-1">
              {formatTemp(current.temperature, unit)}
            </div>
            <div className="text-base sm:text-lg opacity-90 mt-1.5">{wmoLabel(current.condition_code)}</div>
            {now && (
              <div className="text-xs sm:text-sm opacity-75 mt-0.5">
                Feels like {formatTemp(now.feels_like, unit)}
              </div>
            )}
          </div>
          <WeatherIcon
            code={current.condition_code}
            className="w-14 h-14 sm:w-20 sm:h-20 opacity-90 shrink-0"
            isNight={isNight}
          />
        </div>
      </div>

      <CardContent className="pt-4 px-3 sm:px-6 pb-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {now && (
            <Stat icon={<Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />} label="Humidity" value={`${now.humidity}%`} />
          )}
          <Stat
            icon={<Wind className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />}
            label="Wind"
            value={`${Math.round(current.wind_speed)} m/s ${getWindDirection(current.wind_direction)}`}
          />
          {now && (
            <Stat
              icon={<Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />}
              label="UV Index"
              value={uvLabel(now.uv_index)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-muted/50 p-2 sm:p-2.5 min-w-0">
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground truncate">{label}</div>
        <div className="text-xs sm:text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
}

function uvLabel(uv: number) {
  if (uv <= 2) return `${uv} Low`;
  if (uv <= 5) return `${uv} Mod`;
  if (uv <= 7) return `${uv} High`;
  if (uv <= 10) return `${uv} V.High`;
  return `${uv} Ext`;
}
