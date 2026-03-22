import { createContext } from 'react';

interface AudioContextValue {
  isAudioReady: boolean;
  getAudioContext: () => AudioContext;
  getAnalyser: () => AnalyserNode;
}

export const AudioCtx = createContext<AudioContextValue | null>(null);
