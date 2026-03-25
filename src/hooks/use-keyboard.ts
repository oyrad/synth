import { useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '../stores/use-settings-store.ts';
import { useHotkeyStore } from '../stores/use-hotkey-store.ts';

const MIDI_CHANNEL = 1;
const VELOCITY = 90;

const KEY_TO_SEMITONE: Record<string, number> = {
  a: 0,
  w: 1,
  s: 2,
  e: 3,
  d: 4,
  f: 5,
  t: 6,
  g: 7,
  y: 8,
  h: 9,
  u: 10,
  j: 11,
  k: 12,
};

interface KeyboardHandlers {
  onNoteOn: (note: number, velocity: number, channel: number) => void;
  onNoteOff: (note: number, channel: number) => void;
}

export function useKeyboard({ onNoteOn, onNoteOff }: KeyboardHandlers) {
  const [octave, setOctave] = useState(5);
  const octaveRef = useRef(octave);

  const isKeyboardPlayingActive = useSettingsStore((s) => s.keyboardPlaying);
  const hotkeysEnabled = useHotkeyStore((s) => s.enabled);

  useEffect(() => {
    octaveRef.current = octave;
  }, [octave]);

  useEffect(() => {
    if (!isKeyboardPlayingActive || !hotkeysEnabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;

      const key = event.key.toLowerCase();

      if (key === '1') {
        setOctave((prev) => Math.max(1, prev - 1));
        return;
      }

      if (key === '2') {
        setOctave((prev) => Math.min(9, prev + 1));
        return;
      }

      const semitone = KEY_TO_SEMITONE[key];
      if (semitone === undefined) {
        return;
      }

      onNoteOn(12 * octaveRef.current + semitone, VELOCITY, MIDI_CHANNEL);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const semitone = KEY_TO_SEMITONE[key];
      if (semitone === undefined) {
        return;
      }

      onNoteOff(12 * octaveRef.current + semitone, MIDI_CHANNEL);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onNoteOn, onNoteOff, isKeyboardPlayingActive, hotkeysEnabled]);
}
