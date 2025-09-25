import { useCallback, useState } from 'react';

export function useTypewriter(beep: (f?: number, d?: number, v?: number) => void, reduceMotion: boolean) {
  const [typing, setTyping] = useState(false);
  const typeText = useCallback(async (setOut: (s: string) => void, text: string, speed = 18) => {
    setTyping(true);
    setOut('');
    if (reduceMotion) {
      setOut(text);
      setTyping(false);
      return;
    }
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      out += ch;
      setOut(out);
      if (/\S/.test(ch)) beep(1050 + Math.random()*200, 0.012, 0.03);
      await new Promise(r => setTimeout(r, speed));
    }
    setTyping(false);
  }, [beep, reduceMotion]);
  return { typeText, typing } as const;
}

export default useTypewriter;
