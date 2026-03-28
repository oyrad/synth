import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';
import { DEFAULT_PRESETS } from '../consts/default-presets.ts';
import type { OscillatorData } from '../components/oscillators/oscillators.tsx';
import type { AdsrEnvelope } from '../components/adsr/adsr.tsx';
import type { DelayData } from '../components/effects/delay.tsx';
import type { FilterData } from '../components/filter/filter.tsx';
import type { NoiseData } from '../components/noise.tsx';

export interface Preset {
  id: string;
  name: string;
  data: {
    oscillators: Array<OscillatorData>;
    adsr: AdsrEnvelope;
    delay: DelayData;
    filter: FilterData;
    noise: NoiseData;
  };
}

interface PresetStoreValues {
  presets: Array<Preset>;
  activePreset: Preset;
  savePreset: (preset: Preset) => void;
  saveNewPreset: ({ name, data }: { name: string; data: Preset['data'] }) => Preset;
  deletePreset: (id: string) => void;
  setActivePreset: (id: string) => void;
  nextPreset: () => Preset | undefined;
  previousPreset: () => Preset | undefined;
}

export const usePresetStore = create<PresetStoreValues>()(
  persist(
    (set, get) => ({
      presets: DEFAULT_PRESETS,
      activePreset: DEFAULT_PRESETS[0],

      savePreset: ({ id, name, data }) => {
        set((state) => {
          const updatedPreset = state.presets.find((p) => p.id === id);
          if (!updatedPreset) return state;

          const updated = { ...updatedPreset, name, data };

          return {
            presets: state.presets.map((p) => (p.id === id ? updated : p)),
            activePreset: state.activePreset.id === id ? updated : state.activePreset,
          };
        });
      },

      saveNewPreset: ({ name, data }) => {
        const id = crypto.randomUUID();

        const newPreset = { id, name, data };

        set((state) => ({
          presets: [
            ...state.presets,
            {
              id,
              name,
              data,
            },
          ],
          activePreset: newPreset,
        }));

        return newPreset;
      },

      deletePreset: (id) =>
        set((state) => ({
          presets: state.presets.filter((preset) => preset.id !== id),
        })),

      setActivePreset: (id) =>
        set({
          activePreset: get().presets.find((preset) => preset.id === id) || get().activePreset,
        }),

      nextPreset: () => {
        const { presets, activePreset } = get();
        const index = presets.findIndex((p) => p.id === activePreset.id);
        const next = presets[(index + 1) % presets.length];
        set({ activePreset: next });
        return next;
      },

      previousPreset: () => {
        const { presets, activePreset } = get();
        const index = presets.findIndex((p) => p.id === activePreset.id);
        const prev = presets[(index - 1 + presets.length) % presets.length];
        set({ activePreset: prev });
        return prev;
      },
    }),
    {
      name: 'presets',
      version: 1,
    },
  ),
);
