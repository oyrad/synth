import { type PropsWithChildren, useCallback, useRef, useState } from 'react';
import { AudioCtx } from '../audio-context';
import { createReverbBuffer, createWhiteNoiseBuffer } from '../utils/audio.ts';

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

    analyserRef.current.connect(ctx.destination);

    return analyserRef.current;
  }, [getAudioContext]);

  const reverbNode = useRef<ConvolverNode | null>(null);
  const reverbWetGain = useRef<GainNode | null>(null);

  const getReverb = useCallback(() => {
    if (!reverbNode.current || !reverbWetGain.current) {
      const ctx = getAudioContext();
      const analyser = getAnalyser();

      reverbNode.current = ctx.createConvolver();
      reverbWetGain.current = ctx.createGain();

      reverbNode.current.buffer = createReverbBuffer(ctx, 2.0, 2.0);

      reverbNode.current.connect(reverbWetGain.current);
      reverbWetGain.current.connect(analyser);
    }
    return { reverbNode: reverbNode.current, reverbWetGain: reverbWetGain.current };
  }, [getAudioContext, getAnalyser]);

  const distortionNode = useRef<WaveShaperNode | null>(null);

  const getDistortion = useCallback(() => {
    if (!distortionNode.current) {
      const ctx = getAudioContext();
      const { reverbNode } = getReverb();
      const analyser = getAnalyser();

      distortionNode.current = ctx.createWaveShaper();
      distortionNode.current.oversample = '4x';

      distortionNode.current.connect(reverbNode);
      distortionNode.current.connect(analyser);
    }
    return distortionNode.current;
  }, [getAnalyser, getAudioContext, getReverb]);

  const delayNode = useRef<DelayNode | null>(null);
  const feedbackGain = useRef<GainNode | null>(null);
  const wetGain = useRef<GainNode | null>(null);
  const dryGain = useRef<GainNode | null>(null);

  const getDelay = useCallback(() => {
    if (!delayNode.current || !feedbackGain.current || !wetGain.current || !dryGain.current) {
      const ctx = getAudioContext();
      const distortion = getDistortion();

      delayNode.current = ctx.createDelay(2);
      feedbackGain.current = ctx.createGain();
      wetGain.current = ctx.createGain();
      dryGain.current = ctx.createGain();

      delayNode.current.connect(feedbackGain.current);
      feedbackGain.current.connect(delayNode.current);

      delayNode.current.connect(wetGain.current);

      wetGain.current.connect(distortion);
      dryGain.current.connect(distortion);
    }

    return {
      delayNode: delayNode.current,
      feedbackGain: feedbackGain.current,
      wetGain: wetGain.current,
      dryGain: dryGain.current,
    };
  }, [getAudioContext, getDistortion]);

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
        getDistortion,
        getReverb,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}
