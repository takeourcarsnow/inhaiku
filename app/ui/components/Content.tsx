import React from 'react';
import Controls from './Controls';
import Display from './Display';
import type { Category, Headline } from '../lib/utils';

type Props = {
  indicator: string;
  country: string;
  setCountry: (country: string) => void;
  haikuLang: string;
  setHaikuLang: (lang: string) => void;
  category: Category;
  setCategory: (category: Category) => void;
  ensureHeadlines: (cat?: Category, countryOverride?: string, current?: Headline[]) => Promise<Headline[]>;
  toast: (message: string) => void;
  typing: boolean;
  setHeadlines: (headlines: Headline[]) => void;
  setLastFetchedAt: (t: number) => void;
  headlineOut: string;
  haikuOut: string;
  skeleton: boolean;
  currentUrl: string | undefined;
};

export default function Content({
  indicator,
  country,
  setCountry,
  haikuLang,
  setHaikuLang,
  category,
  setCategory,
  ensureHeadlines,
  toast,
  typing,
  setHeadlines,
  setLastFetchedAt,
  headlineOut,
  haikuOut,
  skeleton,
  currentUrl,
}: Props) {
  return (
    <div className="content">
      <div className="source-indicator" dangerouslySetInnerHTML={{ __html: indicator.replace(/\n/g, '<br/>') }} />

      <Controls
        country={country}
        setCountry={setCountry}
        haikuLang={haikuLang}
        setHaikuLang={setHaikuLang}
        category={category}
        setCategory={setCategory}
        ensureHeadlines={ensureHeadlines}
        toast={toast}
        typing={typing}
        setHeadlines={setHeadlines}
        setLastFetchedAt={setLastFetchedAt}
      />

      <Display headlineOut={headlineOut} haikuOut={haikuOut} skeleton={skeleton} currentUrl={currentUrl} />
    </div>
  );
}