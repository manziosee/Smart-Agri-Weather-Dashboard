"use client";
import { Droplets, Wind, Eye, Gauge, Thermometer, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeatherIcon } from "@/components/WeatherIcon";
import { formatTemp, getWindDirection } from "@/lib/utils";
import type { CurrentWeather } from "@/lib/types";

interface Props {
  data: CurrentWeather;
  unit: "metric" | "imperial";
}

export function CurrentWeatherCard({ data, unit }: Props) {
  const { location, current } = data;
  const condition = current.weather?.[0];

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-primary/80 to-primary p-6 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-sm opacity-90 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{location.name}, {location.country}</span>
            </div>
            <div className="text-6xl font-bold">{formatTemp(current.temp, unit)}</div>
            <div className="text-lg opacity-90 mt-1 capitalize">
              {condition?.description ?? "—"}
            </div>
            <div className="text-sm opacity-75 mt-0.5">
              Feels like {formatTemp(current.feels_like, unit)}
            </div>
          </div>
          <WeatherIcon
            weatherId={condition?.id ?? 800}
            className="w-20 h-20 opacity-90"
          />
        </div>
      </div>

      <CardContent className="pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Stat icon={<Droplets className="w-4 h-4 text-blue-500" />} label="Humidity" value={`${current.humidity}%`} />
          <Stat icon={<Wind className="w-4 h-4 text-slate-500" />} label="Wind" value={`${Math.round(current.wind_speed)} m/s ${getWindDirection(current.wind_deg)}`} />
          <Stat icon={<Gauge className="w-4 h-4 text-purple-500" />} label="Pressure" value={`${current.pressure} hPa`} />
          <Stat icon={<Eye className="w-4 h-4 text-cyan-500" />} label="Visibility" value={`${(current.visibility / 1000).toFixed(1)} km`} />
          <Stat icon={<Thermometer className="w-4 h-4 text-orange-500" />} label="UV Index" value={uvLabel(current.uv_index)} />
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
