import { useCallback, useRef } from 'react';
import { midiNoteToFrequency } from '../utils/audio.ts';
import { useAudioCtx } from './use-audio-context.ts';

interface Voice {
  oscillator: OscillatorNode;
  gain: GainNode;
}

interface UseSynthParams {
  waveform: OscillatorType;
  isVelocitySensitive: boolean;
}

export function useSynth({ waveform, isVelocitySensitive }: UseSynthParams) {
  const voices = useRef<Record<number, Voice>>({});

  const { getAudioContext, getAnalyser } = useAudioCtx();

  const audioContext = getAudioContext();
  const analyser = getAnalyser();

  const noteOn = useCallback((note: number, velocity: number) => {
    if (voices.current[note]) {
      return;
    }

    const oscillator = audioContext.createOscillator();
    oscillator.type = waveform;
    oscillator.frequency.value = midiNoteToFrequency(note);

    const gainNode = audioContext.createGain();
    gainNode.gain.value = isVelocitySensitive ? velocity / 127 * 0.33 : 0.33;

    oscillator.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioContext.destination);
    oscillator.start();

    voices.current[note] = { oscillator, gain: gainNode };
  }, [audioContext, analyser, waveform, isVelocitySensitive]);

  const noteOff = useCallback((note: number) => {
    const voice = voices.current[note];
    if (!voice) {
      return;
    }

    const { gain, oscillator } = voice;
    const now = audioContext.currentTime;

    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    oscillator.stop(now + 0.1);
    oscillator.addEventListener('ended', () => oscillator.disconnect());

    delete voices.current[note];
  }, [audioContext]);

  return { noteOn, noteOff };
}