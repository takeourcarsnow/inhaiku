import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
  // Always use the provided initial value for the first render so
  // server and client start the same. Read from localStorage only
  // after mount to avoid hydration mismatches.
  const [value, setValue] = useState<T>(() => initial);

  // On mount, try to hydrate from localStorage (client only).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Keep localStorage in sync when value changes (client only).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);

  return [value, setValue] as const;
}
