import { useEffect, useState } from 'react';

export function useRequestMidiAccess() {
  const [midiInput, setMidiInput] = useState<MIDIInput | null | undefined>(null);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then((midiAccess) => {
        if (midiAccess.inputs.size === 0) {
          console.warn('No MIDI inputs found');
          return;
        }

        const firstInput = midiAccess.inputs.values().next().value;
        console.log('Using MIDI input', firstInput);
        setMidiInput(firstInput);

      }).catch((err) => {
        console.error(err);
      });
    }

  }, []);

  return { midiInput };
}