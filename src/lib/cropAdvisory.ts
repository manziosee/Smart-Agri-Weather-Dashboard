export interface CropProfile {
  name: string;
  emoji: string;
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  weeklyRainMin: number;
  weeklyRainMax: number;
}

export const CROPS: CropProfile[] = [
  { name: "Maize", emoji: "🌽", tempMin: 18, tempMax: 32, humidityMin: 50, humidityMax: 80, weeklyRainMin: 10, weeklyRainMax: 35 },
  { name: "Tea", emoji: "🍵", tempMin: 13, tempMax: 28, humidityMin: 70, humidityMax: 90, weeklyRainMin: 20, weeklyRainMax: 60 },
  { name: "Coffee", emoji: "☕", tempMin: 15, tempMax: 28, humidityMin: 60, humidityMax: 80, weeklyRainMin: 15, weeklyRainMax: 50 },
  { name: "Beans", emoji: "🫘", tempMin: 16, tempMax: 30, humidityMin: 50, humidityMax: 75, weeklyRainMin: 8, weeklyRainMax: 30 },
  { name: "Banana", emoji: "🍌", tempMin: 20, tempMax: 35, humidityMin: 60, humidityMax: 85, weeklyRainMin: 20, weeklyRainMax: 50 },
  { name: "Sorghum", emoji: "🌾", tempMin: 22, tempMax: 38, humidityMin: 30, humidityMax: 70, weeklyRainMin: 5, weeklyRainMax: 25 },
  { name: "Potato", emoji: "🥔", tempMin: 10, tempMax: 24, humidityMin: 60, humidityMax: 80, weeklyRainMin: 10, weeklyRainMax: 30 },
  { name: "Rice", emoji: "🌾", tempMin: 22, tempMax: 35, humidityMin: 70, humidityMax: 95, weeklyRainMin: 30, weeklyRainMax: 80 },
];

export type CropStatus = "ideal" | "marginal" | "unsuitable";

export interface CropAdvice {
  crop: CropProfile;
  status: CropStatus;
  notes: string[];
}

export function assessCrops(
  tempMax: number,
  tempMin: number,
  humidity: number,
  weeklyRain: number
): CropAdvice[] {
  return CROPS.map((crop) => {
    const notes: string[] = [];
    let strikes = 0;

    if (tempMax > crop.tempMax) { notes.push(`Too hot (max ${tempMax}°C)`); strikes++; }
    if (tempMin < crop.tempMin) { notes.push(`Too cold (min ${tempMin}°C)`); strikes++; }
    if (humidity < crop.humidityMin) { notes.push(`Low humidity (${humidity}%)`); strikes++; }
    if (humidity > crop.humidityMax) { notes.push(`High humidity (${humidity}%)`); strikes++; }
    if (weeklyRain < crop.weeklyRainMin) { notes.push(`Insufficient rain (${weeklyRain} mm)`); strikes++; }
    if (weeklyRain > crop.weeklyRainMax) { notes.push(`Excess rain (${weeklyRain} mm)`); strikes++; }

    const status: CropStatus = strikes === 0 ? "ideal" : strikes <= 2 ? "marginal" : "unsuitable";
    if (notes.length === 0) notes.push("Conditions are ideal");

    return { crop, status, notes };
  }).sort((a, b) => {
    const order = { ideal: 0, marginal: 1, unsuitable: 2 };
    return order[a.status] - order[b.status];
  });
}
