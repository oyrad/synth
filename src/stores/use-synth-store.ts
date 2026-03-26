import { create } from 'zustand/react';
import { DEFAULT_PRESETS } from '../consts/default-presets.ts';
import type { OscillatorData } from '../components/oscillators/oscillators.tsx';
import type { AdsrEnvelope } from '../components/adsr/adsr.tsx';
import { DEFAULT_OSCILLATOR } from '../consts/default-oscillator.ts';
import type { Preset } from './use-preset-store.ts';

interface SynthStoreValues {
  oscillators: Array<OscillatorData>;
  adsr: AdsrEnvelope;
  addOscillator: VoidFunction;
  removeOscillator: (id: string) => void;
  updateOscillator: (id: string, data: Partial<OscillatorData>) => void;
  updateAdsr: (data: Partial<AdsrEnvelope>) => void;
  loadSynthData: (data: Preset['data']) => void;
}

export const useSynthStore = create<SynthStoreValues>()((set) => ({
  oscillators: DEFAULT_PRESETS[0].data.oscillators,
  adsr: DEFAULT_PRESETS[0].data.adsr,

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

  loadSynthData: (data) =>
    set({
      oscillators: data.oscillators,
      adsr: data.adsr,
    }),
}));
