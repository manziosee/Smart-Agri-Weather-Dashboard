"use client";
import { Bug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  tempMax: number;
  tempMin: number;
  humidity: number;
  weeklyRain: number;
}

type RiskLevel = "high" | "medium" | "low";

interface PestRisk {
  crop: string;
  emoji: string;
  pest: string;
  risk: RiskLevel;
  reason: string;
}

const RISK_BADGE: Record<RiskLevel, "destructive" | "warning" | "success"> = {
  high: "destructive",
  medium: "warning",
  low: "success",
};

function evaluateRisks(tempMax: number, tempMin: number, humidity: number, weeklyRain: number): PestRisk[] {
  const risks: PestRisk[] = [];

  // Coffee Leaf Rust: 18–28°C + humidity > 75% + rain > 15mm/wk
  {
    const tempOk = tempMax >= 18 && tempMax <= 30;
    const humOk = humidity >= 75;
    const rainOk = weeklyRain >= 15;
    const score = [tempOk, humOk, rainOk].filter(Boolean).length;
    risks.push({
      crop: "Coffee", emoji: "☕", pest: "Leaf Rust",
      risk: score === 3 ? "high" : score >= 2 ? "medium" : "low",
      reason: score === 3 ? "Optimal conditions for rust spread"
        : score >= 2 ? "Conditions partially favour rust"
        : "Low rust risk",
    });
  }

  // Maize Stalk Borer: temp > 25°C + humidity < 60%
  {
    const tempOk = tempMax > 25;
    const humOk = humidity < 60;
    const score = [tempOk, humOk].filter(Boolean).length;
    risks.push({
      crop: "Maize", emoji: "🌽", pest: "Stalk Borer",
      risk: score === 2 ? "high" : score === 1 ? "medium" : "low",
      reason: score === 2 ? "Hot & dry — high borer activity"
        : score === 1 ? "Watch for early infestation"
        : "Low borer risk",
    });
  }

  // Potato Late Blight: temp 10–20°C + humidity > 90% + rain > 20mm/wk
  {
    const tempOk = tempMax >= 10 && tempMax <= 22;
    const humOk = humidity >= 85;
    const rainOk = weeklyRain >= 20;
    const score = [tempOk, humOk, rainOk].filter(Boolean).length;
    risks.push({
      crop: "Potato", emoji: "🥔", pest: "Late Blight",
      risk: score === 3 ? "high" : score >= 2 ? "medium" : "low",
      reason: score === 3 ? "Classic blight weather — apply fungicide"
        : score >= 2 ? "Monitor closely for blight signs"
        : "Low blight risk",
    });
  }

  // Tea Blister Blight: temp 18–25°C + humidity > 80% + heavy rain
  {
    const tempOk = tempMax >= 18 && tempMax <= 26;
    const humOk = humidity >= 80;
    const rainOk = weeklyRain >= 25;
    const score = [tempOk, humOk, rainOk].filter(Boolean).length;
    risks.push({
      crop: "Tea", emoji: "🍵", pest: "Blister Blight",
      risk: score === 3 ? "high" : score >= 2 ? "medium" : "low",
      reason: score === 3 ? "High blister blight risk — treat immediately"
        : score >= 2 ? "Elevated risk, inspect new shoots"
        : "Low blister blight risk",
    });
  }

  // Banana Fusarium Wilt: temp > 26°C + dry soil (rain < 10mm)
  {
    const tempOk = tempMax > 26;
    const dryOk = weeklyRain < 10;
    const score = [tempOk, dryOk].filter(Boolean).length;
    risks.push({
      crop: "Banana", emoji: "🍌", pest: "Fusarium Wilt",
      risk: score === 2 ? "high" : score === 1 ? "medium" : "low",
      reason: score === 2 ? "Hot & dry — wilt risk elevated"
        : score === 1 ? "Moderate risk, ensure irrigation"
        : "Low wilt risk",
    });
  }

  return risks.sort((a, b) => {
    const order: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };
    return order[a.risk] - order[b.risk];
  });
}

export function PestRiskPanel({ tempMax, tempMin, humidity, weeklyRain }: Props) {
  const risks = evaluateRisks(tempMax, tempMin, humidity, weeklyRain);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bug className="w-4 h-4 text-primary" />
          Pest & Disease Risk
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-3">
          Based on {tempMin}–{tempMax}°C · {humidity}% humidity · {weeklyRain} mm/week
        </p>
        <div className="space-y-2.5">
          {risks.map((r) => (
            <div key={r.crop} className="flex items-start gap-2.5">
              <span className="text-base mt-0.5">{r.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{r.crop}</span>
                  <span className="text-xs text-muted-foreground">{r.pest}</span>
                  <Badge variant={RISK_BADGE[r.risk]} className="text-xs py-0 capitalize ml-auto">
                    {r.risk} risk
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{r.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
