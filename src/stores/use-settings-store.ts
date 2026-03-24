import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';

interface SettingsStoreValues {
  showVisualizer: boolean;
  velocitySensitive: boolean;
  masterVolume: number;
  masterTune: number;
  setShowVisualizer: (value: boolean) => void;
  setVelocitySensitive: (value: boolean) => void;
  setMasterVolume: (value: number) => void;
  setMasterTune: (value: number) => void;
}

export const useSettingsStore = create<SettingsStoreValues>()(
  persist(
    (set) => ({
      showVisualizer: true,
      velocitySensitive: true,
      masterVolume: 75,
      masterTune: 0,
      setShowVisualizer: (value) => set({ showVisualizer: value }),
      setVelocitySensitive: (value) => set({ velocitySensitive: value }),
      setMasterVolume: (value) => set({ masterVolume: value }),
      setMasterTune: (value) => set({ masterTune: value }),
    }),
    {
      name: 'settings',
      version: 1,
    },
  ),
);
