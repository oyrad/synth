import { useCallback, useRef } from 'react';
import { midiNoteToFrequency } from '../utils/audio.ts';
import { useAudioCtx } from './use-audio-context.ts';
import type { OscillatorData } from '../components/oscillators.tsx';
import type { AdsrEnvelope } from '../components/adsr.tsx';

interface Voice {
  masterGain: GainNode;
  oscillators: Array<{
    id: string;
    oscillator: OscillatorNode;
    gain: GainNode;
    velocity: number;
  }>;
}

interface UseSynthParams {
  oscillators: Array<OscillatorData>;
  adsr: AdsrEnvelope;
}

export function useSynth({ oscillators, adsr }: UseSynthParams) {
  const voices = useRef<Record<number, Voice>>({});

  const { getAudioContext, getAnalyser } = useAudioCtx();

  const noteOn = useCallback(
    (note: number, velocity: number) => {
      const audioContext = getAudioContext();
      const analyser = getAnalyser();

      if (voices.current[note]) {
        return;
      }

      const { attack, decay, sustain } = adsr;

      const masterGain = audioContext.createGain();
      const now = audioContext.currentTime;

      masterGain.gain.setValueAtTime(0, now);

      if (attack > 0) {
        masterGain.gain.linearRampToValueAtTime(1, now + attack);
      } else {
        masterGain.gain.setValueAtTime(1, now);
      }

      masterGain.gain.linearRampToValueAtTime(sustain, now + attack + decay);

      const noteVoices = oscillators.map((oscillatorData) => {
        const osc = audioContext.createOscillator();
        osc.type = oscillatorData.waveform;
        osc.frequency.value = midiNoteToFrequency(note);
        osc.detune.value = oscillatorData.detune + oscillatorData.transpose * 100;

        const gainNode = audioContext.createGain();
        gainNode.gain.value =
          (oscillatorData.velocitySensitive
            ? (velocity / 127) * (0.33 / Math.sqrt(oscillators.length))
            : 0.33 / Math.sqrt(oscillators.length)) *
          (oscillatorData.volume / 100);

        osc.connect(gainNode);
        gainNode.connect(masterGain);
        osc.start();

        return { id: oscillatorData.id, oscillator: osc, gain: gainNode, velocity };
      });

      masterGain.connect(analyser);

      analyser.connect(audioContext.destination);
      voices.current[note] = { masterGain, oscillators: noteVoices };
    },
    [adsr, getAnalyser, getAudioContext, oscillators],
  );

  const noteOff = useCallback(
    (note: number) => {
      const audioContext = getAudioContext();

      const voice = voices.current[note];
      if (!voice) {
        return;
      }

      const masterGain = voice.masterGain;
      const now = audioContext.currentTime;

      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + adsr.release);

      voice.oscillators.forEach(({ oscillator }) => {
        oscillator.stop(now + adsr.release);
        oscillator.addEventListener('ended', () => oscillator.disconnect());
      });

      delete voices.current[note];
    },
    [adsr.release, getAudioContext],
  );

  const updateVoices = useCallback((updatedOscillators: Array<OscillatorData>) => {
    Object.values(voices.current).forEach((voice) => {
      voice.oscillators.forEach((voiceOsc) => {
        const oscillatorData = updatedOscillators.find((o) => o.id === voiceOsc.id);
        if (!oscillatorData) {
          return;
        }

        voiceOsc.oscillator.type = oscillatorData.waveform;
        voiceOsc.oscillator.detune.value =
          oscillatorData.detune + oscillatorData.transpose * 100;

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
