import { useCallback } from 'react';
import type { Headline } from '../lib/utils';

export default function useActions(toast: (s: string) => void) {
  const copyText = useCallback((text: string) => navigator.clipboard.writeText(text).then(() => toast('Copied!')), [toast]);
  const copyCurrent = useCallback((haiku: string | null, current?: Headline | null) => {
    if (!haiku || !current) return;
    copyText(`${haiku}\n\n${current.title}\n${current.url}`);
  }, [copyText]);

  return { copyCurrent, copyText } as const;
}
