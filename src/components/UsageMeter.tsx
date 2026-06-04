"use client";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { UsageData } from "@/lib/types";

interface Props {
  data: UsageData;
}

export function UsageMeter({ data }: Props) {
  const reqUsed = data.period.requestCount;
  const reqLimit = data.limits.requests;
  const aiUsed = data.period.aiRequestCount;
  const aiLimit = data.limits.aiRequests;

  const reqPct = Math.min(100, Math.round((reqUsed / reqLimit) * 100));
  const aiPct = Math.min(100, Math.round((aiUsed / aiLimit) * 100));

  const planColor =
    data.plan === "scale" ? "default" : data.plan === "pro" ? "secondary" : "outline";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            API Usage
          </span>
          <Badge variant={planColor} className="capitalize">{data.plan}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <UsageStat label="Requests" used={reqUsed} limit={reqLimit} pct={reqPct} />
        <UsageStat label="AI Requests" used={aiUsed} limit={aiLimit} pct={aiPct} />
        <p className="text-xs text-muted-foreground">
          Resets {new Date(data.period.end).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}

function UsageStat({
  label,
  used,
  limit,
  pct,
}: {
  label: string;
  used: number;
  limit: number;
  pct: number;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {used.toLocaleString()} / {limit.toLocaleString()}
          <span className="text-muted-foreground ml-1">({pct}%)</span>
        </span>
      </div>
      <Progress
        value={pct}
        className={pct > 80 ? "bg-destructive/20 [&>div]:bg-destructive" : ""}
      />
    </div>
  );
}
