"use client";
import { Tractor, Droplets, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { scoreFarmingDay, weeklyRainTotal, type FarmScore } from "@/lib/farmAdvisory";
import { formatDate } from "@/lib/utils";
import type { DailyEntry } from "@/lib/types";

interface Props {
  daily: DailyEntry[];
}

const SCORE_CONFIG: Record<FarmScore, { label: string; icon: React.ReactNode; badge: "success" | "warning" | "destructive" }> = {
  good: { label: "Good day", icon: <CheckCircle2 className="w-4 h-4" />, badge: "success" },
  caution: { label: "Use caution", icon: <AlertTriangle className="w-4 h-4" />, badge: "warning" },
  poor: { label: "Poor day", icon: <XCircle className="w-4 h-4" />, badge: "destructive" },
};

export function FarmSummaryCard({ daily }: Props) {
  const scores = daily.slice(0, 7).map(scoreFarmingDay);
  const rainTotal = weeklyRainTotal(daily);
  const goodDays = scores.filter((s) => s.score === "good").length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Tractor className="w-4 h-4 text-primary" />
          Farm Outlook
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary">{goodDays}</div>
            <div className="text-xs text-muted-foreground">Good farming days</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-2xl font-bold">{rainTotal}</span>
              <span className="text-sm text-muted-foreground">mm</span>
            </div>
            <div className="text-xs text-muted-foreground">Weekly rain total</div>
          </div>
        </div>

        <div className="space-y-2">
          {scores.map((s, i) => {
            const cfg = SCORE_CONFIG[s.score];
            return (
              <div key={i} className="flex items-start gap-2">
                <Badge variant={cfg.badge} className="flex items-center gap-1 shrink-0 mt-0.5">
                  {cfg.icon}
                  {cfg.label}
                </Badge>
                <div className="min-w-0">
                  <span className="text-xs font-medium">{formatDate(s.date)}</span>
                  <span className="text-xs text-muted-foreground ml-2">{s.reasons.join(" · ")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
