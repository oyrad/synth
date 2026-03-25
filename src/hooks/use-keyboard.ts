import { useEffect, useState } from 'react';

const MIDI_CHANNEL = 1;
const VELOCITY = 90;

interface KeyboardHandlers {
  onNoteOn: (note: number, velocity: number, channel: number) => void;
  onNoteOff: (note: number, channel: number) => void;
}

export function useKeyboard({ onNoteOn, onNoteOff }: KeyboardHandlers) {
  const [octave, setOctave] = useState(5);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'a') {
        onNoteOn(12 * octave, VELOCITY, MIDI_CHANNEL);
      } else if (event.key === 'w') {
        onNoteOn(12 * octave + 1, VELOCITY, MIDI_CHANNEL);
      } else if (event.key === 's') {
        onNoteOn(12 * octave + 2, VELOCITY, MIDI_CHANNEL);
      } else if (event.key === 'e') {
        onNoteOn(12 * octave + 3, VELOCITY, MIDI_CHANNEL);
      } else if (event.key === 'd') {
        onNoteOn(12 * octave + 4, VELOCITY, MIDI_CHANNEL);
      } else if (event.key === 'f') {
        onNoteOn(12 * octave + 5, VELOCITY, MIDI_CHANNEL);
      } else if (event.key === 't') {
        onNoteOn(12 * octave + 6, VELOCITY, MIDI_CHANNEL);
      } else if (event.key === 'g') {
        onNoteOn(12 * octave + 7, VELOCITY, MIDI_CHANNEL);
      } else if (event.key === 'y') {
        onNoteOn(12 * octave + 8, VELOCITY, MIDI_CHANNEL);
      } else if (event.key === 'h') {
        onNoteOn(12 * octave + 9, VELOCITY, MIDI_CHANNEL);
      } else if (event.key === 'u') {
        onNoteOn(12 * octave + 10, VELOCITY, MIDI_CHANNEL);
      } else if (event.key === 'j') {
        onNoteOn(12 * octave + 11, VELOCITY, MIDI_CHANNEL);
      } else if (event.key === 'k') {
        onNoteOn(12 * octave + 12, VELOCITY, MIDI_CHANNEL);
      } else if (event.key === '1') {
        setOctave((prev) => Math.max(1, prev - 1));
      } else if (event.key === '2') {
        setOctave((prev) => Math.min(7, prev + 1));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'a') {
        onNoteOff(12 * octave, MIDI_CHANNEL);
      } else if (event.key === 'w') {
        onNoteOff(12 * octave + 1, MIDI_CHANNEL);
      } else if (event.key === 's') {
        onNoteOff(12 * octave + 2, MIDI_CHANNEL);
      } else if (event.key === 'e') {
        onNoteOff(12 * octave + 3, MIDI_CHANNEL);
      } else if (event.key === 'd') {
        onNoteOff(12 * octave + 4, MIDI_CHANNEL);
      } else if (event.key === 'f') {
        onNoteOff(12 * octave + 5, MIDI_CHANNEL);
      } else if (event.key === 't') {
        onNoteOff(12 * octave + 6, MIDI_CHANNEL);
      } else if (event.key === 'g') {
        onNoteOff(12 * octave + 7, MIDI_CHANNEL);
      } else if (event.key === 'y') {
        onNoteOff(12 * octave + 8, MIDI_CHANNEL);
      } else if (event.key === 'h') {
        onNoteOff(12 * octave + 9, MIDI_CHANNEL);
      } else if (event.key === 'u') {
        onNoteOff(12 * octave + 10, MIDI_CHANNEL);
      } else if (event.key === 'j') {
        onNoteOff(12 * octave + 11, MIDI_CHANNEL);
      } else if (event.key === 'k') {
        onNoteOff(12 * octave + 12, MIDI_CHANNEL);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [octave, onNoteOff, onNoteOn]);
}
