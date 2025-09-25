import type { Headline } from '../lib/utils';

export async function fetchNews(cat: string, ctry: string): Promise<Headline[]> {
  const r = await fetch(`/api/news?category=${encodeURIComponent(cat)}&country=${encodeURIComponent(ctry)}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('News fetch failed');
  const data = await r.json();
  return data.headlines || [];
}

export async function fetchHaiku(headline: string, langToUse: string): Promise<string> {
  const r = await fetch('/api/haiku', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ headline, lang: langToUse }) });
  const data = await r.json();
  if (!data.haiku) throw new Error('Haiku generation failed');
  return data.haiku as string;
}

export const api = { fetchNews, fetchHaiku };
export default api;
