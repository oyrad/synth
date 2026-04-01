import { createContext } from 'react';

export interface AudioContextValue {
  isAudioReady: boolean;
  getAudioContext: () => AudioContext;
  getAnalyser: () => AnalyserNode;
  getDelay: () => {
    delayNode: DelayNode;
    feedbackGain: GainNode;
    wetGain: GainNode;
    dryGain: GainNode;
  };
  getNoiseBuffer: () => AudioBuffer;
  getDistortion: () => WaveShaperNode;
  getReverb: () => {
    reverbNode: ConvolverNode;
    reverbWetGain: GainNode;
  };
  getLFO: () => {
    oscillator: OscillatorNode;
    gain: GainNode;
  };
}

export const AudioCtx = createContext<AudioContextValue | null>(null);
