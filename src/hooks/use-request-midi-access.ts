import { useEffect, useState } from 'react';
import { useMidiStore } from '../stores/use-midi-store.tsx';
import { useSettingsStore } from '../stores/use-settings-store.ts';

export function useRequestMidiAccess() {
  const [isGranted, setIsGranted] = useState(false);

  const { setInputs, setSelectedInput } = useMidiStore();
  const setKeyboardPlaying = useSettingsStore((s) => s.setKeyboardPlaying);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess()
        .then((midiAccess) => {
          setIsGranted(true);

          if (midiAccess.inputs.size === 0) {
            setKeyboardPlaying(true);
            console.warn('No MIDI inputs found');
            return;
          }

          const inputs = Array.from(midiAccess.inputs.values());

          setInputs(inputs);
          setSelectedInput(inputs[0]);
        })
        .catch((err) => {
          setKeyboardPlaying(true);
          console.error(err);
        });
    }
  }, [isGranted, setInputs, setKeyboardPlaying, setSelectedInput]);

  return { isGranted };
}
