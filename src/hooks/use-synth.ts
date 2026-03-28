import { useCallback, useEffect, useRef } from 'react';
import { calculateVelocity, MAX_VELOCITY, midiNoteToFrequency } from '../utils/audio.ts';
import { useAudioCtx } from './use-audio-context.ts';
import { useSettingsStore } from '../stores/use-settings-store.ts';
import { useSynthStore } from '../stores/use-synth-store.ts';

interface Voice {
  masterGain: GainNode;
  velocity: number;
  oscillators: Array<{
    id: string;
    oscillator: OscillatorNode | null;
    gain: GainNode | null;
    velocity: number;
  }>;
  filterNode: BiquadFilterNode;
  noiseSource: AudioBufferSourceNode;
  noiseGain: GainNode;
}

export function useSynth() {
  const voices = useRef<Record<number, Voice>>({});

  const { getAudioContext, getDelay, getNoiseBuffer } = useAudioCtx();

  const { oscillators, filter, envelope, delay, noise } = useSynthStore((s) => s.parameters);

  const velocitySensitive = useSettingsStore((s) => s.velocitySensitive);

  const masterVolume = useSettingsStore((s) => s.masterVolume);
  const masterTune = useSettingsStore((s) => s.masterTune);

  const noteOn = useCallback(
    (note: number, velocity: number) => {
      const audioContext = getAudioContext();
      const { delayNode, dryGain } = getDelay();

      if (voices.current[note]) {
        return;
      }

      const { attack, decay, sustain } = envelope;

      const masterGain = audioContext.createGain();
      const now = audioContext.currentTime;

      const filterNode = audioContext.createBiquadFilter();
      filterNode.type = filter.type;
      filterNode.frequency.value = filter.frequency;
      filterNode.Q.value = filter.resonance;

      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = getNoiseBuffer();
      noiseSource.loop = true;

      const noiseGainNode = audioContext.createGain();
      noiseGainNode.gain.value = calculateVelocity({
        velocity: velocitySensitive ? velocity : MAX_VELOCITY,
        numOscillators: oscillators.length + 1,
        oscVolume: noise.volume,
        masterVolume,
      });
      noiseSource.connect(noiseGainNode);
      noiseSource.start();

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
          velocity: velocitySensitive ? velocity : MAX_VELOCITY,
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

      noiseGainNode.connect(filterNode);
      filterNode.connect(masterGain);

      voices.current[note] = {
        masterGain,
        velocity,
        oscillators: noteVoices,
        filterNode,
        noiseSource,
        noiseGain: noiseGainNode,
      };
    },
    [
      envelope,
      filter,
      getAudioContext,
      getDelay,
      getNoiseBuffer,
      masterTune,
      masterVolume,
      noise,
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

      const release = Math.max(envelope.release, 0.01);

      voice.noiseGain.gain.setValueAtTime(voice.noiseGain.gain.value, now);
      voice.noiseGain.gain.linearRampToValueAtTime(0, now + release);
      voice.noiseSource.stop(now + release);
      voice.noiseSource.addEventListener('ended', () => voice.noiseSource.disconnect());

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
    [envelope.release, getAudioContext],
  );

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

  useEffect(() => {
    const audioContext = getAudioContext();
    const now = audioContext.currentTime;

    Object.values(voices.current).forEach((voice) => {
      voice.oscillators.forEach((voiceOsc) => {
        const oscillatorData = oscillators.find((o) => o.id === voiceOsc.id);
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
          velocity: velocitySensitive ? voiceOsc.velocity : MAX_VELOCITY,
          numOscillators: oscillators.length,
          oscVolume: oscillatorData.volume,
          masterVolume,
        });

        voiceOsc.oscillator.type = oscillatorData.waveform;
        voiceOsc.oscillator.detune.value =
          oscillatorData.detune + oscillatorData.transpose * 100 + masterTune;

        voiceOsc.gain.gain.setValueAtTime(voiceOsc.gain.gain.value, now);
        voiceOsc.gain.gain.linearRampToValueAtTime(targetGain, now + 0.005);
      });

      const targetNoiseGain = calculateVelocity({
        velocity: velocitySensitive ? voice.velocity : MAX_VELOCITY,
        numOscillators: oscillators.length + 1,
        oscVolume: noise.volume,
        masterVolume,
      });
      voice.noiseGain.gain.setValueAtTime(voice.noiseGain.gain.value, now);
      voice.noiseGain.gain.linearRampToValueAtTime(targetNoiseGain, now + 0.005);
    });
  }, [getAudioContext, masterTune, masterVolume, noise.volume, oscillators, velocitySensitive]);

  return { noteOn, noteOff };
}
