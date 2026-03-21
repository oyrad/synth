import { useEffect, useState } from 'react';

export function useRequestMidiAccess() {
  const [midiInput, setMidiInput] = useState<MIDIInput | null | undefined>(null);
  const [isGranted, setIsGranted] = useState(false);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then((midiAccess) => {
        setIsGranted(true);

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

  }, [isGranted]);

  return { isGranted, midiInput };
}