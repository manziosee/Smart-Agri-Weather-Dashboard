"use client";
import { Sunrise, Sunset, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyEntry } from "@/lib/types";

interface Props {
  today: DailyEntry;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function daylightHours(rise: string, set: string) {
  const diff = new Date(set).getTime() - new Date(rise).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

function progressPct(rise: string, set: string) {
  const now = Date.now();
  const start = new Date(rise).getTime();
  const end = new Date(set).getTime();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

export function SunriseSunsetCard({ today }: Props) {
  const pct = progressPct(today.sunrise, today.sunset);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="w-4 h-4 text-primary" />
          Daylight
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sunrise className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-xs text-muted-foreground">Sunrise</p>
              <p className="font-semibold text-sm">{formatTime(today.sunrise)}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Daylight</p>
            <p className="font-semibold text-sm text-primary">
              {daylightHours(today.sunrise, today.sunset)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Sunset</p>
              <p className="font-semibold text-sm">{formatTime(today.sunset)}</p>
            </div>
            <Sunset className="w-5 h-5 text-orange-500" />
          </div>
        </div>

        <div className="relative h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
          {pct > 0 && pct < 100 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-yellow-400 border-2 border-white shadow"
              style={{ left: `${pct}%` }}
            />
          )}
        </div>
        <p className="text-xs text-center text-muted-foreground">
          {pct === 0 ? "Before sunrise" : pct === 100 ? "After sunset" : `${pct}% through daylight`}
        </p>
      </CardContent>
    </Card>
  );
}
