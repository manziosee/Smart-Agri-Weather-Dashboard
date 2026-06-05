"use client";
import { Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { weeklyRainTotal } from "@/lib/farmAdvisory";
import type { WeatherResponse } from "@/lib/types";

interface Props {
  weather: WeatherResponse;
}

type Rec = "irrigate" | "skip" | "monitor";

interface CropIrrigation {
  name: string;
  emoji: string;
  needsMm: number;
  received: number;
  recommendation: Rec;
  reason: string;
}

// Approximate weekly ET (evapotranspiration) demand per crop in mm
const CROP_ET: { name: string; emoji: string; weeklyEtMm: number }[] = [
  { name: "Maize", emoji: "🌽", weeklyEtMm: 30 },
  { name: "Tea", emoji: "🍵", weeklyEtMm: 35 },
  { name: "Coffee", emoji: "☕", weeklyEtMm: 28 },
  { name: "Beans", emoji: "🫘", weeklyEtMm: 22 },
  { name: "Banana", emoji: "🍌", weeklyEtMm: 40 },
  { name: "Potato", emoji: "🥔", weeklyEtMm: 26 },
];

function getRecommendation(needsMm: number, received: number, tempMax: number): { rec: Rec; reason: string } {
  const deficit = needsMm - received;
  if (tempMax > 34) return { rec: "irrigate", reason: `Heat stress — add ${Math.max(0, deficit).toFixed(0)} mm` };
  if (deficit > 10) return { rec: "irrigate", reason: `${deficit.toFixed(0)} mm deficit this week` };
  if (deficit < -5) return { rec: "skip", reason: `${Math.abs(deficit).toFixed(0)} mm excess rain` };
  return { rec: "monitor", reason: `Within ±5 mm of demand` };
}

const REC_STYLE: Record<Rec, { badge: "destructive" | "warning" | "success"; label: string }> = {
  irrigate: { badge: "destructive", label: "Irrigate" },
  monitor: { badge: "warning", label: "Monitor" },
  skip: { badge: "success", label: "Skip" },
};

export function IrrigationCard({ weather }: Props) {
  const weeklyRain = weeklyRainTotal(weather.daily);
  const tempMax = weather.daily[0]?.temp_max ?? 25;
  const humidity = weather.hourly[0]?.humidity ?? 60;
  // Humidity adjustment: high humidity reduces ET demand by up to 20%
  const humidityFactor = 1 - Math.max(0, (humidity - 50) / 200);

  const crops: CropIrrigation[] = CROP_ET.map((c) => {
    const needsMm = Math.round(c.weeklyEtMm * humidityFactor);
    const { rec, reason } = getRecommendation(needsMm, weeklyRain, tempMax);
    return { name: c.name, emoji: c.emoji, needsMm, received: weeklyRain, recommendation: rec, reason };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Droplets className="w-4 h-4 text-blue-500" />
          Irrigation Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          Forecast rain: <span className="font-medium text-foreground">{weeklyRain} mm/week</span>
          {" · "}Humidity: <span className="font-medium text-foreground">{humidity}%</span>
        </p>
        <div className="space-y-2.5">
          {crops.map((c) => {
            const s = REC_STYLE[c.recommendation];
            return (
              <div key={c.name} className="flex items-start gap-2.5">
                <span className="text-base mt-0.5">{c.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{c.name}</span>
                    <Badge variant={s.badge} className="text-xs py-0">{s.label}</Badge>
                    <span className="text-xs text-muted-foreground">need {c.needsMm} mm</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.reason}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
