import { useCallback, useRef } from 'react';

export function useBeeper(sound: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const beep = useCallback((freq = 1200, duration = 0.02, vol = 0.035) => {
    if (!sound) return;
    try {
  const win = window as typeof window & { webkitAudioContext?: unknown };
      const maybeCtor: unknown = (window.AudioContext || (typeof win.webkitAudioContext === 'function' ? win.webkitAudioContext : undefined));
      if (!audioCtxRef.current && typeof maybeCtor === 'function') {
        type AudioCtor = new () => AudioContext;
        // eslint-disable-next-line new-cap
        audioCtxRef.current = new (maybeCtor as unknown as AudioCtor)();
      }
      const audio = audioCtxRef.current as AudioContext;
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(freq, audio.currentTime);
      g.gain.setValueAtTime(vol, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
      o.connect(g).connect(audio.destination);
      o.start();
      o.stop(audio.currentTime + duration);
    } catch {}
  }, [sound]);
  return { beep };
}

export default useBeeper;
