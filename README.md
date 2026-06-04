# FarmPulse — Smart Agri-Weather Dashboard

A Next.js 14 dashboard combining real-time weather intelligence with AI-powered farm analytics, built on the [WeatherAI API](https://weather-ai.co).

## Features

| Feature | API Endpoint |
|---|---|
| Location search by city/name | `/v1/weather-geo` |
| Current conditions + stats | `/v1/current` |
| AI-generated weather summary (Gemini) | `/v1/current` with `ai=true` |
| Interactive 7-day forecast chart | `/v1/weather` |
| Hourly temperature & precipitation | `/v1/hourly` |
| API usage meter | `/v1/usage` |
| Farm image tree-count & health analysis | `/v1/trees/analyze` |
| Annotated overlay image display | (from analyze response) |

## Tech Stack

- **Next.js 14** (App Router, TypeScript) — server-side API proxies keep your key out of the browser
- **Tailwind CSS** — utility-first styling with light/dark mode
- **Recharts** — temperature and precipitation charts
- **Radix UI** — accessible primitive components
- **Vercel** — recommended deployment platform

## Setup

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/smart-agri-weather-dashboard
cd smart-agri-weather-dashboard
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
3. Add environment variables in Vercel dashboard:
   - `WEATHER_AI_API_KEY` = your key
   - `WEATHER_AI_BASE_URL` = `https://api.weather-ai.co`
4. Deploy — Vercel auto-detects Next.js

## Architecture

```
src/
├── app/
│   ├── api/              # Server-side proxy routes (API key stays secret)
│   │   ├── current/
│   │   ├── weather/
│   │   ├── hourly/
│   │   ├── geo/
│   │   ├── usage/
│   │   └── trees/analyze/
│   ├── layout.tsx
│   ├── page.tsx          # Dashboard page (client-side state management)
│   └── globals.css
├── components/
│   ├── ui/               # Primitive UI components (button, card, badge…)
│   ├── CurrentWeatherCard.tsx
│   ├── AISummaryCard.tsx
│   ├── ForecastChart.tsx
│   ├── HourlyChart.tsx
│   ├── TreeAnalysisPanel.tsx
│   ├── UsageMeter.tsx
│   └── LocationSearch.tsx
└── lib/
    ├── types.ts          # TypeScript interfaces for all API responses
    └── utils.ts          # Formatting helpers
```

**Security note:** The WeatherAI API key is only used in Next.js Route Handlers (`/api/*`). It is never sent to the browser. All client fetches go to `/api/…`, which proxies to `api.weather-ai.co` server-side.

## License

MIT
