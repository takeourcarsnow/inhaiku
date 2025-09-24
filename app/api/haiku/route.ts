import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const LANG_DISPLAY_NAME: Record<string, string> = {
  en: 'English', lt: 'Lithuanian', lv: 'Latvian', et: 'Estonian',
  pl: 'Polish', de: 'German', fr: 'French', es: 'Spanish', it: 'Italian', pt: 'Portuguese', nl: 'Dutch',
  no: 'Norwegian', sv: 'Swedish', da: 'Danish', fi: 'Finnish',
  cs: 'Czech', sk: 'Slovak', hu: 'Hungarian', ro: 'Romanian', bg: 'Bulgarian', el: 'Greek',
  hr: 'Croatian', sl: 'Slovene', sr: 'Serbian',
  uk: 'Ukrainian', tr: 'Turkish',
  ja: 'Japanese', ko: 'Korean', 'zh-CN': 'Chinese (Simplified)', 'zh-TW': 'Chinese (Traditional)', 'zh-HK': 'Chinese (Hong Kong)'
};

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY || !genAI) {
      return NextResponse.json({ error: 'Gemini API key missing on server' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
    }
    const { headline, lang } = await req.json();
    if (!headline || typeof headline !== 'string') {
      return NextResponse.json({ error: 'headline is required' }, { status: 400 });
    }
    const langCode = (lang && lang !== 'auto') ? String(lang) : 'en';
    const langName = LANG_DISPLAY_NAME[langCode] || 'English';
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const prompt = `You are a haiku generator.\nWrite exactly one haiku based on the news headline below.\nConstraints:\n- Write in ${langName}.\n- Exactly 3 lines (no title).\n- Aim for the 5-7-5 spirit (do not explain).\n- No extra text, no quotes, no hashtags, no code fences.\n- Calm, evocative tone.\n\nHeadline: ${headline}`.trim();
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const lines = text
      .replace(/^```[\s\S]*?```/g, '')
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean)
      .slice(0, 3);
    const haiku = lines.join('\n');
    return NextResponse.json({ haiku, lang: langCode }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate haiku' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
