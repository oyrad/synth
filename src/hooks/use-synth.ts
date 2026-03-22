import { useCallback, useRef } from 'react';
import { midiNoteToFrequency } from '../utils/audio.ts';
import { useAudioCtx } from './use-audio-context.ts';
import type { OscillatorData } from '../utils/default-oscillator-data.ts';

interface Voice {
  oscillators: Array<{
    id: string;
    oscillator: OscillatorNode;
    gain: GainNode;
    velocity: number;
  }>;
}

interface UseSynthParams {
  oscillators: Array<OscillatorData>;
}

export function useSynth({ oscillators }: UseSynthParams) {
  const voices = useRef<Record<number, Voice>>({});

  const { getAudioContext, getAnalyser } = useAudioCtx();

  const noteOn = useCallback(
    (note: number, velocity: number) => {
      const audioContext = getAudioContext();
      const analyser = getAnalyser();

      if (voices.current[note]) {
        return;
      }

      const noteVoices = oscillators.map((oscillatorData) => {
        const osc = audioContext.createOscillator();
        osc.type = oscillatorData.waveform;
        osc.frequency.value = midiNoteToFrequency(note);
        osc.detune.value = oscillatorData.detune;

        const gainNode = audioContext.createGain();
        gainNode.gain.value =
          (oscillatorData.velocitySensitive
            ? (velocity / 127) * (0.33 / Math.sqrt(oscillators.length))
            : 0.33 / Math.sqrt(oscillators.length)) *
          (oscillatorData.volume / 100);

        osc.connect(gainNode);
        gainNode.connect(analyser);
        osc.start();

        return { id: oscillatorData.id, oscillator: osc, gain: gainNode, velocity };
      });

      analyser.connect(audioContext.destination);
      voices.current[note] = { oscillators: noteVoices };
    },
    [getAnalyser, getAudioContext, oscillators],
  );

  const noteOff = useCallback(
    (note: number) => {
      const audioContext = getAudioContext();

      const voice = voices.current[note];
      if (!voice) {
        return;
      }

      const now = audioContext.currentTime;

      voice.oscillators.forEach(({ oscillator, gain }) => {
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        oscillator.stop(now + 0.1);
        oscillator.addEventListener('ended', () => oscillator.disconnect());
      });

      delete voices.current[note];
    },
    [getAudioContext],
  );

  const updateVoices = useCallback((updatedOscillators: Array<OscillatorData>) => {
    Object.values(voices.current).forEach((voice) => {
      voice.oscillators.forEach((voiceOsc) => {
        const oscillatorData = updatedOscillators.find((o) => o.id === voiceOsc.id);
        if (!oscillatorData) {
          return;
        }

        voiceOsc.oscillator.type = oscillatorData.waveform;
        voiceOsc.oscillator.detune.value = oscillatorData.detune;

        voiceOsc.gain.gain.value =
          (oscillatorData.velocitySensitive
            ? (voiceOsc.velocity / 127) * (0.33 / Math.sqrt(updatedOscillators.length))
            : 0.33 / Math.sqrt(updatedOscillators.length)) *
          (oscillatorData.volume / 100);
      });
    });
  }, []);

  return { noteOn, noteOff, updateVoices };
}
