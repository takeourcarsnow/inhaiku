import { useCallback, useState } from 'react';

export default function useModals(initialHistory = false, initialFavorites = false) {
  const [historyOpen, setHistoryOpen] = useState<boolean>(initialHistory);
  const [favoritesOpen, setFavoritesOpen] = useState<boolean>(initialFavorites);

  const openHistory = useCallback(() => setHistoryOpen(true), []);
  const openFavorites = useCallback(() => setFavoritesOpen(true), []);
  const closeModals = useCallback(() => { setHistoryOpen(false); setFavoritesOpen(false); }, []);

  return { historyOpen, favoritesOpen, openHistory, openFavorites, closeModals } as const;
}
