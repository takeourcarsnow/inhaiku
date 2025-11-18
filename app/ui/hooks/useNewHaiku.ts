import { useCallback } from 'react';
import type { HaikuEntry, Headline } from '../lib/utils';
import { fetchHaiku } from '../services/api';

export function useNewHaiku({ ensureHeadlines, headlines, typeText, setHeadlineOut, setHaikuOut, setIndicator, renderIndicator, setSkeleton, setCurrent, setCurrentHaiku, setFavActive, isFavorited, pushHistory, haikuLang, country, category }: {
  ensureHeadlines: (cat?: string, country?: string, current?: Headline[]) => Promise<Headline[]>;
  headlines: Headline[];
  typeText: (setOut: (s: string) => void, text: string, speed?: number) => Promise<void>;
  setHeadlineOut: (s: string) => void;
  setHaikuOut: (s: string) => void;
  setIndicator: (s: string) => void;
  renderIndicator: () => string;
  setSkeleton: (b: boolean) => void;
  setCurrent: (h: Headline | null) => void;
  setCurrentHaiku: (h: string) => void;
  setFavActive: (b: boolean) => void;
  isFavorited: (e: HaikuEntry) => boolean;
  pushHistory: (e: HaikuEntry) => void;
  haikuLang: string;
  country: string;
  category: string;
}) {
  const newHaiku = useCallback(async () => {
    setIndicator(renderIndicator());
    try {
      setSkeleton(true);
      setHeadlineOut('');
      setHaikuOut('');
      const list = await ensureHeadlines(category, country);
      const pool = (list && list.length) ? list : headlines;
      if (!pool.length) {
        setHeadlineOut('No headlines right now. Try again.');
        setHaikuOut('');
        return;
      }
      const item = pool[Math.floor(Math.random() * pool.length)];
      setCurrent(item);
      setIndicator(renderIndicator());
      await typeText(setHeadlineOut, item.title, 15);
      const langToUse = haikuLang === 'auto' ? 'en' : haikuLang;
      const poem = await fetchHaiku(item.title, langToUse);
      setCurrentHaiku(poem);
      await typeText(setHaikuOut, poem, 24);
      const entry: HaikuEntry = {
        title: item.title,
        source: item.source,
        url: item.url,
        haiku: poem,
        createdAt: new Date().toISOString(),
        country,
        category: category as Cat,
        haikuLang: langToUse
      };
      setFavActive(isFavorited(entry));
      pushHistory(entry);
    } catch {
      setHaikuOut('Could not generate haiku.');
    } finally {
      setSkeleton(false);
    }
  }, [ensureHeadlines, headlines, typeText, setHeadlineOut, setHaikuOut, setIndicator, renderIndicator, setSkeleton, setCurrent, setCurrentHaiku, setFavActive, isFavorited, pushHistory, haikuLang, country, category]);

  return { newHaiku } as const;
}

export default useNewHaiku;
