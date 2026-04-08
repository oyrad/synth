import { useSynth } from '../../hooks/use-synth.ts';
import { useMidiControls } from '../../hooks/use-midi-controls.tsx';
import { useKeyboard } from '../../hooks/use-keyboard.ts';

export function SoundGenerator() {
  const { noteOn, noteOff } = useSynth();

  useMidiControls({
    onNoteOn: noteOn,
    onNoteOff: noteOff,
  });

  useKeyboard({
    onNoteOn: noteOn,
    onNoteOff: noteOff,
  });

  return null;
}
