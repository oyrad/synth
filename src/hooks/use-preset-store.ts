import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';
import { DEFAULT_PRESETS } from '../consts/default-presets.ts';
import type { OscillatorData } from '../components/oscillators.tsx';
import type { AdsrEnvelope } from '../components/adsr.tsx';

export interface Preset {
  id: string;
  name: string;
  data: {
    oscillators: Array<OscillatorData>;
    adsr: AdsrEnvelope;
  };
}

interface PresetStoreValues {
  presets: Array<Preset>;
  savePreset: (preset: Preset) => void;
  deletePreset: (id: string) => void;
}

export const usePresetStore = create<PresetStoreValues>()(
  persist(
    (set) => ({
      presets: DEFAULT_PRESETS,
      savePreset: (preset) => set((state) => ({ presets: [...state.presets, preset] })),
      deletePreset: (id) =>
        set((state) => ({
          presets: state.presets.filter((preset) => preset.id !== id),
        })),
    }),
    {
      name: 'presets',
      version: 1,
    },
  ),
);
