import { useEffect } from 'react';
import { parseMidiMessage } from '../utils/midi.ts';
import { useMidiStore } from '../stores/use-midi-store.tsx';

interface UseMidiParams {
  onNoteOn: (note: number, velocity: number, channel: number) => void;
  onNoteOff: (note: number, channel: number) => void;
  onCC?: (controller: number, value: number, channel: number) => void;
}

export function useMidi({ onNoteOn, onNoteOff, onCC }: UseMidiParams) {
  const { selectedInput: midiInput } = useMidiStore();

  useEffect(() => {
    if (!midiInput) {
      return;
    }

    const onMessage = (event: MIDIMessageEvent) => {
      if (!event.data) {
        return;
      }

      const msg = parseMidiMessage(event.data);

      switch (msg.type) {
        case 'note_on':
          onNoteOn(msg.data1, msg.data2, msg.channel);
          break;
        case 'note_off':
          onNoteOff(msg.data1, msg.channel);
          break;
        case 'cc':
          onCC?.(msg.data1, msg.data2, msg.channel);
          break;
      }
    };

    midiInput.addEventListener('midimessage', onMessage);

    return () => midiInput.removeEventListener('midimessage', onMessage);
  }, [midiInput, onNoteOn, onNoteOff, onCC]);

  return null;
}
