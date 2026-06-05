"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind } from "lucide-react";
import { getWindDirection } from "@/lib/utils";

interface Props {
  direction: number;
  speed: number;
}

const CARDINALS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export function WindCompass({ direction, speed }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wind className="w-4 h-4 text-primary" />
          Wind
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <circle cx="60" cy="60" r="54" className="fill-muted stroke-border" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="4" className="fill-primary" />

            {CARDINALS.map((label, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const r = 44;
              const x = 60 + r * Math.sin(angle);
              const y = 60 - r * Math.cos(angle);
              return (
                <text
                  key={label}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={label.length === 1 ? "9" : "7"}
                  fontWeight={label.length === 1 ? "600" : "400"}
                  className="fill-foreground"
                >
                  {label}
                </text>
              );
            })}

            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const r1 = deg % 90 === 0 ? 50 : 52;
              const r2 = 56;
              return (
                <line
                  key={deg}
                  x1={60 + r1 * Math.sin(rad)}
                  y1={60 - r1 * Math.cos(rad)}
                  x2={60 + r2 * Math.sin(rad)}
                  y2={60 - r2 * Math.cos(rad)}
                  className="stroke-border"
                  strokeWidth={deg % 90 === 0 ? "1.5" : "1"}
                />
              );
            })}

            <g transform={`rotate(${direction}, 60, 60)`}>
              <polygon
                points="60,18 64,58 60,52 56,58"
                className="fill-primary"
              />
              <polygon
                points="60,102 64,62 60,68 56,62"
                className="fill-muted-foreground"
                opacity="0.5"
              />
            </g>
          </svg>
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold">{Math.round(speed)} <span className="text-sm font-normal text-muted-foreground">m/s</span></p>
          <p className="text-sm text-muted-foreground">{getWindDirection(direction)} ({direction}°)</p>
        </div>
      </CardContent>
    </Card>
  );
}
