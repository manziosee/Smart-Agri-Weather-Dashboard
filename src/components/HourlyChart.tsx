"use client";
import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/lib/utils";
import type { HourlyEntry } from "@/lib/types";

interface Props {
  hourly: HourlyEntry[];
}

type Tab = "temp" | "rain" | "feels" | "gust";

const TABS: { id: Tab; label: string }[] = [
  { id: "temp", label: "Temp" },
  { id: "rain", label: "Rain %" },
  { id: "feels", label: "Feels Like" },
  { id: "gust", label: "Wind Gust" },
];

const tooltipStyle = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "11px",
  },
};

export function HourlyChart({ hourly }: Props) {
  const [tab, setTab] = useState<Tab>("temp");

  const data = hourly.slice(0, 24).map((h) => ({
    time: formatTime(h.time),
    Temp: Math.round(h.temperature),
    Rain: Math.round(h.precipitation_probability),
    Feels: Math.round(h.feels_like),
    Gust: Math.round(h.wind_gust),
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Hourly — Today</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-3 sm:px-6">
        {/* 2x2 grid on mobile, single row on sm+ */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors text-center ${
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "rain" ? (
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 9 }} interval={3} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" unit="%" domain={[0, 100]} width={30} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, "Rain chance"]} />
              <Bar dataKey="Rain" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={data} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 9 }} interval={3} stroke="hsl(var(--muted-foreground))" />
              <YAxis
                tick={{ fontSize: 9 }}
                stroke="hsl(var(--muted-foreground))"
                unit={tab === "gust" ? "" : "°"}
                width={30}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(v: number) => [
                  tab === "gust" ? `${v} m/s` : `${v}°`,
                  tab === "temp" ? "Temp" : tab === "feels" ? "Feels Like" : "Wind Gust",
                ]}
              />
              <Line
                type="monotone"
                dataKey={tab === "temp" ? "Temp" : tab === "feels" ? "Feels" : "Gust"}
                stroke={
                  tab === "temp"
                    ? "hsl(var(--chart-3))"
                    : tab === "feels"
                    ? "hsl(var(--chart-5))"
                    : "hsl(var(--chart-1))"
                }
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
