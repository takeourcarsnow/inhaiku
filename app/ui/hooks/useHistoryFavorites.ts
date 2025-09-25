import { useCallback } from 'react';
import type { HaikuEntry } from '../lib/utils';

export function useHistoryFavorites(history: HaikuEntry[], setHistory: (h: HaikuEntry[]) => void, favorites: HaikuEntry[], setFavorites: (f: HaikuEntry[]) => void) {
  const entryKey = (e: HaikuEntry) => `${e.title}|${e.url}|${e.haiku}`.toLowerCase();

  const pushHistory = useCallback((entry: HaikuEntry) => {
    const key = entryKey(entry);
    const next = [entry, ...history.filter((e: HaikuEntry) => entryKey(e) !== key)].slice(0, 80);
    setHistory(next);
  }, [history, setHistory]);

  const isFavorited = useCallback((e: HaikuEntry) => favorites.some((x: HaikuEntry) => entryKey(x) === entryKey(e)), [favorites]);

  const toggleFavorite = useCallback((entry: HaikuEntry) => {
    const key = entryKey(entry);
    if (isFavorited(entry)) {
      const next = favorites.filter((e: HaikuEntry) => entryKey(e) !== key);
      setFavorites(next);
      return false;
    } else {
      const next = [entry, ...favorites].slice(0, 150);
      setFavorites(next);
      return true;
    }
  }, [favorites, setFavorites, isFavorited]);

  return { pushHistory, isFavorited, toggleFavorite } as const;
}

export default useHistoryFavorites;
