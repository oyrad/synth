import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';

interface SettingsStoreValues {
  showVisualizer: boolean;
  velocitySensitive: boolean;
  setShowVisualizer: (value: boolean) => void;
  setVelocitySensitive: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsStoreValues>()(
  persist(
    (set) => ({
      showVisualizer: true,
      velocitySensitive: true,
      setShowVisualizer: (value) => set({ showVisualizer: value }),
      setVelocitySensitive: (value) => set({ velocitySensitive: value }),
    }),
    {
      name: 'settings',
      version: 1,
    },
  ),
);
