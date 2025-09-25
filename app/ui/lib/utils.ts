export type CountryTuple = [string, string, string];
export type LangTuple = [string, string];
export type Category = 'general' | 'business' | 'entertainment' | 'health' | 'science' | 'sports' | 'technology';

export interface Headline { title: string; source: string; url: string; }
export interface HaikuEntry extends Headline {
  haiku: string;
  createdAt: string;
  country: string;
  category: Category;
  haikuLang: string; // non-auto
}

export const COUNTRIES: CountryTuple[] = [
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

export const LANGS: LangTuple[] = [
  ['auto','Auto (by country)'],
  ['en','English'], ['lt','Lithuanian'], ['lv','Latvian'], ['et','Estonian'],
  ['pl','Polish'], ['de','German'], ['fr','French'], ['es','Spanish'], ['it','Italian'], ['pt','Portuguese'], ['nl','Dutch'],
  ['no','Norwegian'], ['sv','Swedish'], ['da','Danish'], ['fi','Finnish'],
  ['cs','Czech'], ['sk','Slovak'], ['hu','Hungarian'], ['ro','Romanian'], ['bg','Bulgarian'], ['el','Greek'],
  ['hr','Croatian'], ['sl','Slovene'], ['sr','Serbian'],
  ['uk','Ukrainian'], ['tr','Turkish'],
  ['ja','Japanese'], ['ko','Korean'], ['zh-CN','Chinese (Simpl.)'], ['zh-TW','Chinese (Trad.)'], ['zh-HK','Chinese (HK)']
];

export const CATS: { val: Category; label: string }[] = [
  { val: 'general', label: 'General' },
  { val: 'business', label: 'Business' },
  { val: 'entertainment', label: 'Entertainment' },
  { val: 'health', label: 'Health' },
  { val: 'science', label: 'Science' },
  { val: 'sports', label: 'Sports' },
  { val: 'technology', label: 'Technology' },
];

export function flagEmoji(cc: string) {
  return cc.replace(/./g, c => String.fromCodePoint(c.charCodeAt(0) + 127397));
}
export function defaultCountry(): string {
  try {
    const m = (navigator.language || 'en-US').split('-')[1];
    const c = (m || 'US').toUpperCase();
    const found = COUNTRIES.find(([code]) => code === c);
    return found ? c : 'US';
  } catch { return 'US'; }
}
export function defaultLangForCountry(code: string): string {
  const f = COUNTRIES.find(([c]) => c === code);
  return f ? f[2] : 'en';
}

export function formatIndicator(current: { source?: string } | null, category: string, country: string, haikuLang: string, sound: boolean) {
  const src = current?.source || '—';
  const catLabel = CATS.find(c => c.val === category)?.label || category;
  const countryName = COUNTRIES.find(([c]) => c === country)?.[1] || country;
  const haikuLanguage = haikuLang === 'auto' ? `${defaultLangForCountry(country)} (auto)` : haikuLang;
  return `Source: ${src} • Country: ${countryName} ${flagEmoji(country)} • Category: ${catLabel} • Haiku: ${haikuLanguage}${sound ? ' • 🔊' : ' • 🔇'}`;
}

