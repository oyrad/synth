import { type PropsWithChildren, useCallback, useRef, useState } from 'react';
import { AudioCtx } from '../audio-context';
import { createWhiteNoiseBuffer } from '../utils/audio.ts';

export function AudioContextProvider({ children }: PropsWithChildren) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [audioContextState, setAudioContextState] = useState<AudioContextState>('suspended');

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      ctx.onstatechange = () => setAudioContextState(ctx.state);
      audioCtxRef.current = ctx;
    }

    return audioCtxRef.current;
  }, []);

  const getAnalyser = useCallback(() => {
    const ctx = getAudioContext();
    if (!analyserRef.current) {
      analyserRef.current = ctx.createAnalyser();
      analyserRef.current.fftSize = 2048;
    }

    return analyserRef.current;
  }, [getAudioContext]);

  const delayNode = useRef<DelayNode | null>(null);
  const feedbackGain = useRef<GainNode | null>(null);
  const wetGain = useRef<GainNode | null>(null);
  const dryGain = useRef<GainNode | null>(null);

  const getDelay = useCallback(() => {
    if (!delayNode.current || !feedbackGain.current || !wetGain.current || !dryGain.current) {
      const ctx = getAudioContext();
      const analyser = getAnalyser();

      delayNode.current = ctx.createDelay(2);
      feedbackGain.current = ctx.createGain();
      wetGain.current = ctx.createGain();
      dryGain.current = ctx.createGain();

      delayNode.current.connect(feedbackGain.current);
      feedbackGain.current.connect(delayNode.current);

      delayNode.current.connect(wetGain.current);
      wetGain.current.connect(analyser);

      dryGain.current.connect(analyser);

      analyser.connect(ctx.destination);
    }

    return {
      delayNode: delayNode.current,
      feedbackGain: feedbackGain.current,
      wetGain: wetGain.current,
      dryGain: dryGain.current,
    };
  }, [getAnalyser, getAudioContext]);

  const noiseBuffer = useRef<AudioBuffer | null>(null);

  const getNoiseBuffer = useCallback(() => {
    if (!noiseBuffer.current) {
      const ctx = getAudioContext();
      noiseBuffer.current = createWhiteNoiseBuffer(ctx);
    }

    return noiseBuffer.current;
  }, [getAudioContext]);

  return (
    <AudioCtx.Provider
      value={{
        isAudioReady: audioContextState === 'running',
        getAudioContext,
        getAnalyser,
        getDelay,
        getNoiseBuffer,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}
