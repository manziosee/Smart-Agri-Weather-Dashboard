import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Wind,
  Cloudy,
} from "lucide-react";

interface Props {
  code: string;
  className?: string;
}

export function WeatherIcon({ code, className = "w-8 h-8" }: Props) {
  const n = parseInt(code, 10);
  if (n === 0) return <Sun className={className} />;
  if (n <= 2) return <Cloudy className={className} />;
  if (n === 3) return <Cloud className={className} />;
  if (n <= 48) return <Wind className={className} />;
  if (n <= 57) return <CloudDrizzle className={className} />;
  if (n <= 67) return <CloudRain className={className} />;
  if (n <= 77) return <CloudSnow className={className} />;
  if (n <= 82) return <CloudRain className={className} />;
  if (n <= 86) return <CloudSnow className={className} />;
  return <CloudLightning className={className} />;
}
