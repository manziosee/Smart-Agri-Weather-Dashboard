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

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-primary/80 to-primary p-6 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-sm opacity-90 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{locationName}, {location.country}</span>
            </div>
            <div className="text-6xl font-bold">{formatTemp(current.temperature, unit)}</div>
            <div className="text-lg opacity-90 mt-1">{wmoLabel(current.condition_code)}</div>
            {now && (
              <div className="text-sm opacity-75 mt-0.5">
                Feels like {formatTemp(now.feels_like, unit)}
              </div>
            )}
          </div>
          <WeatherIcon code={current.condition_code} className="w-20 h-20 opacity-90" />
        </div>
      </div>

      <CardContent className="pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {now && (
            <Stat icon={<Droplets className="w-4 h-4 text-blue-500" />} label="Humidity" value={`${now.humidity}%`} />
          )}
          <Stat icon={<Wind className="w-4 h-4 text-slate-500" />} label="Wind" value={`${Math.round(current.wind_speed)} m/s ${getWindDirection(current.wind_direction)}`} />
          {now && (
            <Stat icon={<Thermometer className="w-4 h-4 text-orange-500" />} label="UV Index" value={uvLabel(now.uv_index)} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
      {icon}
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function uvLabel(uv: number) {
  if (uv <= 2) return `${uv} Low`;
  if (uv <= 5) return `${uv} Moderate`;
  if (uv <= 7) return `${uv} High`;
  if (uv <= 10) return `${uv} Very High`;
  return `${uv} Extreme`;
}
