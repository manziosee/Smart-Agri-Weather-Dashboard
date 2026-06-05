"use client";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
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
    date: formatDate(d.date).split(",")[0],
    High: Math.round(d.temp_max),
    Low: Math.round(d.temp_min),
    Rain: Math.round(d.precipitation_sum * 10) / 10,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {/* Scrollable icon strip on very small screens */}
        <div className="flex justify-between mb-4 overflow-x-auto gap-1 pb-1">
          {daily.slice(0, 7).map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-xs text-muted-foreground min-w-[36px] flex-1">
              <span className="truncate w-full text-center">{formatDate(d.date).split(",")[0]}</span>
              <WeatherIcon code={d.condition_code} className="w-4 h-4 sm:w-5 sm:h-5 text-primary" isNight={false} />
              <span className="font-medium text-foreground text-xs">{formatTemp(d.temp_max, unit)}</span>
              <span className="opacity-60 text-xs">{formatTemp(d.temp_min, unit)}</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 28, left: -22, bottom: 0 }}>
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
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              interval={0}
              tickFormatter={(v) => v.slice(0, 3)}
            />
            <YAxis
              yAxisId="temp"
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              unit="°"
              width={32}
            />
            <YAxis
              yAxisId="rain"
              orientation="right"
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--chart-2))"
              unit="mm"
              width={36}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "11px",
              }}
              formatter={(val: number, name: string) =>
                name === "Rain" ? [`${val} mm`, "Rain"] : [`${val}°`, name]
              }
            />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Area yAxisId="temp" type="monotone" dataKey="High" stroke="hsl(var(--chart-3))" fill="url(#highGrad)" strokeWidth={2} />
            <Area yAxisId="temp" type="monotone" dataKey="Low" stroke="hsl(var(--chart-2))" fill="url(#lowGrad)" strokeWidth={2} />
            <Bar yAxisId="rain" dataKey="Rain" fill="hsl(var(--chart-2))" opacity={0.5} radius={[3, 3, 0, 0]} barSize={10} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
