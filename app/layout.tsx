/* eslint-disable @next/next/no-page-custom-font, @next/next/no-css-tags */
import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: "inhaiku.lt — generate Haikus from today's headlines",
  description: 'Turn top headlines into tiny poems. Choose country, category, and haiku language.',
  openGraph: {
    title: "inhaiku.lt — generate Haikus from today's headlines",
    description: 'Headlines become haiku in a retro Nokia-style UI.',
    type: 'website',
    url: 'https://your-vercel-url.vercel.app',
    images: ['https://your-vercel-url.vercel.app/preview.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: "inhaiku.lt — generate Haikus from today's headlines",
    description: 'Choose country, category, and haiku language.',
    images: ['https://your-vercel-url.vercel.app/preview.jpg']
  },
  authors: [{ name: 'nefas.tv' }]
};

export const viewport: Viewport = {
  themeColor: '#1e2f23'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=VT323&display=swap" as="style" />
        <link rel="preload" href="/css/styles.css" as="style" />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
