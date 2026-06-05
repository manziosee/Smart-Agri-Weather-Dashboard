"use client";
import { Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { assessCrops, type CropStatus } from "@/lib/cropAdvisory";
import { weeklyRainTotal } from "@/lib/farmAdvisory";
import type { WeatherResponse } from "@/lib/types";

interface Props {
  weather: WeatherResponse;
}

const STATUS_STYLE: Record<CropStatus, { badge: "success" | "warning" | "destructive"; label: string }> = {
  ideal: { badge: "success", label: "Ideal" },
  marginal: { badge: "warning", label: "Marginal" },
  unsuitable: { badge: "destructive", label: "Unsuitable" },
};

export function CropAdvisoryPanel({ weather }: Props) {
  const today = weather.daily[0];
  const humidity = weather.hourly[0]?.humidity ?? 60;
  const weeklyRain = weeklyRainTotal(weather.daily);

  const advice = assessCrops(today.temp_max, today.temp_min, humidity, weeklyRain);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sprout className="w-4 h-4 text-primary" />
          Crop Advisory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          Based on {today.temp_min}–{today.temp_max}°C · {humidity}% humidity · {weeklyRain} mm/week
        </p>
        <div className="space-y-2">
          {advice.map(({ crop, status, notes }) => {
            const s = STATUS_STYLE[status];
            return (
              <div key={crop.name} className="flex items-start gap-2 py-1">
                <span className="text-lg leading-none mt-0.5">{crop.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{crop.name}</span>
                    <Badge variant={s.badge} className="text-xs py-0">{s.label}</Badge>
                  </div>
                  {status !== "ideal" && (
                    <p className="text-xs text-muted-foreground mt-0.5">{notes.join(" · ")}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
