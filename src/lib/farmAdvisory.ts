import type { DailyEntry } from "@/lib/types";

export type FarmScore = "good" | "caution" | "poor";

export interface DayScore {
  date: string;
  score: FarmScore;
  reasons: string[];
}

export function scoreFarmingDay(day: DailyEntry): DayScore {
  const reasons: string[] = [];
  let penalties = 0;

  if (day.precipitation_probability >= 70) {
    penalties += 2;
    reasons.push(`High rain chance (${day.precipitation_probability}%)`);
  } else if (day.precipitation_probability >= 40) {
    penalties += 1;
    reasons.push(`Moderate rain chance (${day.precipitation_probability}%)`);
  }

  if (day.wind_max >= 40) {
    penalties += 2;
    reasons.push(`Strong winds (${day.wind_max} km/h)`);
  } else if (day.wind_max >= 25) {
    penalties += 1;
    reasons.push(`Moderate winds (${day.wind_max} km/h)`);
  }

  if (day.temp_max >= 35) {
    penalties += 1;
    reasons.push(`High heat (${day.temp_max}°C)`);
  }

  if (day.precipitation_sum >= 15) {
    penalties += 2;
    reasons.push(`Heavy rainfall expected (${day.precipitation_sum} mm)`);
  }

  if (reasons.length === 0) reasons.push("Ideal conditions");

  const score: FarmScore = penalties === 0 ? "good" : penalties <= 2 ? "caution" : "poor";
  return { date: day.date, score, reasons };
}

export function weeklyRainTotal(daily: DailyEntry[]): number {
  return Math.round(daily.slice(0, 7).reduce((sum, d) => sum + d.precipitation_sum, 0) * 10) / 10;
}
