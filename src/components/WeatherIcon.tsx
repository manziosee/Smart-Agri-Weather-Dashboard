import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Wind,
  Cloudy,
  CloudMoon,
} from "lucide-react";

interface Props {
  code: string;
  className?: string;
  isNight?: boolean;
}

export function WeatherIcon({ code, className = "w-8 h-8", isNight = false }: Props) {
  const n = parseInt(code, 10);
  if (n === 0) return isNight ? <Moon className={className} /> : <Sun className={className} />;
  if (n <= 2) return isNight ? <CloudMoon className={className} /> : <Cloudy className={className} />;
  if (n === 3) return <Cloud className={className} />;
  if (n <= 48) return <Wind className={className} />;
  if (n <= 57) return <CloudDrizzle className={className} />;
  if (n <= 67) return <CloudRain className={className} />;
  if (n <= 77) return <CloudSnow className={className} />;
  if (n <= 82) return <CloudRain className={className} />;
  if (n <= 86) return <CloudSnow className={className} />;
  return <CloudLightning className={className} />;
}
