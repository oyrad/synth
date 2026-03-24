import { useEffect } from 'react';
import { parseMidiMessage } from '../utils/midi.ts';
import { useMidiStore } from '../stores/use-midi-store.tsx';

interface MidiHandlers {
  onNoteOn?: (note: number, velocity: number, channel: number) => void;
  onNoteOff?: (note: number, channel: number) => void;
  onCC?: (controller: number, value: number, channel: number) => void;
}

export function useMidi(handlers: MidiHandlers) {
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
        case 'noteOn':
          handlers.onNoteOn?.(msg.data1, msg.data2, msg.channel);
          break;
        case 'noteOff':
          handlers.onNoteOff?.(msg.data1, msg.channel);
          break;
        case 'cc':
          handlers.onCC?.(msg.data1, msg.data2, msg.channel);
          break;
      }
    };

    midiInput.addEventListener('midimessage', onMessage);

    return () => midiInput.removeEventListener('midimessage', onMessage);
  }, [midiInput, handlers]);

  return null;
}
