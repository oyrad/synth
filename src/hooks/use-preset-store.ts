import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';
import { DEFAULT_PRESETS } from '../consts/default-presets.ts';
import type { OscillatorData } from '../components/oscillators/oscillators.tsx';
import type { AdsrEnvelope } from '../components/adsr/adsr.tsx';

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
  activePresetId: string | null;
  getActivePreset: () => Preset | undefined;
  savePreset: ({ id, data }: { id: string; data: Preset['data'] }) => void;
  saveNewPreset: ({ name, data }: { name: string; data: Preset['data'] }) => void;
  deletePreset: (id: string) => void;
  setActivePreset: (id: string) => void;
  nextPreset: () => Preset | undefined;
  previousPreset: () => Preset | undefined;
}

export const usePresetStore = create<PresetStoreValues>()(
  persist(
    (set, get) => ({
      presets: DEFAULT_PRESETS,
      activePresetId: DEFAULT_PRESETS[0].id,

      getActivePreset: () => {
        const { presets, activePresetId } = get();
        return presets.find((p) => p.id === activePresetId);
      },

      savePreset: ({ id, data }) => {
        const preset = get().presets.find((p) => p.id === id);
        if (preset) {
          set((state) => ({
            presets: state.presets.map((p) =>
              p.id === id
                ? {
                    ...p,
                    data,
                  }
                : p,
            ),
          }));
        }
      },

      saveNewPreset: ({ name, data }) => {
        const id = crypto.randomUUID();

        set((state) => ({
          presets: [
            ...state.presets,
            {
              id,
              name,
              data,
            },
          ],
          activePresetId: id,
        }));
      },

      deletePreset: (id) =>
        set((state) => ({
          presets: state.presets.filter((preset) => preset.id !== id),
        })),

      setActivePreset: (id) => set({ activePresetId: id }),

      nextPreset: () => {
        const { presets, activePresetId } = get();
        const index = presets.findIndex((p) => p.id === activePresetId);
        const next = presets[(index + 1) % presets.length];
        set({ activePresetId: next.id });
        return next;
      },

      previousPreset: () => {
        const { presets, activePresetId } = get();
        const index = presets.findIndex((p) => p.id === activePresetId);
        const prev = presets[(index - 1 + presets.length) % presets.length];
        set({ activePresetId: prev.id });
        return prev;
      },
    }),
    {
      name: 'presets',
      version: 1,
    },
  ),
);
