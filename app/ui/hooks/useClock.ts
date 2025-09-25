import { useEffect, useState } from 'react';

export function useClock() {
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
  return { clock, dateStr };
}

export default useClock;
