import { createContext } from 'react';

interface AudioContextValue {
  isAudioReady: boolean;
  getAudioContext: () => AudioContext;
  getAnalyser: () => AnalyserNode;
  getDelay: () => {
    delayNode: DelayNode;
    feedbackGain: GainNode;
    wetGain: GainNode;
    dryGain: GainNode;
  };
}

export const AudioCtx = createContext<AudioContextValue | null>(null);
