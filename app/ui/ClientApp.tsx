'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type CountryTuple = [string, string, string];
type LangTuple = [string, string];
type Category = 'general' | 'business' | 'entertainment' | 'health' | 'science' | 'sports' | 'technology';

interface Headline { title: string; source: string; url: string; }
interface HaikuEntry extends Headline {
  haiku: string;
  createdAt: string;
  country: string;
  category: Category;
  haikuLang: string; // non-auto
}

const COUNTRIES: CountryTuple[] = [
  ['US','United States','en'], ['GB','United Kingdom','en'], ['IE','Ireland','en'],
  ['CA','Canada','en'], ['AU','Australia','en'], ['NZ','New Zealand','en'],
  ['LT','Lithuania','lt'], ['LV','Latvia','lv'], ['EE','Estonia','et'],
  ['PL','Poland','pl'], ['DE','Germany','de'], ['FR','France','fr'], ['ES','Spain','es'], ['IT','Italy','it'], ['PT','Portugal','pt'], ['NL','Netherlands','nl'],
  ['NO','Norway','no'], ['SE','Sweden','sv'], ['DK','Denmark','da'], ['FI','Finland','fi'],
  ['CZ','Czechia','cs'], ['SK','Slovakia','sk'], ['HU','Hungary','hu'], ['RO','Romania','ro'], ['BG','Bulgaria','bg'], ['GR','Greece','el'],
  ['HR','Croatia','hr'], ['SI','Slovenia','sl'], ['RS','Serbia','sr'],
  ['UA','Ukraine','uk'], ['TR','Türkiye','tr'],
  ['BR','Brazil','pt'], ['MX','Mexico','es'], ['AR','Argentina','es'], ['CL','Chile','es'], ['CO','Colombia','es'], ['PE','Peru','es'],
  ['JP','Japan','ja'], ['KR','South Korea','ko'], ['CN','China','zh-CN'], ['TW','Taiwan','zh-TW'], ['HK','Hong Kong','zh-HK'],
  ['IN','India','en'], ['ZA','South Africa','en']
];

const LANGS: LangTuple[] = [
  ['auto','Auto (by country)'],
  ['en','English'], ['lt','Lithuanian'], ['lv','Latvian'], ['et','Estonian'],
  ['pl','Polish'], ['de','German'], ['fr','French'], ['es','Spanish'], ['it','Italian'], ['pt','Portuguese'], ['nl','Dutch'],
  ['no','Norwegian'], ['sv','Swedish'], ['da','Danish'], ['fi','Finnish'],
  ['cs','Czech'], ['sk','Slovak'], ['hu','Hungarian'], ['ro','Romanian'], ['bg','Bulgarian'], ['el','Greek'],
  ['hr','Croatian'], ['sl','Slovene'], ['sr','Serbian'],
  ['uk','Ukrainian'], ['tr','Turkish'],
  ['ja','Japanese'], ['ko','Korean'], ['zh-CN','Chinese (Simpl.)'], ['zh-TW','Chinese (Trad.)'], ['zh-HK','Chinese (HK)']
];

const CATS: { val: Category; label: string }[] = [
  { val: 'general', label: 'General' },
  { val: 'business', label: 'Business' },
  { val: 'entertainment', label: 'Entertainment' },
  { val: 'health', label: 'Health' },
  { val: 'science', label: 'Science' },
  { val: 'sports', label: 'Sports' },
  { val: 'technology', label: 'Technology' },
];

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue] as const;
}

function flagEmoji(cc: string) {
  return cc.replace(/./g, c => String.fromCodePoint(c.charCodeAt(0) + 127397));
}
function defaultCountry(): string {
  try {
    const m = (navigator.language || 'en-US').split('-')[1];
    const c = (m || 'US').toUpperCase();
    const found = COUNTRIES.find(([code]) => code === c);
    return found ? c : 'US';
  } catch { return 'US'; }
}
function defaultLangForCountry(code: string): string {
  const f = COUNTRIES.find(([c]) => c === code);
  return f ? f[2] : 'en';
}

