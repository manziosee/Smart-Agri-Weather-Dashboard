# FarmPulse — Smart Agri-Weather Dashboard

Smart Agri-Weather Dashboard combining real-time weather intelligence with AI-powered farm analytics, built on the [WeatherAI API](https://weather-ai.co).

## Features

| Feature | API Endpoint |
|---|---|
| Auto-detect location on first load | Browser Geolocation / `/v1/ip-lookup` |
| Location search by city/name | `/v1/weather-geo` |
| Current conditions + wind compass | `/v1/weather` |
| Sunrise / sunset daylight strip | `/v1/weather` (`daily[0]`) |
| Interactive 7-day forecast chart | `/v1/weather` |
| Hourly temperature & rain probability | `/v1/weather` |
| Farm outlook — good/caution/poor days | Forecast rules engine |
| Weekly rain total | Summed from `daily[*].precipitation_sum` |
| Crop advisory panel (8 crops) | Local rules, no extra API call |
| Farm image tree-count & health analysis | `/v1/trees/analyze` |
| Tree analysis history (up to 5) | `localStorage` |
| Saved farm locations (up to 5) | `localStorage` |
| Share weather card as PNG / WhatsApp | `html-to-image` |
| API usage meter | `/v1/usage` |
| Dark mode & °C / °F toggle | Client-side |

## Tech Stack

- **Next.js 14** (App Router, TypeScript) — server-side API proxies keep the key out of the browser
- **Tailwind CSS** — utility-first styling with light/dark mode
- **Recharts** — temperature and precipitation charts
- **Radix UI** — accessible primitive components
- **html-to-image** — share-as-PNG for WhatsApp / field workers
- **Vercel** — recommended deployment platform

## Setup

### 1. Clone & install

```bash
git clone https://github.com/manziosee/Smart-Agri-Weather-Dashboard.git
cd Smart-Agri-Weather-Dashboard
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your WeatherAI key:

```env
WEATHER_AI_API_KEY=wai_your_actual_key_here
WEATHER_AI_BASE_URL=https://api.weather-ai.co
```

Get your key at [weather-ai.co/dashboard](https://weather-ai.co/dashboard) → API Keys.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1. Push this repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in the Vercel dashboard:
   - `WEATHER_AI_API_KEY` = your key
   - `WEATHER_AI_BASE_URL` = `https://api.weather-ai.co`
4. Deploy — Vercel auto-detects Next.js

## Architecture

```
src/
├── app/
│   ├── api/                    # Server-side proxy routes (key never leaves server)
│   │   ├── weather/
│   │   ├── geo/
│   │   ├── usage/
│   │   ├── ip-lookup/
│   │   └── trees/analyze/
│   ├── layout.tsx
│   ├── page.tsx                # Dashboard — state, layout, data fetching
│   └── globals.css
├── components/
│   ├── ui/                     # Primitive components (button, card, badge, progress)
│   ├── CurrentWeatherCard.tsx
│   ├── SunriseSunsetCard.tsx
│   ├── WindCompass.tsx
│   ├── ForecastChart.tsx
│   ├── HourlyChart.tsx
│   ├── FarmSummaryCard.tsx     # Good/caution/poor day badges + weekly rain total
│   ├── CropAdvisoryPanel.tsx   # 8-crop suitability based on current conditions
│   ├── TreeAnalysisPanel.tsx   # Image upload + analysis history
│   ├── BookmarkedLocations.tsx # Save up to 5 farm locations
│   ├── ShareButton.tsx         # Export weather card as PNG
│   ├── UsageMeter.tsx
│   └── LocationSearch.tsx
├── hooks/
│   └── useAutoLocation.ts      # Geolocation on first load
└── lib/
    ├── types.ts                # TypeScript interfaces matching real API shape
    ├── utils.ts                # Formatting helpers
    ├── wmo.ts                  # WMO condition code → label map
    ├── farmAdvisory.ts         # Rules engine for daily farm scores
    └── cropAdvisory.ts         # Crop threshold profiles
```

**Security note:** The WeatherAI API key is only used in Next.js Route Handlers (`/api/*`). It is never sent to the browser. All client fetches go to `/api/…`, which proxies to `api.weather-ai.co` server-side.
