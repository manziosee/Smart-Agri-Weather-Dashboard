export interface ApiLocation {
  lat: number;
  lon: number;
  timezone: string;
  country: string;
}

export interface CurrentCondition {
  time: string;
  temperature: number;
  wind_speed: number;
  wind_direction: number;
  condition_code: string;
  icon: string;
}

export interface HourlyEntry {
  time: string;
  temperature: number;
  precipitation_probability: number;
  wind_speed: number;
  condition_code: string;
  icon: string;
  humidity: number;
  feels_like: number;
  wind_gust: number;
  uv_index: number;
}

export interface DailyEntry {
  date: string;
  temp_min: number;
  temp_max: number;
  precipitation_sum: number;
  precipitation_probability: number;
  sunrise: string;
  sunset: string;
  condition_code: string;
  icon: string;
  wind_max: number;
}

export interface WeatherResponse {
  location: ApiLocation;
  current: CurrentCondition;
  hourly: HourlyEntry[];
  daily: DailyEntry[];
  ai_summary?: string;
}

export interface WeatherAlert {
  id: string;
  label: string;
  field: "precipitation_sum" | "temp_max" | "temp_min" | "wind_max" | "precipitation_probability";
  operator: "gt" | "lt";
  threshold: number;
  unit: string;
}

export interface IrrigationAdvice {
  cropName: string;
  emoji: string;
  needsMm: number;
  recommendation: "irrigate" | "skip" | "monitor";
  reason: string;
}

export interface UsageData {
  plan: string;
  period: {
    start: string;
    end: string;
    requestCount: number;
    aiRequestCount: number;
  };
  limits: {
    requests: number;
    aiRequests: number;
    maxDays: number;
    webhooks: boolean;
    sms: boolean;
  };
  remaining: {
    requests: number;
    aiRequests: number;
  };
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
