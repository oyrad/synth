import { useEffect, useState } from 'react';
import { useMidiStore } from '../stores/use-midi-store.tsx';

export function useRequestMidiAccess() {
  const [isGranted, setIsGranted] = useState(false);

  const { setInputs, setSelectedInput } = useMidiStore();

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess()
        .then((midiAccess) => {
          setIsGranted(true);

          if (midiAccess.inputs.size === 0) {
            console.warn('No MIDI inputs found');
            return;
          }

          const inputs = Array.from(midiAccess.inputs.values());

          setInputs(inputs);
          setSelectedInput(inputs[0]);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isGranted, setInputs, setSelectedInput]);

  return { isGranted };
}
