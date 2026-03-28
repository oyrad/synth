import { create } from 'zustand/react';
import { DEFAULT_PRESETS } from '../consts/default-presets.ts';
import { DEFAULT_OSCILLATOR } from '../consts/default-oscillator.ts';
import type { Preset } from './use-preset-store.ts';

interface SynthStoreValues {
  oscillators: Preset['data']['oscillators'];
  adsr: Preset['data']['adsr'];
  delay: Preset['data']['delay'];
  filter: Preset['data']['filter'];
  noise: Preset['data']['noise'];
  addOscillator: VoidFunction;
  removeOscillator: (id: string) => void;
  updateOscillator: (id: string, data: Partial<Preset['data']['oscillators']>) => void;
  updateAdsr: (data: Partial<Preset['data']['adsr']>) => void;
  updateDelay: (delay: Partial<Preset['data']['delay']>) => void;
  updateFilter: (filter: Partial<Preset['data']['filter']>) => void;
  updateNoise: (noise: Partial<Preset['data']['noise']>) => void;
  loadSynthData: (data: Preset['data']) => void;
}

export const useSynthStore = create<SynthStoreValues>()((set) => ({
  oscillators: DEFAULT_PRESETS[0].data.oscillators,
  adsr: DEFAULT_PRESETS[0].data.adsr,
  delay: DEFAULT_PRESETS[0].data.delay,
  filter: DEFAULT_PRESETS[0].data.filter,
  noise: DEFAULT_PRESETS[0].data.noise,

  addOscillator: () =>
    set((state) => ({
      oscillators: [...state.oscillators, { ...DEFAULT_OSCILLATOR, id: crypto.randomUUID() }],
    })),

  removeOscillator: (id) =>
    set((state) => ({
      oscillators: state.oscillators.filter((osc) => osc.id !== id),
    })),

  updateOscillator: (id, data) =>
    set((state) => ({
      oscillators: state.oscillators.map((osc) => (osc.id === id ? { ...osc, ...data } : osc)),
    })),

  updateAdsr: (data) =>
    set((state) => ({
      adsr: { ...state.adsr, ...data },
    })),

  updateDelay: (delay) =>
    set((state) => ({
      delay: { ...state.delay, ...delay },
    })),

  updateFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
    })),

  updateNoise: (noise) =>
    set((state) => ({
      noise: { ...state.noise, ...noise },
    })),

  loadSynthData: (data) => set(data),
}));
