import { useCallback, useEffect, useState } from 'react';

export default function useIndicator(renderIndicator: () => string) {
  const [indicator, setIndicator] = useState('');
  const refresh = useCallback(() => setIndicator(renderIndicator()), [renderIndicator]);
  useEffect(() => { refresh(); }, [refresh]);
  return { indicator, refresh } as const;
}
