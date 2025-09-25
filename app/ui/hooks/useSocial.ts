import { useCallback } from 'react';
import type { Headline } from '../lib/utils';

export default function useSocial() {
  const shareTwitter = useCallback((haiku: string, headline?: Headline) => {
    if (!haiku || !headline) return;
    const url = new URL('https://twitter.com/intent/tweet');
    url.searchParams.set('text', `${haiku}\n\n${headline.title}`);
    url.searchParams.set('url', headline.url);
    window.open(url.toString(), '_blank');
  }, []);

  const shareFacebook = useCallback((headline?: Headline) => {
    if (!headline) return;
    const url = new URL('https://www.facebook.com/sharer/sharer.php');
    url.searchParams.set('u', headline.url);
    window.open(url.toString(), '_blank');
  }, []);

  return { shareTwitter, shareFacebook } as const;
}
