// useSynth.ts
import { useCallback, useRef } from 'react';
import { midiNoteToFrequency } from '../utils/audio.ts';

interface Voice {
  oscillator: OscillatorNode;
  gain: GainNode;
}

interface UseSynthParams {
  waveForm: OscillatorType;
}

export function useSynth({ waveForm = 'sine' }: UseSynthParams) {
  const ctx = useRef<AudioContext | null>(null);
  const voices = useRef<Record<number, Voice>>({});

  const getCtx = (): AudioContext => {
    if (!ctx.current) {
      ctx.current = new AudioContext();
    }

    return ctx.current;
  };

  const noteOn = useCallback((note: number, velocity: number) => {
    const context = getCtx();
    if (voices.current[note]) {
      return;
    }

    const oscillator = context.createOscillator();
    oscillator.type = waveForm;
    oscillator.frequency.value = midiNoteToFrequency(note);

    const gainNode = context.createGain();
    gainNode.gain.value = (velocity / 127) * 0.33;

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start();

    voices.current[note] = { oscillator, gain: gainNode };
  }, [waveForm]);

  const noteOff = useCallback((note: number) => {
    const context = getCtx();
    const voice = voices.current[note];
    if (!voice) {
      return;
    }

    const { gain, oscillator } = voice;
    const now = context.currentTime;

    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    oscillator.stop(now + 0.1);
    oscillator.addEventListener('ended', () => oscillator.disconnect());

    delete voices.current[note];
  }, []);

  const resume = useCallback(() => {
    return getCtx().resume();
  }, []);

  return { resume, noteOn, noteOff };
}