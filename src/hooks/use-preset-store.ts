import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';
import type { OscillatorData } from '../utils/default-oscillator-data.ts';

export interface Preset {
  id: string;
  name: string;
  data: {
    oscillators: Array<OscillatorData>;
  };
}

interface PresetStoreValues {
  presets: Array<Preset>;
  savePreset: (preset: Preset) => void;
  deletePreset: (id: string) => void;
  getPresets: () => Array<Preset>;
  getPresetById: (id: string) => Preset | undefined;
}

export const usePresetStore = create<PresetStoreValues>()(
  persist(
    (set, getState) => ({
      presets: [],
      savePreset: (preset) => set((state) => ({ presets: [...state.presets, preset] })),
      deletePreset: (id) =>
        set((state) => ({
          presets: state.presets.filter((preset) => preset.id !== id),
        })),
      getPresets: () => getState().presets,
      getPresetById: (id) => getState().presets.find((preset) => preset.id === id),
    }),
    {
      name: 'presets',
      version: 1,
    },
  ),
);
