import { useCallback, useState } from 'react';

export default function useToast(initial: string | null = null) {
  const [notif, setNotif] = useState<string | null>(initial);
  const toast = useCallback((msg: string, timeout = 1500) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), timeout);
  }, []);
  return { notif, toast } as const;
}
