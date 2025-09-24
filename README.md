# inhaiku.lt (Next.js + TypeScript)

This is a port of the original single-page app to Next.js (App Router) with TypeScript.

- Frontend: `app/` with a client component that mirrors the original UI/UX
- API: `app/api/news/route.ts` and `app/api/haiku/route.ts`
- Styles: reuses `public/css/styles.css` for the Nokia-style UI

## Development

1) Install deps

```powershell
npm install
```

2) Run dev server

```powershell
npm run dev
```

Then open http://localhost:3000

## Environment

Set `GEMINI_API_KEY` in your environment (e.g., Vercel project settings) to enable haiku generation.

## Notes

- Most DOM logic has been converted to React hooks.
- SSR-sensitive code (audio, clipboard, localStorage) runs client-side only.
- API endpoints stay server-only and keep the same response shapes.

## Migration cleanup

This repo was migrated from a static SPA. Legacy files are no longer used by Next.js and can be safely removed:

- `api/haiku.js` (deprecated stub)
- `api/news.js` (deprecated stub)
- `public/index.html` (deprecated notice page)
- `public/js/main.js` (deprecated stub)
- `next.config.ts` (use `next.config.mjs`)

The active sources are:

- UI: `app/ui/ClientApp.tsx` rendered via `app/page.tsx` and `app/layout.tsx`
- APIs: `app/api/news/route.ts`, `app/api/haiku/route.ts`
- Styles: `public/css/styles.css` (plus minimal `app/globals.css`)

Turn today's news headlines into tiny poems with a retro Nokia-style webapp. Choose your country, news category, and haiku language. Powered by Google Gemini and RSS feeds.

## Features
- Converts top news headlines into haiku poems using generative AI
- Selectable country, news category, and haiku language
- Retro Nokia-style UI, mobile-first and responsive
- Favorites and history for generated haiku
- Share haiku to social media
- Serverless API (Vercel) for news and haiku generation

## Demo
![inhaiku.lt screenshot](preview.jpg)

## Getting Started

### Prerequisites
- Node.js 18+
- Vercel CLI (for deployment)

### Install
```sh
npm install
```

### Development
```sh
npm run dev
```

### Production
```sh
npm start
```

### Deploy to Vercel
```sh
vercel deploy
```

## Project Structure (current)
```
app/                # Next.js App Router (UI + route handlers)
  api/
    haiku/route.ts  # POST /api/haiku
    news/route.ts   # GET  /api/news
public/             # Static assets (favicon, css, manifest, sw)
  css/
```

## API Endpoints
- `GET  /api/news` — Fetches news headlines by country/category (uses RSS)
- `POST /api/haiku` — Generates a haiku from a headline (uses Google Gemini)

## Configuration
- Set your Google Gemini API key as an environment variable: `GOOGLE_API_KEY`

## License
MIT

---
Created by [nefas.tv](https://nefas.tv)
