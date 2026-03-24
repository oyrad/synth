import { create } from 'zustand/react';

interface MidiStoreValues {
  inputs: Array<MIDIInput>;
  selectedInput: MIDIInput | null;
  setInputs: (inputs: Array<MIDIInput>) => void;
  setSelectedInput: (input: MIDIInput) => void;
}

export const useMidiStore = create<MidiStoreValues>()((set) => ({
  inputs: [],
  selectedInput: null,
  setInputs: (inputs) => set({ inputs }),
  setSelectedInput: (input) => set({ selectedInput: input }),
}));
