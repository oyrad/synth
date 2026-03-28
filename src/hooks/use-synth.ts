import { useCallback, useEffect, useRef } from 'react';
import { calculateVelocity, midiNoteToFrequency } from '../utils/audio.ts';
import { useAudioCtx } from './use-audio-context.ts';
import type { OscillatorData } from '../components/oscillators/oscillators.tsx';
import type { AdsrEnvelope } from '../components/adsr/adsr.tsx';
import { useSettingsStore } from '../stores/use-settings-store.ts';
import type { DelayData } from '../components/effects/delay.tsx';
import type { FilterData } from '../components/filter/filter.tsx';

interface Voice {
  masterGain: GainNode;
  oscillators: Array<{
    id: string;
    oscillator: OscillatorNode | null;
    gain: GainNode | null;
    velocity: number;
  }>;
  filterNode: BiquadFilterNode;
}

interface UseSynthParams {
  oscillators: Array<OscillatorData>;
  adsr: AdsrEnvelope;
  delay: DelayData;
  filter: FilterData;
}

export function useSynth({ oscillators, adsr, delay, filter }: UseSynthParams) {
  const voices = useRef<Record<number, Voice>>({});

  const { getAudioContext, getDelay } = useAudioCtx();

  const velocitySensitive = useSettingsStore((s) => s.velocitySensitive);

  const masterVolume = useSettingsStore((s) => s.masterVolume);
  const masterTune = useSettingsStore((s) => s.masterTune);

  useEffect(() => {
    const { delayNode, feedbackGain, dryGain, wetGain } = getDelay();

    const now = getAudioContext().currentTime;
    const ramp = 0.05;

    delayNode.delayTime.linearRampToValueAtTime(delay.time, now + ramp);
    feedbackGain.gain.linearRampToValueAtTime(delay.feedback, now + ramp);

    dryGain.gain.linearRampToValueAtTime(1 - delay.mix, now + ramp);
    wetGain.gain.linearRampToValueAtTime(delay.mix, now + ramp);
  }, [delay, getAudioContext, getDelay]);

  useEffect(() => {
    const audioContext = getAudioContext();
    const now = audioContext.currentTime;
    const ramp = 0.05;

    Object.values(voices.current).forEach((voice) => {
      voice.filterNode.type = filter.type;
      voice.filterNode.frequency.exponentialRampToValueAtTime(
        Math.max(20, filter.frequency),
        now + ramp,
      );
      voice.filterNode.Q.linearRampToValueAtTime(filter.resonance, now + ramp);
    });
  }, [filter, getAudioContext]);

  const noteOn = useCallback(
    (note: number, velocity: number) => {
      const audioContext = getAudioContext();
      const { delayNode, dryGain } = getDelay();

      if (voices.current[note]) {
        return;
      }

      const { attack, decay, sustain } = adsr;

      const masterGain = audioContext.createGain();
      const now = audioContext.currentTime;

      const filterNode = audioContext.createBiquadFilter();
      filterNode.type = filter.type;
      filterNode.frequency.value = filter.frequency;
      filterNode.Q.value = filter.resonance;

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
        gainNode.connect(filterNode);
        osc.start();

        return { id: oscillatorData.id, oscillator: osc, gain: gainNode, velocity };
      });

      if (dryGain && delayNode) {
        masterGain.connect(dryGain);
        masterGain.connect(delayNode);
      }

      filterNode.connect(masterGain);

      voices.current[note] = { masterGain, oscillators: noteVoices, filterNode };
    },
    [
      adsr,
      filter,
      getAudioContext,
      getDelay,
      masterTune,
      masterVolume,
      oscillators,
      velocitySensitive,
    ],
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
          oscillator.addEventListener('ended', () => {
            oscillator.disconnect();
            voice.filterNode.disconnect();
          });
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
