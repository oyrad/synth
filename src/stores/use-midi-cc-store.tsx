import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';
import { type CCKey, toCCKey } from '../utils/midi.ts';

interface CCMapping {
  ccNumber: number;
  channel: number;
}

interface MidiCCStoreValues {
  assignedKnobs: Record<CCKey, string>;
  isAssignModeActive: boolean;
  activeParameterId: string | null;
  setIsAssignModeActive: (isActive: boolean) => void;
  setActiveParameterId: (parameterId: string | null) => void;
  assignKnob: (parameterId: string, mapping: CCMapping) => void;
  unassignKnob: (ccNumber: number, channel: number) => void;
  unassignByParameterId: (parameterId: string) => void;
  getParameterId: (ccNumber: number, channel: number) => string | undefined;
  clearAll: VoidFunction;
}

export const useMidiCCStore = create<MidiCCStoreValues>()(
  persist(
    (set, getState) => ({
      assignedKnobs: {},
      isAssignModeActive: false,
      activeParameterId: null,

      setIsAssignModeActive: (isActive) => set({ isAssignModeActive: isActive }),
      setActiveParameterId: (parameterId) => set({ activeParameterId: parameterId }),

      assignKnob: (parameterId, { ccNumber, channel }) =>
        set((state) => {
          const existing = Object.fromEntries(
            Object.entries(state.assignedKnobs).filter(([, p]) => p !== parameterId),
          );
          return {
            assignedKnobs: {
              ...existing,
              [toCCKey(ccNumber, channel)]: parameterId,
            },
            isAssignModeActive: false,
            activeParameterId: null,
          };
        }),

      unassignKnob: (ccNumber, channel) =>
        set((state) => {
          const { [toCCKey(ccNumber, channel)]: _, ...rest } = state.assignedKnobs;
          return { assignedKnobs: rest };
        }),

      unassignByParameterId: (parameterId) =>
        set((state) => ({
          assignedKnobs: Object.fromEntries(
            Object.entries(state.assignedKnobs).filter(([, p]) => p !== parameterId),
          ),
        })),

      getParameterId: (ccNumber, channel) => getState().assignedKnobs[toCCKey(ccNumber, channel)],

      clearAll: () => set({ assignedKnobs: {} }),
    }),
    {
      name: 'assigned-knobs',
      version: 0,
    },
  ),
);
