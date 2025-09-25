import { useCallback, useState } from 'react';
import type { Headline, Category } from '../lib/utils';
import { fetchNews } from '../services/api';

export function useHeadlines(initial: Headline[] = []) {
  const [headlines, setHeadlines] = useState<Headline[]>(initial);
  const [lastFetchedAt, setLastFetchedAt] = useState<number>(0);
  const [lastFetchedKey, setLastFetchedKey] = useState<string>('');

  const ensureHeadlines = useCallback(async (catOverride?: Category, countryOverride?: string, currentHeadlines?: Headline[]) => {
    const category = String(catOverride || 'general');
    const country = String(countryOverride || 'US');
    const current = currentHeadlines || headlines;
    const freshForMs = 1000 * 60 * 10; // 10 min
    const key = `${category}|${country}`;
    const isFresh = current.length && (Date.now() - lastFetchedAt < freshForMs) && lastFetchedKey === key;
    if (isFresh) return current;
    try {
      const list = await fetchNews(category, country);
      setHeadlines(list);
      setLastFetchedAt(Date.now());
      setLastFetchedKey(key);
      return list;
    } catch {
      return current;
    }
  }, [headlines, lastFetchedAt, lastFetchedKey]);

  return { headlines, setHeadlines, ensureHeadlines, lastFetchedAt, lastFetchedKey, setLastFetchedAt } as const;
}

export default useHeadlines;
