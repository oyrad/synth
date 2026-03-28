import { create } from 'zustand';
import { DEFAULT_PRESETS } from '../consts/default-presets.ts';
import { DEFAULT_OSCILLATOR_PARAMETERS } from '../consts/default-oscillator.ts';
import type { Preset } from './use-preset-store.ts';

interface SynthStoreValues {
  parameters: Preset['parameters'];
  addOscillator: VoidFunction;
  removeOscillator: (id: string) => void;
  updateOscillator: (
    id: string,
    oscillator: Partial<Preset['parameters']['oscillators'][0]>,
  ) => void;
  updateEnvelope: (envelope: Partial<Preset['parameters']['envelope']>) => void;
  updateDelay: (delay: Partial<Preset['parameters']['delay']>) => void;
  updateFilter: (filter: Partial<Preset['parameters']['filter']>) => void;
  updateNoise: (noise: Partial<Preset['parameters']['noise']>) => void;
  loadSynthParameters: (parameters: Preset['parameters']) => void;
}

export const useSynthStore = create<SynthStoreValues>()((set) => ({
  parameters: DEFAULT_PRESETS[0].parameters,

  addOscillator: () =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        oscillators: [
          ...state.parameters.oscillators,
          { ...DEFAULT_OSCILLATOR_PARAMETERS, id: crypto.randomUUID() },
        ],
      },
    })),

  removeOscillator: (id) =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        oscillators: state.parameters.oscillators.filter((osc) => osc.id !== id),
      },
    })),

  updateOscillator: (id, oscillator) =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        oscillators: state.parameters.oscillators.map((osc) =>
          osc.id === id ? { ...osc, ...oscillator } : osc,
        ),
      },
    })),

  updateEnvelope: (envelope) =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        envelope: { ...state.parameters.envelope, ...envelope },
      },
    })),

  updateDelay: (delay) =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        delay: { ...state.parameters.delay, ...delay },
      },
    })),

  updateFilter: (filter) =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        filter: { ...state.parameters.filter, ...filter },
      },
    })),

  updateNoise: (noise) =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        noise: { ...state.parameters.noise, ...noise },
      },
    })),

  loadSynthParameters: (parameters) => set({ parameters }),
}));
