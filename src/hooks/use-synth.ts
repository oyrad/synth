import { useCallback, useEffect, useRef } from 'react';
import { calculateVelocity, midiNoteToFrequency } from '../utils/audio.ts';
import { useAudioCtx } from './use-audio-context.ts';
import type { OscillatorData } from '../components/oscillators/oscillators.tsx';
import type { AdsrEnvelope } from '../components/adsr/adsr.tsx';
import { useSettingsStore } from '../stores/use-settings-store.ts';
import type { DelayEffect } from '../components/effects/delay.tsx';

interface Voice {
  masterGain: GainNode;
  oscillators: Array<{
    id: string;
    oscillator: OscillatorNode | null;
    gain: GainNode | null;
    velocity: number;
  }>;
}

interface UseSynthParams {
  oscillators: Array<OscillatorData>;
  adsr: AdsrEnvelope;
  delay: DelayEffect;
}

export function useSynth({ oscillators, adsr, delay }: UseSynthParams) {
  const voices = useRef<Record<number, Voice>>({});

  const { getAudioContext, getAnalyser } = useAudioCtx();

  const velocitySensitive = useSettingsStore((s) => s.velocitySensitive);

  const masterVolume = useSettingsStore((s) => s.masterVolume);
  const masterTune = useSettingsStore((s) => s.masterTune);

  const delayNode = useRef<DelayNode | null>(null);
  const feedbackNode = useRef<GainNode | null>(null);
  const wetGain = useRef<GainNode | null>(null);
  const dryGain = useRef<GainNode | null>(null);

  useEffect(() => {
    const ctx = getAudioContext();
    const analyser = getAnalyser();

    delayNode.current = ctx.createDelay(5.0);
    feedbackNode.current = ctx.createGain();
    wetGain.current = ctx.createGain();
    dryGain.current = ctx.createGain();

    // Feedback Loop: Delay -> Feedback -> Delay
    delayNode.current.connect(feedbackNode.current);
    feedbackNode.current.connect(delayNode.current);

    // Output Path
    delayNode.current.connect(wetGain.current);
    wetGain.current.connect(analyser);
    dryGain.current.connect(analyser);
  }, [getAudioContext, getAnalyser]);

  useEffect(() => {
    if (!delayNode.current || !feedbackNode.current || !wetGain.current || !dryGain.current) return;

    const now = getAudioContext().currentTime;
    const ramp = 0.05; // Prevents "zipper" noise/clicks during adjustments

    delayNode.current.delayTime.linearRampToValueAtTime(delay.time, now + ramp);
    feedbackNode.current.gain.linearRampToValueAtTime(delay.feedback, now + ramp);

    // Constant Power or Linear Mix
    dryGain.current.gain.linearRampToValueAtTime(1 - delay.mix, now + ramp);
    wetGain.current.gain.linearRampToValueAtTime(delay.mix, now + ramp);
  }, [delay, getAudioContext]);

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
        if (oscillatorData.isMute) {
          return {
            id: oscillatorData.id,
            oscillator: null,
            gain: null,
            velocity,
          };
        }

        const osc = audioContext.createOscillator();
        osc.type = oscillatorData.waveform;
        osc.frequency.value = midiNoteToFrequency(note);
        osc.detune.value = oscillatorData.detune + oscillatorData.transpose * 100 + masterTune;

        const gainNode = audioContext.createGain();
        gainNode.gain.value = calculateVelocity({
          velocity: velocitySensitive ? velocity : 127,
          numOscillators: oscillators.length,
          oscVolume: oscillatorData.volume,
          masterVolume,
        });

        osc.connect(gainNode);
        gainNode.connect(masterGain);
        osc.start();

        return { id: oscillatorData.id, oscillator: osc, gain: gainNode, velocity };
      });

      if (dryGain.current && delayNode.current) {
        masterGain.connect(dryGain.current);
        masterGain.connect(delayNode.current);
      }

      analyser.connect(audioContext.destination);
      voices.current[note] = { masterGain, oscillators: noteVoices };
    },
    [adsr, getAnalyser, getAudioContext, masterTune, masterVolume, oscillators, velocitySensitive],
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

      const release = Math.max(adsr.release, 0.01);

      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + release);

      voice.oscillators.forEach(({ oscillator }) => {
        if (oscillator) {
          oscillator.stop(now + release);
          oscillator.addEventListener('ended', () => oscillator.disconnect());
        }
      });

      delete voices.current[note];
    },
    [adsr.release, getAudioContext],
  );

  const updateVoices = useCallback(
    (updatedOscillators: Array<OscillatorData>) => {
      const audioContext = getAudioContext();
      const now = audioContext.currentTime;

      Object.values(voices.current).forEach((voice) => {
        voice.oscillators.forEach((voiceOsc) => {
          const oscillatorData = updatedOscillators.find((o) => o.id === voiceOsc.id);
          if (!oscillatorData) {
            return;
          }

          if (!voiceOsc.oscillator || !voiceOsc.gain) {
            return;
          }

          if (oscillatorData.isMute) {
            voiceOsc.gain.gain.setValueAtTime(voiceOsc.gain.gain.value, now);
            voiceOsc.gain.gain.linearRampToValueAtTime(0, now + 0.005);
            return;
          }

          const targetGain = calculateVelocity({
            velocity: velocitySensitive ? voiceOsc.velocity : 127,
            numOscillators: updatedOscillators.length,
            oscVolume: oscillatorData.volume,
            masterVolume,
          });

          voiceOsc.oscillator.type = oscillatorData.waveform;
          voiceOsc.oscillator.detune.value =
            oscillatorData.detune + oscillatorData.transpose * 100 + masterTune;

          voiceOsc.gain.gain.setValueAtTime(voiceOsc.gain.gain.value, now);
          voiceOsc.gain.gain.linearRampToValueAtTime(targetGain, now + 0.005);
        });
      });
    },
    [getAudioContext, masterTune, masterVolume, velocitySensitive],
  );

  return { noteOn, noteOff, updateVoices };
}
