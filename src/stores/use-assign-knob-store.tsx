import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';

interface CCMapping {
  ccNumber: number;
  channel: number;
}

interface AssignKnobStoreValues {
  isModeActive: boolean;
  activeParameterId: string | null;
  setIsModeActive: (isActive: boolean) => void;
  setActiveParameterId: (parameterId: string | null) => void;
  assignedKnobs: Record<string, CCMapping>;
  assignKnob: (parameterId: string, mapping: CCMapping) => void;
  unassignKnob: (parameterId: string) => void;
  clearAll: VoidFunction;
}

export const useAssignKnobStore = create<AssignKnobStoreValues>()(
  persist(
    (set) => ({
      isModeActive: false,
      activeParameterId: null,

      setIsModeActive: (isActive) => set({ isModeActive: isActive }),
      setActiveParameterId: (parameterId) => set({ activeParameterId: parameterId }),
      assignedKnobs: {},

      assignKnob: (parameterId, mapping) =>
        set((state) => ({
          assignedKnobs: {
            ...state.assignedKnobs,
            [parameterId]: mapping,
          },
          isModeActive: false,
          activeParameterId: null,
        })),

      unassignKnob: (parameterId) =>
        set((state) => {
          const { [parameterId]: _, ...rest } = state.assignedKnobs;
          return { assignedKnobs: rest };
        }),

      clearAll: () => set({ assignedKnobs: {} }),
    }),
    {
      name: 'assigned-knobs',
      version: 0,
    },
  ),
);
