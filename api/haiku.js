/**
 * DEPRECATED LEGACY FILE (pre-Next.js migration)
 *
 * This project has migrated to Next.js App Router.
 * API routes now live under `app/api/haiku/route.ts`.
 *
 * This file is intentionally left as a no-op to avoid accidental usage by external tooling.
 * It can be safely deleted.
 */
export default function handler(_req, res) {
  res.statusCode = 410; // Gone
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Deprecated: use /app/api/haiku/route.ts in Next.js' }));
}

