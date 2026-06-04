"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "@/components/WeatherIcon";
import { formatDate, formatTemp } from "@/lib/utils";
import type { DailyEntry } from "@/lib/types";

interface Props {
  daily: DailyEntry[];
  unit: "metric" | "imperial";
}

export function ForecastChart({ daily, unit }: Props) {
  const chartData = daily.map((d) => ({
    date: formatDate(d.date),
    High: Math.round(d.temp_max),
    Low: Math.round(d.temp_min),
    Rain: Math.round(d.precipitation_sum * 10) / 10,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around mb-4">
          {daily.slice(0, 7).map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
              <span>{formatDate(d.date).split(",")[0]}</span>
              <WeatherIcon code={d.condition_code} className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">{formatTemp(d.temp_max, unit)}</span>
              <span className="opacity-60">{formatTemp(d.temp_min, unit)}</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" unit="°" />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(val: number, name: string) => [name === "Rain" ? `${val} mm` : `${val}°`, name]}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Area type="monotone" dataKey="High" stroke="hsl(var(--chart-3))" fill="url(#highGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="Low" stroke="hsl(var(--chart-2))" fill="url(#lowGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
