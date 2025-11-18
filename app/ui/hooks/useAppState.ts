"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { useClock } from '../hooks/useClock';
import { useBeeper } from '../hooks/useBeeper';
import { useTypewriter } from '../hooks/useTypewriter';
import { useLocalStorage } from '../lib/hooks';
import {
  CountryTuple,
  LangTuple,
  Category,
  Headline,
  HaikuEntry,
  COUNTRIES,
  LANGS,
  CATS,
  flagEmoji,
  defaultCountry,
  defaultLangForCountry,
} from '../lib/utils';
import { formatIndicator } from '../lib/utils';
import useNewHaiku from '../hooks/useNewHaiku';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import useHeadlines from '../hooks/useHeadlines';
import useHistoryFavorites from '../hooks/useHistoryFavorites';
import { fetchHaiku } from '../services/api';
import useToast from '../hooks/useToast';
import useIndicator from '../hooks/useIndicator';
import useSocial from '../hooks/useSocial';
import useFavoriteCurrent from '../hooks/useFavoriteCurrent';
import useModals from '../hooks/useModals';
import useActions from '../hooks/useActions';

export interface AppState {
  theme: 'dark' | 'light';
  setTheme: Dispatch<SetStateAction<'dark' | 'light'>>;
  sound: boolean;
  setSound: Dispatch<SetStateAction<boolean>>;
  country: string;
  setCountry: Dispatch<SetStateAction<string>>;
  category: Category;
  setCategory: Dispatch<SetStateAction<Category>>;
  haikuLang: string;
  setHaikuLang: Dispatch<SetStateAction<string>>;
  headlines: Headline[];
  setHeadlines: Dispatch<SetStateAction<Headline[]>>;
  current: Headline | null;
  currentHaiku: string;
  history: HaikuEntry[];
  setHistory: Dispatch<SetStateAction<HaikuEntry[]>>;
  favorites: HaikuEntry[];
  setFavorites: Dispatch<SetStateAction<HaikuEntry[]>>;
  reduceMotion: boolean;
  clock: string;
  dateStr: string;
  headlineOut: string;
  haikuOut: string;
  skeleton: boolean;
  notif: string | null;
  indicator: string;
  favActive: boolean;
  historyOpen: boolean;
  favoritesOpen: boolean;
  newHaiku: () => void;
  openHistory: () => void;
  openFavorites: () => void;
  closeModals: () => void;
  copyCurrent: () => void;
  shareTwitter: () => void;
  shareFacebook: () => void;
  toggleFavoriteCurrent: () => void;
  toast: (message: string) => void;
  typing: boolean;
  ensureHeadlines: (cat?: Category, countryOverride?: string, current?: Headline[]) => Promise<Headline[]>;
  setLastFetchedAt: (t: number) => void;
  copyText: (text: string) => void;
}

export function useAppState(): AppState {
  const [theme, setTheme] = useLocalStorage<'dark'|'light'>('nh.theme', 'dark');
  const [sound, setSound] = useLocalStorage<boolean>('nh.sound', true);
  const [country, setCountry] = useLocalStorage<string>('nh.country', 'US');
  const [category, setCategory] = useLocalStorage<Category>('nh.category', 'general');
  const [haikuLang, setHaikuLang] = useLocalStorage<string>('nh.lang', 'auto');
  const { headlines, setHeadlines, ensureHeadlines, setLastFetchedAt } = useHeadlines([]);
  const [current, setCurrent] = useState<Headline | null>(null);
  const [currentHaiku, setCurrentHaiku] = useState<string>('');
  const [history, setHistory] = useLocalStorage<HaikuEntry[]>('nh.history', []);
  const [favorites, setFavorites] = useLocalStorage<HaikuEntry[]>('nh.favorites', []);
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { setReduceMotion(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Detect preferred theme and country on first mount if not set
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (window.localStorage.getItem('nh.theme') == null) {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
      if (window.localStorage.getItem('nh.country') == null) {
        setCountry(defaultCountry());
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clock
  const { clock, dateStr } = useClock();

  const { beep } = useBeeper(sound);

  const { typeText, typing } = useTypewriter(beep, reduceMotion);

  // Data handled by useHeadlines hook; fetchHaiku imported from services

  const [headlineOut, setHeadlineOut] = useState<string>('Tap Generate...');
  const [haikuOut, setHaikuOut] = useState<string>('...and turn a headline\ninto a 3-line poem');
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const { notif, toast } = useToast(null);

  const { pushHistory, isFavorited, toggleFavorite } = useHistoryFavorites(history, setHistory, favorites, setFavorites);

  const renderIndicator = useCallback(() => formatIndicator(current, category, country, haikuLang, sound), [current, category, country, haikuLang, sound]);
  const { indicator, refresh: refreshIndicator } = useIndicator(renderIndicator);

  // ensureHeadlines expects (Category?, string?, Headline[]?). Wrap to accept looser strings.
  const ensureHeadlinesAdapter = (cat?: string, countryOverride?: string, current?: any) => ensureHeadlines(cat as any, countryOverride, current);

  const [favActive, setFavActive] = useState<boolean>(false);
  const toggleFavoriteCurrent = () => {
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
  };

  const { newHaiku } = useNewHaiku({ ensureHeadlines: ensureHeadlinesAdapter, headlines, typeText, setHeadlineOut, setHaikuOut, setIndicator: (() => refreshIndicator()) as any, renderIndicator, setSkeleton, setCurrent, setCurrentHaiku, setFavActive, isFavorited, pushHistory, haikuLang, country, category });

  const { historyOpen, favoritesOpen, openHistory, openFavorites, closeModals } = useModals(false, false);

  const { copyCurrent, copyText } = useActions(toast);
  const copyCurrentWrapper = () => copyCurrent(currentHaiku, current);
  const { shareTwitter: _shareTwitter, shareFacebook } = useSocial();
  const shareTwitter = () => _shareTwitter(currentHaiku, current || undefined);

  useKeyboardShortcuts({ newHaiku, copyCurrent: copyCurrentWrapper, setTheme, closeModals, setSound });

  // Refetch headlines when category or country changes
  useEffect(() => {
    ensureHeadlines(category, country);
  }, [category, country, ensureHeadlines]);

  return {
    theme,
    setTheme,
    sound,
    setSound,
    country,
    setCountry,
    category,
    setCategory,
    haikuLang,
    setHaikuLang,
    headlines,
    setHeadlines,
    current,
    currentHaiku,
    history,
    setHistory,
    favorites,
    setFavorites,
    reduceMotion,
    clock,
    dateStr,
    headlineOut,
    haikuOut,
    skeleton,
    notif,
    indicator,
    favActive,
    historyOpen,
    favoritesOpen,
    newHaiku,
    openHistory,
    openFavorites,
    closeModals,
    copyCurrent: copyCurrentWrapper,
    shareTwitter,
    shareFacebook,
    toggleFavoriteCurrent,
    toast,
    typing,
    ensureHeadlines,
    setLastFetchedAt,
    copyText,
  };
}