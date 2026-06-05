# FarmPulse — Smart Agri-Weather Dashboard

> Real-time weather intelligence combined with AI-powered farm analytics, built for smallholder and commercial farmers.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Fly.io](https://img.shields.io/badge/Deployed-Fly.io-8B5CF6?logo=flydotio&logoColor=white)](https://farmpulse.fly.dev)
[![CI/CD](https://github.com/manziosee/Smart-Agri-Weather-Dashboard/actions/workflows/deploy.yml/badge.svg)](https://github.com/manziosee/Smart-Agri-Weather-Dashboard/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Live demo:** [farmpulse.fly.dev](https://farmpulse.fly.dev)  
**Repository:** [github.com/manziosee/Smart-Agri-Weather-Dashboard](https://github.com/manziosee/Smart-Agri-Weather-Dashboard)

---

## Screenshots

> Add screenshots here after deploying — e.g. `![Dashboard](./docs/screenshot-desktop.png)`

---

## Features

### Weather & Forecasting
| Feature | How it works |
|---|---|
| Auto-detect location on first load | Browser Geolocation API → falls back to `/api/ip-lookup` |
| Global city search with autocomplete | OpenStreetMap Nominatim (free, no key needed) |
| Current conditions + wind compass | `/v1/weather` via WeatherAI API |
| Night / day weather icons | Compares current time to sunrise/sunset |
| Sunrise / sunset daylight progress bar | `daily[0].sunrise` / `daily[0].sunset` |
| Interactive 7-day forecast chart | Temperature area + rain bar (dual Y-axis) |
| Hourly chart — 4 tabs | Temp · Rain % · Feels Like · Wind Gust |
| AI weather summary card | `ai=true` flag on `/v1/weather` |

### Farm Intelligence
| Feature | How it works |
|---|---|
| Farm outlook — good / caution / poor days | Local rules engine on 7-day forecast |
| Weekly rain total | Summed from `daily[*].precipitation_sum` |
| Crop advisory (8 crops) | Threshold profiles, no extra API call |
| Irrigation guide (6 crops) | ET demand vs. forecast rain + humidity factor |
| Pest & disease risk panel | 5 crop-disease models from temp/humidity/rain |
| Custom weather alerts | User-defined thresholds stored in `localStorage` |

### Productivity
| Feature | How it works |
|---|---|
| Save up to 5 farm locations | `localStorage` |
| Multi-farm comparison table | Parallel fetches for all saved bookmarks |
| Farm image tree-count & health analysis | `/v1/trees/analyze` — AI computer vision |
| Tree analysis history (up to 5) | `localStorage` |
| Share weather card as PNG / WhatsApp | `html-to-image` |
| API usage meter | `/v1/usage` |
| Dark mode | CSS variables + `localStorage` persistence |
| °C / °F toggle | Persisted in `localStorage` |
| PWA — installable on mobile | `manifest.json` + theme-color meta |
| Skeleton loading states | Per-card placeholders during data fetch |

---

## Tech Stack

| Layer | Technology |
|---|---|
| ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white) | [Next.js 16](https://nextjs.org) — App Router, TypeScript |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) | [TypeScript 5](https://www.typescriptlang.org) — static type safety |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss&logoColor=white) | [Tailwind CSS 3](https://tailwindcss.com) — utility-first, light/dark mode |
| ![Recharts](https://img.shields.io/badge/Recharts-2-22b5bf?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0zIDNoMTh2MThIM3oiLz48L3N2Zz4=&logoColor=white) | [Recharts 2](https://recharts.org) — area, bar, line, composed charts |
| ![Radix UI](https://img.shields.io/badge/Radix_UI-latest-161618?logo=radix-ui&logoColor=white) | [Radix UI](https://radix-ui.com) — accessible components |
| ![Lucide](https://img.shields.io/badge/Lucide_React-icons-f56565?logo=lucide&logoColor=white) | [Lucide React](https://lucide.dev) — icon library |
| ![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-Nominatim-7EBC6F?logo=openstreetmap&logoColor=white) | [Nominatim](https://nominatim.org) — free geocoding, no key needed |
| ![Docker](https://img.shields.io/badge/Docker-multi--stage-2496ED?logo=docker&logoColor=white) | [Docker](https://docker.com) — multi-stage build, standalone output |
| ![Fly.io](https://img.shields.io/badge/Fly.io-deployed-8B5CF6?logo=flydotio&logoColor=white) | [Fly.io](https://fly.io) — global edge deployment |
| ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?logo=github-actions&logoColor=white) | [GitHub Actions](https://github.com/features/actions) — automated build & deploy |

---

## Prerequisites

- **Node.js** 18.17 or later
- **npm** 9+ (comes with Node)
- A free **WeatherAI API key** → [weather-ai.co/dashboard](https://weather-ai.co/dashboard)

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/manziosee/Smart-Agri-Weather-Dashboard.git
cd Smart-Agri-Weather-Dashboard
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
WEATHER_AI_API_KEY=wai_your_actual_key_here
WEATHER_AI_BASE_URL=https://api.weather-ai.co
```

| Variable | Required | Description |
|---|---|---|
| `WEATHER_AI_API_KEY` | ✅ | Your WeatherAI secret key |
| `WEATHER_AI_BASE_URL` | ✅ | Always `https://api.weather-ai.co` |

> **Security:** The API key is only read inside Next.js Route Handlers (`src/app/api/*`). It is never sent to the browser.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm start
```

---

## Deployment (Fly.io)

[![Fly.io](https://img.shields.io/badge/Deployed_on-Fly.io-8B5CF6?logo=flydotio&logoColor=white)](https://farmpulse.fly.dev)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=github-actions&logoColor=white)](https://github.com/manziosee/Smart-Agri-Weather-Dashboard/actions)

Fly.io runs the app as a Docker container globally. All config is in `fly.toml` and `Dockerfile`.

### Prerequisites

Install the Fly CLI:

```bash
# macOS / Linux
curl -L https://fly.io/install.sh | sh

# or via Homebrew
brew install flyctl
```

### 1. Login

```bash
flyctl auth login
```

### 2. Create the app

Run this **once** to register the app name on Fly.io (do not deploy yet):

```bash
flyctl launch --no-deploy
```

When prompted:
- **App name:** `farmpulse` (or any unique name)
- **Region:** `jnb` (Johannesburg) for East Africa, or choose your nearest
- **Postgres / Redis:** No

This updates `fly.toml` with your chosen app name.

### 3. Set secrets

Secrets are injected at runtime — never stored in the image:

```bash
flyctl secrets set \
  WEATHER_AI_API_KEY=wai_your_actual_key_here \
  WEATHER_AI_BASE_URL=https://api.weather-ai.co
```

### 4. Deploy

```bash
flyctl deploy
```

Fly.io will:
1. Build the Docker image using the multi-stage `Dockerfile`
2. Push it to their registry
3. Start a VM and run `node server.js`
4. Issue a free TLS certificate for `https://farmpulse.fly.dev`

### 5. Open the app

```bash
flyctl open
```

### Subsequent deploys

```bash
git push           # commit your changes first
flyctl deploy      # rebuild and redeploy
```

### Useful Fly.io commands

```bash
flyctl status          # machine status
flyctl logs            # live log stream
flyctl secrets list    # show secret names (not values)
flyctl scale count 1   # ensure 1 machine is running
flyctl ssh console     # SSH into the running container
```

### Fly.io config reference (`fly.toml`)

| Setting | Value | Notes |
|---|---|---|
| `primary_region` | `jnb` | Johannesburg — change to your nearest region |
| `vm.size` | `shared-cpu-1x` | Free-tier eligible |
| `vm.memory` | `512mb` | Sufficient for Next.js standalone |
| `auto_stop_machines` | `stop` | Scales to zero when idle (saves cost) |
| `min_machines_running` | `0` | Set to `1` to eliminate cold starts |
| `force_https` | `true` | Auto TLS via Fly.io |

> **Regions:** Run `flyctl platform regions` to list all available regions and pick the closest to your users.

---

## CI/CD — GitHub Actions

Every push to `main` automatically builds and deploys to Fly.io via GitHub Actions.

### How it works

| Event | What happens |
|---|---|
| Push to `main` | Build + type-check → deploy to Fly.io |
| Pull request to `main` | Build + type-check only (no deploy) |

This means:
- Broken builds **block deployment** — bad code never reaches production
- PRs are validated before merge
- No manual `flyctl deploy` needed after the initial setup

### Setup (one-time)

**1. Get your Fly.io API token:**
```bash
flyctl tokens create deploy -x 999999h
```

**2. Add it to GitHub:**
- Go to your repo → **Settings** → **Secrets and variables** → **Actions**
- Click **New repository secret**
- Name: `FLY_API_TOKEN`
- Value: paste the token from step 1
- Click **Add secret**

**3. Push to main — it deploys automatically:**
```bash
git push origin main
```

Monitor deployments at: `https://github.com/manziosee/Smart-Agri-Weather-Dashboard/actions`

---

## Project Architecture

```
Smart-Agri-Weather-Dashboard/
├── public/
│   └── manifest.json               # PWA manifest
├── src/
│   ├── app/
│   │   ├── api/                    # Server-side proxy routes (key never leaves server)
│   │   │   ├── weather/route.ts    # 7-day forecast + current + hourly (ai=true)
│   │   │   ├── current/route.ts    # Current conditions only (60s cache)
│   │   │   ├── hourly/route.ts     # Hourly data
│   │   │   ├── geo/route.ts        # Geocoding via OpenStreetMap Nominatim
│   │   │   ├── ip-lookup/route.ts  # IP-based location fallback
│   │   │   ├── usage/route.ts      # API quota meter
│   │   │   └── trees/analyze/      # POST — AI tree count & health analysis
│   │   │       └── route.ts
│   │   ├── globals.css             # Tailwind base + CSS variables + mobile fixes
│   │   ├── layout.tsx              # Root layout — PWA meta, fonts, viewport
│   │   └── page.tsx                # Dashboard — state, responsive grid, data fetching
│   ├── components/
│   │   ├── ui/                     # Primitive components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── progress.tsx
│   │   ├── AISummaryCard.tsx       # AI-generated weather narrative
│   │   ├── BookmarkedLocations.tsx # Save / switch up to 5 farm locations
│   │   ├── CropAdvisoryPanel.tsx   # 8-crop suitability — ideal / marginal / unsuitable
│   │   ├── CurrentWeatherCard.tsx  # Hero card — temp, condition, humidity, wind, UV
│   │   ├── DashboardSkeleton.tsx   # Per-card skeleton placeholders
│   │   ├── FarmSummaryCard.tsx     # Good/caution/poor day badges + weekly rain
│   │   ├── ForecastChart.tsx       # 7-day area + rain bar chart (dual Y-axis)
│   │   ├── HourlyChart.tsx         # 4-tab hourly chart (temp/rain/feels/gust)
│   │   ├── IrrigationCard.tsx      # ET-based irrigation recommendations per crop
│   │   ├── LocationSearch.tsx      # Debounced autocomplete with quick locations
│   │   ├── MultiLocationCompare.tsx # Side-by-side comparison of saved farms
│   │   ├── PestRiskPanel.tsx       # Crop disease risk from weather conditions
│   │   ├── ShareButton.tsx         # Export weather card as PNG (html-to-image)
│   │   ├── SunriseSunsetCard.tsx   # Daylight progress bar
│   │   ├── TreeAnalysisPanel.tsx   # Image upload + AI analysis + history
│   │   ├── UsageMeter.tsx          # API request quota progress bars
│   │   ├── WeatherAlertsPanel.tsx  # Custom threshold alerts (localStorage)
│   │   ├── WeatherIcon.tsx         # WMO code → Lucide icon (day/night variants)
│   │   └── WindCompass.tsx         # SVG compass rose with live needle
│   ├── hooks/
│   │   ├── useAutoLocation.ts      # Geolocation on first visit (localStorage flag)
│   │   └── useLocalStorage.ts      # Generic persisted state hook
│   └── lib/
│       ├── cropAdvisory.ts         # 8-crop threshold profiles + assessCrops()
│       ├── farmAdvisory.ts         # scoreFarmingDay() + weeklyRainTotal()
│       ├── types.ts                # TypeScript interfaces for WeatherAI API
│       ├── utils.ts                # formatTemp, formatDate, formatTime, getWindDirection
│       └── wmo.ts                  # WMO weather code → human label map
├── .env.local.example
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## How the geocoding works

Location search uses **OpenStreetMap Nominatim** instead of the WeatherAI geo endpoint. This means:

- Any city or village worldwide resolves correctly (New York, New Delhi, Bujumbura, etc.)
- The correct country is returned (Bujumbura → Burundi, not Rwanda)
- Up to 6 autocomplete suggestions appear as you type (400ms debounce)
- No additional API key required
- Responses are cached server-side for 1 hour

---

## Environment variable reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `WEATHER_AI_API_KEY` | ✅ | — | WeatherAI secret key |
| `WEATHER_AI_BASE_URL` | ✅ | `https://api.weather-ai.co` | WeatherAI base URL |

---

## Available scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint check
```

---

## Security

- The `WEATHER_AI_API_KEY` is read **only** inside Next.js Route Handlers (`/api/*`) — server-side only
- The browser never receives the key; all client requests go to `/api/…` which proxies to WeatherAI
- No credentials are stored in `localStorage` — only user preferences and bookmarks

---


