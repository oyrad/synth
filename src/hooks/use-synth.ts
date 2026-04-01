import { useCallback, useEffect, useRef } from 'react';
import {
  calculateVelocity,
  createDistortionCurve,
  MAX_VELOCITY,
  midiNoteToFrequency,
} from '../utils/audio.ts';
import { useAudioCtx } from './use-audio-context.ts';
import { useSettingsStore } from '../stores/use-settings-store.ts';
import { useSynthStore } from '../stores/use-synth-store.ts';
import {
  updateDelay,
  updateDistortion,
  updateFilter,
  updateLFO,
  updateReverb,
} from '../utils/synth/updaters.ts';

export interface Voice {
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

  const { getAudioContext, getDelay, getNoiseBuffer, getDistortion, getReverb, getLFO } =
    useAudioCtx();

  const { oscillators, filter, amplitude, delay, noise, distortion, reverb, lfo } = useSynthStore(
    (s) => s.parameters,
  );

  const velocitySensitive = useSettingsStore((s) => s.velocitySensitive);

  const masterVolume = useSettingsStore((s) => s.masterVolume);
  const masterTune = useSettingsStore((s) => s.masterTune);

  const noteOn = useCallback(
    (note: number, velocity: number) => {
      const audioContext = getAudioContext();
      const { delayNode, dryGain } = getDelay();
      const distortionNode = getDistortion();
      const { gain: lfoGainNode } = getLFO();

      if (voices.current[note]) {
        return;
      }

      const { attack, decay, sustain } = amplitude;

      const masterGain = audioContext.createGain();
      const now = audioContext.currentTime;

      const filterNode = audioContext.createBiquadFilter();
      filterNode.type = filter.isActive ? filter.type : 'lowpass';
      filterNode.Q.value = filter.isActive ? filter.resonance : 0;

      let baseFreq = Math.max(20, filter.frequency);
      if (lfo.isActive && lfo.target === 'filter') {
        baseFreq = Math.max(baseFreq, lfo.depth + 20);
      }

      const depth = filter.depth;
      const peakFreq = Math.min(19000, baseFreq + depth);
      const sustainFreq = Math.min(19000, baseFreq + depth * filter.sustain);

      filterNode.frequency.cancelScheduledValues(now);
      filterNode.frequency.setValueAtTime(baseFreq, now);

      if (filter.isActive && depth > 1) {
        const attackTime = Math.max(0.002, filter.attack);
        filterNode.frequency.exponentialRampToValueAtTime(peakFreq, now + attackTime);

        const decayTime = Math.max(0.002, filter.decay);
        filterNode.frequency.exponentialRampToValueAtTime(
          Math.max(20, sustainFreq),
          now + attackTime + decayTime,
        );
      } else {
        filterNode.frequency.setValueAtTime(filter.isActive ? baseFreq : 20000, now);
      }

      const noiseSource = audioContext.createBufferSource();
      const noiseGainNode = audioContext.createGain();
      noiseSource.buffer = getNoiseBuffer();
      noiseSource.loop = true;

      noiseGainNode.gain.value = noise.isActive
        ? calculateVelocity({
            velocity: velocitySensitive ? velocity : MAX_VELOCITY,
            numOscillators: oscillators.filter((osc) => osc.isActive).length + 1,
            oscVolume: noise.volume,
            masterVolume,
          })
        : 0;
      noiseSource.connect(noiseGainNode);
      noiseSource.start();

      if (distortion.isActive) {
        distortionNode.curve = createDistortionCurve(distortion.amount);
      }

      masterGain.gain.setValueAtTime(0, now);

      if (attack > 0) {
        masterGain.gain.linearRampToValueAtTime(1, now + attack);
      } else {
        masterGain.gain.setValueAtTime(1, now);
      }

      masterGain.gain.linearRampToValueAtTime(sustain, now + attack + decay);

      const noteVoices = oscillators.map((oscillatorData) => {
        if (!oscillatorData.isActive) {
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
          numOscillators: oscillators.filter((osc) => osc.isActive).length,
          oscVolume: oscillatorData.volume,
          masterVolume,
        });

        osc.connect(gainNode);
        gainNode.connect(filterNode);
        osc.start();

        return { id: oscillatorData.id, oscillator: osc, gain: gainNode, velocity };
      });

      if (lfo.isActive) {
        if (lfo.target === 'filter') {
          lfoGainNode.connect(filterNode.frequency);
        } else if (lfo.target === 'volume') {
          const volumeLfoGain = audioContext.createGain();
          volumeLfoGain.gain.value = 0.001;
          lfoGainNode.connect(volumeLfoGain);
          volumeLfoGain.connect(masterGain.gain);
        } else if (lfo.target === 'pitch') {
          noteVoices.forEach((voice) => {
            if (voice.oscillator) {
              lfoGainNode.connect(voice.oscillator.detune);
            }
          });
        }
      }

      noiseGainNode.connect(filterNode);
      filterNode.connect(masterGain);

      if (dryGain && delayNode) {
        masterGain.connect(dryGain);
        masterGain.connect(delayNode);
      }

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
      getAudioContext,
      getDelay,
      getDistortion,
      getLFO,
      amplitude,
      filter,
      getNoiseBuffer,
      noise,
      velocitySensitive,
      oscillators,
      masterVolume,
      distortion,
      lfo.target,
      lfo.isActive,
      lfo.depth,
      masterTune,
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

      const release = Math.max(amplitude.release, 0.01);
      const filterRelease = Math.max(filter.release, 0.01);

      voice.noiseGain.gain.setValueAtTime(voice.noiseGain.gain.value, now);
      voice.noiseGain.gain.linearRampToValueAtTime(0, now + release);
      voice.noiseSource.stop(now + release);
      voice.noiseSource.addEventListener('ended', () => voice.noiseSource.disconnect());

      voice.filterNode.frequency.setValueAtTime(voice.filterNode.frequency.value, now);
      voice.filterNode.frequency.exponentialRampToValueAtTime(
        Math.max(20, filter.frequency),
        now + filterRelease,
      );

      masterGain.gain.setValueAtTime(masterGain.gain.value, now);

      if (release > 0) {
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + release);
      } else {
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      }

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
    [amplitude.release, filter.frequency, filter.release, getAudioContext],
  );

  useEffect(() => {
    const { oscillator: lfoOscillatorNode, gain: lfoGainNode } = getLFO();
    const now = getAudioContext().currentTime;

    lfoOscillatorNode.type = lfo.waveform;
    lfoOscillatorNode.frequency.setTargetAtTime(lfo.frequency, now, 0.05);
    lfoGainNode.gain.setTargetAtTime(lfo.depth, now, 0.05);

    if (!lfo.isActive) {
      lfoGainNode.gain.setTargetAtTime(0, now, 0.05);
    }
  }, [lfo, getAudioContext, getLFO]);

  useEffect(() => {
    updateLFO({ getAudioContext, getLFO, lfo, voices: voices.current });
  }, [getLFO, getAudioContext, lfo]);

  useEffect(() => {
    updateDelay({ delay, getAudioContext, getDelay });
  }, [delay, getAudioContext, getDelay]);

  useEffect(() => {
    updateFilter({ filter, getAudioContext, voices: voices.current, lfo });
  }, [filter, getAudioContext, lfo]);

  useEffect(() => {
    updateDistortion({ distortion, getDistortion });
  }, [distortion, getDistortion]);

  useEffect(() => {
    updateReverb({ reverb, getAudioContext, getReverb });
  }, [reverb, getAudioContext, getReverb]);

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

        if (!oscillatorData.isActive) {
          voiceOsc.gain.gain.setValueAtTime(voiceOsc.gain.gain.value, now);
          voiceOsc.gain.gain.linearRampToValueAtTime(0, now + 0.005);
          return;
        }

        const targetGain = calculateVelocity({
          velocity: velocitySensitive ? voiceOsc.velocity : MAX_VELOCITY,
          numOscillators: oscillators.filter((osc) => osc.isActive).length,
          oscVolume: oscillatorData.volume,
          masterVolume,
        });

        voiceOsc.oscillator.type = oscillatorData.waveform;
        voiceOsc.oscillator.detune.value =
          oscillatorData.detune + oscillatorData.transpose * 100 + masterTune;

        voiceOsc.gain.gain.setValueAtTime(voiceOsc.gain.gain.value, now);
        voiceOsc.gain.gain.linearRampToValueAtTime(targetGain, now + 0.005);
      });

      if (noise.isActive) {
        const targetNoiseGain = calculateVelocity({
          velocity: velocitySensitive ? voice.velocity : MAX_VELOCITY,
          numOscillators: oscillators.filter((osc) => osc.isActive).length + 1,
          oscVolume: noise.volume,
          masterVolume,
        });
        voice.noiseGain.gain.setValueAtTime(voice.noiseGain.gain.value, now);
        voice.noiseGain.gain.linearRampToValueAtTime(targetNoiseGain, now + 0.005);
      } else {
        voice.noiseGain.gain.linearRampToValueAtTime(0.0001, now + 0.005);
      }
    });
  }, [getAudioContext, masterTune, masterVolume, noise, oscillators, velocitySensitive]);

  return { noteOn, noteOff };
}
