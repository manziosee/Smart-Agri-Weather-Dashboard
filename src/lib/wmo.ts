export const WMO_LABELS: Record<string, string> = {
  "0": "Clear sky",
  "1": "Mainly clear",
  "2": "Partly cloudy",
  "3": "Overcast",
  "45": "Fog",
  "48": "Freezing fog",
  "51": "Light drizzle",
  "53": "Drizzle",
  "55": "Heavy drizzle",
  "61": "Light rain",
  "63": "Rain",
  "65": "Heavy rain",
  "71": "Light snow",
  "73": "Snow",
  "75": "Heavy snow",
  "77": "Snow grains",
  "80": "Rain showers",
  "81": "Moderate showers",
  "82": "Heavy showers",
  "85": "Snow showers",
  "86": "Heavy snow showers",
  "95": "Thunderstorm",
  "96": "Thunderstorm w/ hail",
  "99": "Heavy thunderstorm",
};

export function wmoLabel(code: string): string {
  return WMO_LABELS[code] ?? "Unknown";
}
