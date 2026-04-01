import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';

interface SettingsStoreValues {
  velocitySensitive: boolean;
  keyboardPlaying: boolean;
  masterVolume: number;
  masterTune: number;
  setVelocitySensitive: (value: boolean) => void;
  setKeyboardPlaying: (value: boolean) => void;
  setMasterVolume: (value: number) => void;
  setMasterTune: (value: number) => void;
}

export const useSettingsStore = create<SettingsStoreValues>()(
  persist(
    (set) => ({
      velocitySensitive: true,
      keyboardPlaying: false,
      masterVolume: 75,
      masterTune: 0,
      setVelocitySensitive: (value) => set({ velocitySensitive: value }),
      setKeyboardPlaying: (value) => set({ keyboardPlaying: value }),
      setMasterVolume: (value) => set({ masterVolume: value }),
      setMasterTune: (value) => set({ masterTune: value }),
    }),
    {
      name: 'settings',
      version: 1,
    },
  ),
);
