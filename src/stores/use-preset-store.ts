import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';
import { DEFAULT_PRESETS } from '../consts/default-presets.ts';
import type { OscillatorParameters } from '../components/synth/oscillators.tsx';
import type { EnvelopeParameters } from '../components/synth/envelope.tsx';
import type { DelayParameters } from '../components/synth/delay.tsx';
import type { FilterParameters } from '../components/synth/filter.tsx';
import type { NoiseParameters } from '../components/synth/noise.tsx';
import type { DistortionParameters } from '../components/synth/distortion.tsx';
import type { ReverbParameters } from '../components/synth/reverb.tsx';

export interface Preset {
  id: string;
  name: string;
  parameters: {
    oscillators: Array<OscillatorParameters>;
    envelope: EnvelopeParameters;
    reverb: ReverbParameters;
    delay: DelayParameters;
    filter: FilterParameters;
    noise: NoiseParameters;
    distortion: DistortionParameters;
  };
}

interface PresetStoreValues {
  presets: Array<Preset>;
  activePreset: Preset;
  savePreset: (preset: Preset) => void;
  saveNewPreset: ({
    name,
    parameters,
  }: {
    name: string;
    parameters: Preset['parameters'];
  }) => Preset;
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

      savePreset: ({ id, name, parameters }) => {
        set((state) => {
          const updatedPreset = state.presets.find((p) => p.id === id);
          if (!updatedPreset) return state;

          const updated = { ...updatedPreset, name, parameters };

          return {
            presets: state.presets.map((p) => (p.id === id ? updated : p)),
            activePreset: state.activePreset.id === id ? updated : state.activePreset,
          };
        });
      },

      saveNewPreset: ({ name, parameters }) => {
        const id = crypto.randomUUID();

        const newPreset = { id, name, parameters };

        set((state) => ({
          presets: [
            ...state.presets,
            {
              id,
              name,
              parameters,
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
