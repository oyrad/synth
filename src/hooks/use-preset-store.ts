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

const DEFAULT_PRESETS: Array<Preset> = [
  {
    id: 'default-init',
    name: 'Init',
    data: {
      oscillators: [
        {
          id: 'init-osc-1',
          waveform: 'sine',
          volume: 100,
          detune: 0,
          velocitySensitive: true,
        },
      ],
    },
  },
  {
    id: 'default-saw-lead',
    name: 'Saw lead',
    data: {
      oscillators: [
        {
          id: 'saw-lead-osc-1',
          waveform: 'sawtooth',
          volume: 100,
          detune: 0,
          velocitySensitive: true,
        },
      ],
    },
  },
  {
    id: 'default-fat-saw',
    name: 'Fat saw',
    data: {
      oscillators: [
        {
          id: 'fat-saw-osc-1',
          waveform: 'sawtooth',
          volume: 100,
          detune: -7,
          velocitySensitive: true,
        },
        {
          id: 'fat-saw-osc-2',
          waveform: 'sawtooth',
          volume: 100,
          detune: 7,
          velocitySensitive: true,
        },
        {
          id: 'fat-saw-osc-3',
          waveform: 'sawtooth',
          volume: 80,
          detune: 0,
          velocitySensitive: true,
        },
      ],
    },
  },
  {
    id: 'default-hollow',
    name: 'Hollow',
    data: {
      oscillators: [
        {
          id: 'hollow-osc-1',
          waveform: 'square',
          volume: 100,
          detune: 0,
          velocitySensitive: true,
        },
        {
          id: 'hollow-osc-2',
          waveform: 'square',
          volume: 60,
          detune: -5,
          velocitySensitive: false,
        },
      ],
    },
  },
  {
    id: 'default-soft-pad',
    name: 'Soft pad',
    data: {
      oscillators: [
        {
          id: 'soft-pad-osc-1',
          waveform: 'sine',
          volume: 100,
          detune: 0,
          velocitySensitive: true,
        },
        {
          id: 'soft-pad-osc-2',
          waveform: 'triangle',
          volume: 80,
          detune: 3,
          velocitySensitive: true,
        },
        {
          id: 'soft-pad-osc-3',
          waveform: 'sine',
          volume: 60,
          detune: -3,
          velocitySensitive: false,
        },
      ],
    },
  },
  {
    id: 'default-organ',
    name: 'Organ',
    data: {
      oscillators: [
        {
          id: 'organ-osc-1',
          waveform: 'sine',
          volume: 100,
          detune: 0,
          velocitySensitive: false,
        },
        {
          id: 'organ-osc-2',
          waveform: 'sine',
          volume: 70,
          detune: 0,
          velocitySensitive: false,
        },
        {
          id: 'organ-osc-3',
          waveform: 'sine',
          volume: 50,
          detune: 0,
          velocitySensitive: false,
        },
      ],
    },
  },
  {
    id: 'default-harsh',
    name: 'Harsh',
    data: {
      oscillators: [
        {
          id: 'harsh-osc-1',
          waveform: 'square',
          volume: 100,
          detune: 0,
          velocitySensitive: true,
        },
        {
          id: 'harsh-osc-2',
          waveform: 'sawtooth',
          volume: 80,
          detune: 50,
          velocitySensitive: true,
        },
      ],
    },
  },
];

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
