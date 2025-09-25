import { useCallback } from 'react';
import type { HaikuEntry, Headline, Category } from '../lib/utils';
import { defaultLangForCountry } from '../lib/utils';

export default function useFavoriteCurrent({ current, currentHaiku, country, category, haikuLang, toggleFavorite, toast, setFavActive } : {
  current: Headline | null;
  currentHaiku: string;
  country: string;
  category: Category;
  haikuLang: string;
  toggleFavorite: (e: HaikuEntry) => boolean;
  toast: (s: string) => void;
  setFavActive: (b: boolean) => void;
}) {
  const toggleFavoriteCurrent = useCallback(() => {
    if (!current || !currentHaiku) return;
    const entry: HaikuEntry = {
      title: current.title,
      source: current.source,
      url: current.url,
      haiku: currentHaiku,
      createdAt: new Date().toISOString(),
      country,
      category,
      haikuLang: haikuLang === 'auto' ? defaultLangForCountry(country) : haikuLang,
    };
    const nowFavorited = toggleFavorite(entry);
    setFavActive(nowFavorited);
    toast(nowFavorited ? 'Added to favorites' : 'Removed from favorites');
  }, [current, currentHaiku, country, category, haikuLang, toggleFavorite, toast, setFavActive]);

  return { toggleFavoriteCurrent } as const;
}
