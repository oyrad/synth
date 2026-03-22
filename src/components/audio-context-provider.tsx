import { type ReactNode, useCallback, useRef, useState } from 'react';
import { AudioCtx } from '../audio-context.tsx';

export function AudioContextProvider({ children }: { children: ReactNode }) {
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const [audioContextState, setAudioContextState] =
    useState<AudioContextState>('suspended');

  const getAudioContext = useCallback(() => {
    if (!audioContext.current) {
      const ctx = new AudioContext();
      ctx.onstatechange = () => setAudioContextState(ctx.state);
      audioContext.current = ctx;
    }

    return audioContext.current;
  }, []);

  const getAnalyser = useCallback(() => {
    if (!analyser.current) {
      const ctx = getAudioContext();
      analyser.current = ctx.createAnalyser();
      analyser.current.fftSize = 2048;
    }

    return analyser.current;
  }, [getAudioContext]);

  return (
    <AudioCtx.Provider
      value={{
        isAudioReady: audioContextState === 'running',
        getAudioContext,
        getAnalyser,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}
