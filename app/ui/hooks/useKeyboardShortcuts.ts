import { useEffect } from 'react';

export function useKeyboardShortcuts({ newHaiku, copyCurrent, setTheme, closeModals, setSound }: { newHaiku: () => void; copyCurrent: () => void; setTheme: (fn: (t: 'dark'|'light') => 'dark'|'light') => void; closeModals: () => void; setSound: (s: (b: boolean) => boolean) => void; }) {
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
  }, [newHaiku, copyCurrent, setTheme, closeModals, setSound]);
}

export default useKeyboardShortcuts;
