import React from 'react';
import { COUNTRIES, LANGS, CATS, flagEmoji } from '../lib/utils';
import type { Category, Headline } from '../lib/utils';

type Props = {
  country: string;
  setCountry: (c: string) => void;
  haikuLang: string;
  setHaikuLang: (l: string) => void;
  category: Category;
  setCategory: (c: Category) => void;
  ensureHeadlines: (cat?: Category, country?: string) => Promise<Headline[]>;
  toast: (msg: string) => void;
  typing: boolean;
  setHeadlines: (h: Headline[]) => void;
  setLastFetchedAt: (t: number) => void;
};

export function Controls({ country, setCountry, haikuLang, setHaikuLang, category, setCategory, ensureHeadlines, toast, typing, setHeadlines, setLastFetchedAt }: Props) {
  return (
    <>
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
    </>
  );
}

export default Controls;
