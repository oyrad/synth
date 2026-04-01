import type { Preset } from '../stores/use-preset-store.ts';

export const DEFAULT_PRESETS: Array<Preset> = [
  {
    id: 'preset-arp-odyssey-oxygene',
    name: 'Oxygène',
    parameters: {
      oscillators: [
        {
          id: 'osc-1',
          isActive: true,
          waveform: 'sawtooth',
          volume: 100,
          detune: -7,
          transpose: 0,
        },
        { id: 'osc-2', waveform: 'sawtooth', isActive: true, volume: 90, detune: 7, transpose: 0 },
        { id: 'osc-3', waveform: 'sine', isActive: false, volume: 90, detune: 7, transpose: 0 },
        { id: 'osc-4', waveform: 'sine', isActive: false, volume: 90, detune: 7, transpose: 0 },
      ],
      amplitude: { attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.4 },
      filter: {
        isActive: false,
        type: 'lowpass',
        frequency: 800,
        resonance: 8,
        depth: 1,
        attack: 0,
        decay: 0,
        sustain: 1,
        release: 0,
      },
      delay: { isActive: true, mix: 0.2, time: 0.3, feedback: 0.3 },
      reverb: { isActive: true, mix: 0.3, time: 1.5 },
      distortion: { isActive: false, amount: 0 },
      noise: { isActive: false, volume: 0 },
    },
  },
  {
    id: 'preset-just-the-two-of-us',
    name: 'Just The Two Of Us',
    parameters: {
      oscillators: [
        { id: 'osc-1', waveform: 'sine', isActive: true, volume: 100, detune: 0, transpose: 0 },
        { id: 'osc-2', waveform: 'sine', isActive: false, volume: 60, detune: 0, transpose: 12 },
        { id: 'osc-3', waveform: 'sine', isActive: false, volume: 60, detune: 0, transpose: 12 },
        { id: 'osc-4', waveform: 'sine', isActive: false, volume: 60, detune: 0, transpose: 12 },
      ],
      amplitude: { attack: 0.01, decay: 0.2, sustain: 0.7, release: 0.3 },
      filter: {
        isActive: true,
        type: 'lowpass',
        frequency: 2000,
        resonance: 2,
        depth: 1000,
        attack: 0,
        decay: 0,
        sustain: 1,
        release: 0,
      },
      delay: { isActive: true, mix: 0.15, time: 0.25, feedback: 0.2 },
      noise: { isActive: false, volume: 0 },
      distortion: { isActive: false, amount: 0 },
      reverb: { isActive: false, mix: 0.25, time: 1.2 },
    },
  },
];
