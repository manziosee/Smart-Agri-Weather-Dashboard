export interface CurrentWeather {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
    timezone: string;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    visibility: number;
    uv_index: number;
    wind_speed: number;
    wind_deg: number;
    weather: { id: number; main: string; description: string; icon: string }[];
    dt: number;
  };
  ai_summary?: string;
}

export interface ForecastDay {
  date: string;
  temp_min: number;
  temp_max: number;
  humidity: number;
  precipitation: number;
  weather: { id: number; main: string; description: string; icon: string }[];
  wind_speed: number;
  uv_index: number;
}

export interface WeatherForecast {
  location: CurrentWeather["location"];
  forecast: ForecastDay[];
  ai_summary?: string;
}

export interface HourlyPoint {
  dt: number;
  time: string;
  temp: number;
  feels_like: number;
  humidity: number;
  precipitation: number;
  wind_speed: number;
  weather: { id: number; main: string; description: string; icon: string }[];
}

export interface HourlyForecast {
  location: CurrentWeather["location"];
  hourly: HourlyPoint[];
}

export interface UsageData {
  plan: string;
  requests_used: number;
  requests_limit: number;
  ai_requests_used: number;
  ai_requests_limit: number;
  period_start: string;
  period_end: string;
}

export interface TreeAnalysis {
  analysis_id: string;
  timestamp: string;
  farmer_id?: string;
  county?: string;
  location?: string;
  land_acres?: number;
  total_tree_count: number;
  tree_density_per_acre?: number;
  confidence_score: number;
  canopy_coverage_pct: number;
  tree_health: {
    healthy: number;
    needs_care: number;
    needs_replacement: number;
  };
  low_confidence: boolean;
  tree_species_guess?: string;
  observations: string[];
  recommendations: string[];
  original_image_url: string;
  overlay_image_url: string;
}
