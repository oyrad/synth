import { create } from 'zustand/react';

interface HotkeyStoreValues {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

export const useHotkeyStore = create<HotkeyStoreValues>()((set) => ({
  enabled: true,
  setEnabled: (value) => set({ enabled: value }),
}));
