"use client";
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

export function HourlyChart({ hourly }: Props) {
  const data = hourly.slice(0, 24).map((h) => ({
    time: formatTime(h.time),
    Temp: Math.round(h.temperature),
    Rain: Math.round(h.precipitation_probability),
  }));

  const tooltipStyle = {
    contentStyle: {
      background: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      fontSize: "12px",
    },
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Hourly — Today</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Temperature (°)</p>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={3} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" unit="°" />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}°`, "Temp"]} />
              <Line type="monotone" dataKey="Temp" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Rain probability (%)</p>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={data} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={3} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" unit="%" />
              <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, "Rain chance"]} />
              <Bar dataKey="Rain" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