export default function ClientApp() {
  const [theme, setTheme] = useLocalStorage<'dark'|'light'>('nh.theme', 'dark');
  const [sound, setSound] = useLocalStorage<boolean>('nh.sound', true);
  const [country, setCountry] = useLocalStorage<string>('nh.country', 'US');
  const [category, setCategory] = useLocalStorage<Category>('nh.category', 'general');
  const [haikuLang, setHaikuLang] = useLocalStorage<string>('nh.lang', 'auto');
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [lastFetchedAt, setLastFetchedAt] = useState<number>(0);
  const [lastFetchedKey, setLastFetchedKey] = useState<string>('');
  const [current, setCurrent] = useState<Headline | null>(null);
  const [currentHaiku, setCurrentHaiku] = useState<string>('');
  const [history, setHistory] = useLocalStorage<HaikuEntry[]>('nh.history', []);
  const [favorites, setFavorites] = useLocalStorage<HaikuEntry[]>('nh.favorites', []);
  const [typing, setTyping] = useState<boolean>(false);
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
  const [clock, setClock] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setClock(d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
      setDateStr(d.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' }));
    };
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  // Beeper
  const audioCtxRef = useRef<AudioContext | null>(null);
  const beep = useCallback((freq = 1200, duration = 0.02, vol = 0.035) => {
    if (!sound) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audio = audioCtxRef.current;
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(freq, audio.currentTime);
      g.gain.setValueAtTime(vol, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
      o.connect(g).connect(audio.destination);
      o.start();
      o.stop(audio.currentTime + duration);
    } catch {}
  }, [sound]);

  // Typewriter
  const typeText = useCallback(async (setOut: (s: string) => void, text: string, speed = 18) => {
    setTyping(true);
    setOut('');
    if (reduceMotion) {
      setOut(text);
      setTyping(false);
      return;
    }
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      out += ch;
      setOut(out);
      if (/\S/.test(ch)) beep(1050 + Math.random()*200, 0.012, 0.03);
      await new Promise(r => setTimeout(r, speed));
    }
    setTyping(false);
  }, [beep, reduceMotion]);

  // Data
  const fetchNews = useCallback(async (cat: Category, ctry: string): Promise<Headline[]> => {
    const r = await fetch(`/api/news?category=${encodeURIComponent(cat)}&country=${encodeURIComponent(ctry)}`, { cache: 'no-store' });
    if (!r.ok) throw new Error('News fetch failed');
    const data = await r.json();
    return data.headlines || [];
  }, []);

  const fetchHaiku = useCallback(async (headline: string, langToUse: string): Promise<string> => {
    const r = await fetch('/api/haiku', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ headline, lang: langToUse }) });
    const data = await r.json();
    if (!data.haiku) throw new Error('Haiku generation failed');
    return data.haiku as string;
  }, []);

  const ensureHeadlines = useCallback(async (
    catOverride?: Category,
    countryOverride?: string
  ): Promise<Headline[]> => {
    const freshForMs = 1000 * 60 * 10; // 10 min
    const catUse = catOverride ?? category;
    const countryUse = countryOverride ?? country;
    const key = `${catUse}|${countryUse}`;
    const isFresh = headlines.length && (Date.now() - lastFetchedAt < freshForMs) && lastFetchedKey === key;
    // If we have fresh headlines for the same key, return them.
    if (isFresh) return headlines;
    try {
      const list = await fetchNews(catUse, countryUse);
      setHeadlines(list);
      setLastFetchedAt(Date.now());
      setLastFetchedKey(key);
      return list;
    } catch (e) {
      // Return current state (may be empty) on failure; caller decides how to handle.
      return headlines;
    }
  }, [category, country, fetchNews, headlines, lastFetchedAt, lastFetchedKey]);

  const [headlineOut, setHeadlineOut] = useState<string>('Tap Generate...');
  const [haikuOut, setHaikuOut] = useState<string>('...and turn a headline\ninto a 3-line poem');
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const [notif, setNotif] = useState<string | null>(null);

  const toast = useCallback((msg: string, timeout = 1500) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), timeout);
  }, []);

  const entryKey = (e: HaikuEntry) => `${e.title}|${e.url}|${e.haiku}`.toLowerCase();
  const isFavorited = useCallback((e: HaikuEntry) => favorites.some((x: HaikuEntry) => entryKey(x) === entryKey(e)), [favorites]);

  const renderIndicator = () => {
    const src = current?.source || '—';
    const catLabel = CATS.find(c => c.val === category)?.label || category;
    const countryName = COUNTRIES.find(([c]) => c === country)?.[1] || country;
    const haikuLanguage = haikuLang === 'auto' ? `${defaultLangForCountry(country)} (auto)` : haikuLang;
    return `Source: ${src} • Country: ${countryName} ${flagEmoji(country)} • Category: ${catLabel} • Haiku: ${haikuLanguage}${sound ? ' • 🔊' : ' • 🔇'}`;
  };

  const [indicator, setIndicator] = useState<string>('');
  useEffect(() => { setIndicator(renderIndicator()); }, [current, category, country, haikuLang, sound]);

  const pushHistory = (entry: HaikuEntry) => {
    const key = entryKey(entry);
    const next = [entry, ...history.filter((e: HaikuEntry) => entryKey(e) !== key)].slice(0, 80);
    setHistory(next);
  };

  const newHaiku = useCallback(async () => {
    if (typing) return;
    setIndicator(renderIndicator());
    try {
      setSkeleton(true);
      setHeadlineOut('');
      setHaikuOut('');
      const list = await ensureHeadlines();
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
      const langToUse = haikuLang === 'auto' ? defaultLangForCountry(country) : haikuLang;
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
        category,
        haikuLang: langToUse
      };
      setFavActive(isFavorited(entry));
      pushHistory(entry);
    } catch (e) {
      setHaikuOut('Could not generate haiku.');
      toast('Oops! Haiku failed.');
    } finally {
      setSkeleton(false);
    }
  }, [typing, ensureHeadlines, headlines, typeText, haikuLang, country, fetchHaiku, category, isFavorited, toast]);

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
    const key = entryKey(entry);
    if (isFavorited(entry)) {
  const next = favorites.filter((e: HaikuEntry) => entryKey(e) !== key);
      setFavorites(next);
      setFavActive(false);
      toast('Removed from favorites');
    } else {
      const next = [entry, ...favorites].slice(0, 150);
      setFavorites(next);
      setFavActive(true);
      toast('Added to favorites');
    }
  };

  const [historyOpen, setHistoryOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const openHistory = () => { setHistoryOpen(true); };
  const openFavorites = () => { setFavoritesOpen(true); };
  const closeModals = () => { setHistoryOpen(false); setFavoritesOpen(false); };

  const copyText = (text: string) => navigator.clipboard.writeText(text).then(() => toast('Copied!'));
  const copyCurrent = () => {
    if (!currentHaiku || !current) return;
    copyText(`${currentHaiku}\n\n${current.title}\n${current.url}`);
  };
  const shareTwitter = () => {
    if (!currentHaiku || !current) return;
    const url = new URL('https://twitter.com/intent/tweet');
    url.searchParams.set('text', `${currentHaiku}\n\n${current.title}`);
    url.searchParams.set('url', current.url);
    window.open(url.toString(), '_blank');
  };
  const shareFacebook = () => {
    if (!current) return;
    const url = new URL('https://www.facebook.com/sharer/sharer.php');
    url.searchParams.set('u', current.url);
    window.open(url.toString(), '_blank');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 's') setSound(s => !s);
      if (k === 'n') newHaiku();
      if (k === 'c') copyCurrent();
      if (k === 't') setTheme(t => t === 'dark' ? 'light' : 'dark');
      if (e.key === 'Escape') closeModals();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [newHaiku]);

  // Initial indicator
  useEffect(() => {
    setIndicator(renderIndicator());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="phone-container">
      <div className="screen">
        <div className="status-bar">
          <span>NEWS HAIKU</span>
          <span>{clock}</span>
          <span>{dateStr}</span>
        </div>

        <div className="content">
          <div className="source-indicator" dangerouslySetInnerHTML={{ __html: indicator.replace(/\n/g, '<br/>') }} />

          <div className="controls-row">
            <div className="select-wrap">
              <label htmlFor="countrySelect">Country</label>
              <select id="countrySelect" className="select" value={country} onChange={async (e) => {
                const val = e.target.value;
                setCountry(val);
                setHeadlines([]); setLastFetchedAt(0);
                await ensureHeadlines(category, val);
                const nm = COUNTRIES.find(([c]) => c === val)?.[1] || val;
                toast(`Country: ${nm}`);
              }}>
                {COUNTRIES.map(([code, name]) => (
                  <option key={code} value={code}>{name} {flagEmoji(code)}</option>
                ))}
              </select>
            </div>
            <div className="select-wrap">
              <label htmlFor="langSelect">Language</label>
              <select id="langSelect" className="select" value={haikuLang} onChange={(e) => {
                const val = e.target.value; setHaikuLang(val);
                toast(val === 'auto' ? 'Haiku language: Auto' : `Haiku language: ${LANGS.find(([c]) => c === val)?.[1]}`);
              }}>
                {LANGS.map(([code, label]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div id="categoryRow" className="category-row" aria-label="Categories">
            {CATS.map(c => (
              <span key={c.val} className={`chip ${c.val === category ? 'active' : ''}`} onClick={async () => {
                if (typing) return;
                setCategory(c.val);
                setHeadlines([]); setLastFetchedAt(0);
                await ensureHeadlines(c.val, country);
                toast(`Category: ${c.label}`);
              }}>{c.label}</span>
            ))}
          </div>

          <div className={`message headline ${skeleton ? 'skeleton' : ''}`} role="status" aria-live="polite" onClick={() => {
            if (current?.url && current.url !== '#') window.open(current.url, '_blank');
          }}>{headlineOut}</div>
          <div className={`message haiku ${skeleton ? 'skeleton' : ''}`} role="status" aria-live="polite">{haikuOut}</div>
        </div>

        <div className="button-container">
          <button data-action="new-haiku" className="main-button" onClick={() => newHaiku()}>🌺 Generate</button>

          <div className="social-buttons">
            <button data-action="toggle-theme" className="social-button theme" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>🌓 Theme</button>
            <button data-action="toggle-favorites" className="social-button" onClick={openFavorites}>⭐ Favorites</button>
            <button data-action="show-history" className="social-button" onClick={openHistory}>📚 History</button>
            <button data-action="copy" className="social-button" onClick={copyCurrent}>📋 Copy</button>
          </div>

          <div className="bottom-buttons">
            <div className="share-buttons">
              <button data-action="share-twitter" className="social-button twitter" onClick={shareTwitter}>🐦 Share</button>
              <button data-action="share-facebook" className="social-button facebook" onClick={shareFacebook}>📘 Share</button>
            </div>

            <button data-action="favorite-current" className={`social-button favorite-button ${favActive ? 'active' : ''}`} onClick={toggleFavoriteCurrent}>{favActive ? '💛 Favorited' : '🫀 Favorite'}</button>

            <a href="https://nefas.tv" target="_blank" rel="noopener noreferrer" className="social-button patreon">Author</a>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {historyOpen && (
        <div className="modal-container" role="dialog" aria-modal="true" aria-label="Haiku history">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Haiku History</h2>
              <button data-action="close-modal" className="close-button" onClick={closeModals}>✖️</button>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="item-header" style={{justifyContent:'center', opacity:.8}}>History is empty.</div>
              ) : history.map((e, i) => (
                <div key={i} className="history-item">
                  <div className="item-header">
                    <span className="item-source">{e.source} • {e.country} {flagEmoji(e.country)} • {e.category} • {e.haikuLang || ''}</span>
                    <span className="item-date">{new Date(e.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="item-headline">{e.title}</div>
                  <div className="item-haiku">{e.haiku}</div>
                  <div className="item-actions">
                    <button className="small-btn" onClick={() => { if (e.url && e.url !== '#') window.open(e.url, '_blank'); }}>Open</button>
                    <button className="small-btn" onClick={() => copyText(`${e.haiku}\n\n${e.title}\n${e.url}`)}>Copy</button>
                    <button className="small-btn" onClick={() => {
                      if (!favorites.some(x => entryKey(x) === entryKey(e))) {
                        setFavorites([e, ...favorites].slice(0, 150));
                        toast('Added to favorites');
                      }
                    }}>Favorite</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {favoritesOpen && (
        <div className="modal-container" role="dialog" aria-modal="true" aria-label="Favorite haiku">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Favorites</h2>
              <button data-action="close-modal" className="close-button" onClick={closeModals}>✖️</button>
            </div>
            <div className="favorites-list">
              {favorites.length === 0 ? (
                <div className="item-header" style={{justifyContent:'center', opacity:.8}}>Nothing here yet.</div>
              ) : favorites.map((e, i) => (
                <div key={i} className="favorite-item">
                  <div className="item-header">
                    <span className="item-source">{e.source} • {e.country} {flagEmoji(e.country)} • {e.category} • {e.haikuLang || ''}</span>
                    <span className="item-date">{new Date(e.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="item-headline">{e.title}</div>
                  <div className="item-haiku">{e.haiku}</div>
                  <div className="item-actions">
                    <button className="small-btn" onClick={() => { if (e.url && e.url !== '#') window.open(e.url, '_blank'); }}>Open</button>
                    <button className="small-btn" onClick={() => copyText(`${e.haiku}\n\n${e.title}\n${e.url}`)}>Copy</button>
                    <button className="small-btn" onClick={() => {
                      const key = entryKey(e);
                      const next = favorites.filter(x => entryKey(x) !== key);
                      setFavorites(next);
                      toast('Removed from favorites');
                    }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {notif && <div className="notification">{notif}</div>}
    </div>
  );
}
