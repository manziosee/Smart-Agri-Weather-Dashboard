import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Wind,
  Eye,
  Cloudy,
} from "lucide-react";

interface Props {
  weatherId: number;
  className?: string;
}

export function WeatherIcon({ weatherId, className = "w-8 h-8" }: Props) {
  // WMO / OpenWeather condition code ranges
  if (weatherId >= 200 && weatherId < 300) return <CloudLightning className={className} />;
  if (weatherId >= 300 && weatherId < 400) return <CloudDrizzle className={className} />;
  if (weatherId >= 500 && weatherId < 600) return <CloudRain className={className} />;
  if (weatherId >= 600 && weatherId < 700) return <CloudSnow className={className} />;
  if (weatherId >= 700 && weatherId < 800) return <Wind className={className} />;
  if (weatherId === 800) return <Sun className={className} />;
  if (weatherId === 801) return <Cloudy className={className} />;
  if (weatherId >= 802) return <Cloud className={className} />;
  return <Eye className={className} />;
}
