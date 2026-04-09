import { useSynthStore } from '../stores/use-synth-store.ts';
import {
  ATTACK_MAX,
  ATTACK_MIN,
  DECAY_MAX,
  DECAY_MIN,
  DELAY_FEEDBACK_MAX,
  DELAY_FEEDBACK_MIN,
  DELAY_TIME_MAX,
  DELAY_TIME_MIN,
  DETUNE_MAX,
  DETUNE_MIN,
  FILTER_RESONANCE_MAX,
  FILTER_RESONANCE_MIN,
  LFO_DEPTH_MAX,
  LFO_DEPTH_MIN,
  LFO_FREQUENCY_MAX,
  LFO_FREQUENCY_MIN,
  MIX_MAX,
  MIX_MIN,
  RELEASE_MAX,
  RELEASE_MIN,
  REVERB_TIME_MAX,
  REVERB_TIME_MIN,
  SUSTAIN_MAX,
  SUSTAIN_MIN,
  TRANSPOSE_MAX,
  TRANSPOSE_MIN,
  VOLUME_MAX,
  VOLUME_MIN,
} from '../consts/parameter-values.ts';
import { useMemo } from 'react';
import { useSettingsStore } from '../stores/use-settings-store.ts';

interface ParameterDescriptor {
  min: number;
  max: number;
  logarithmic?: boolean;
  set: (value: number) => void;
}

export function useParameterRegistry(): Record<string, ParameterDescriptor> {
  const updateOscillator = useSynthStore((s) => s.updateOscillator);
  const updateAmplitude = useSynthStore((s) => s.updateAmplitude);
  const updateFilter = useSynthStore((s) => s.updateFilter);
  const updateDelay = useSynthStore((s) => s.updateDelay);
  const updateReverb = useSynthStore((s) => s.updateReverb);
  const updateDistortion = useSynthStore((s) => s.updateDistortion);
  const updateNoise = useSynthStore((s) => s.updateNoise);
  const updateLFO = useSynthStore((s) => s.updateLFO);

  const setMasterVolume = useSettingsStore((s) => s.setMasterVolume);
  const setMasterTune = useSettingsStore((s) => s.setMasterTune);

  return useMemo(() => {
    const registry: Record<string, ParameterDescriptor> = {
      'amplitude-attack': {
        min: ATTACK_MIN,
        max: ATTACK_MAX,
        set: (v) => updateAmplitude({ attack: v }),
      },
      'amplitude-decay': {
        min: DECAY_MIN,
        max: DECAY_MAX,
        set: (v) => updateAmplitude({ decay: v }),
      },
      'amplitude-sustain': {
        min: SUSTAIN_MIN,
        max: SUSTAIN_MAX,
        set: (v) => updateAmplitude({ sustain: v }),
      },
      'amplitude-release': {
        min: RELEASE_MIN,
        max: RELEASE_MAX,
        set: (v) => updateAmplitude({ release: v }),
      },

      'filter-frequency': {
        min: 20,
        max: 20000,
        logarithmic: true,
        set: (v) => updateFilter({ frequency: v }),
      },
      'filter-resonance': {
        min: FILTER_RESONANCE_MIN,
        max: FILTER_RESONANCE_MAX,
        set: (v) => updateFilter({ resonance: v }),
      },
      'filter-depth': {
        min: 1,
        max: 10000,
        logarithmic: true,
        set: (v) => updateFilter({ depth: v }),
      },
      'filter-attack': {
        min: ATTACK_MIN,
        max: ATTACK_MAX,
        set: (v) => updateFilter({ attack: v }),
      },
      'filter-decay': { min: DECAY_MIN, max: DECAY_MAX, set: (v) => updateFilter({ decay: v }) },
      'filter-sustain': {
        min: SUSTAIN_MIN,
        max: SUSTAIN_MAX,
        set: (v) => updateFilter({ sustain: v }),
      },
      'filter-release': {
        min: RELEASE_MIN,
        max: RELEASE_MAX,
        set: (v) => updateFilter({ release: v }),
      },

      'delay-mix': { min: MIX_MIN, max: MIX_MAX, set: (v) => updateDelay({ mix: v }) },
      'delay-time': {
        min: DELAY_TIME_MIN,
        max: DELAY_TIME_MAX,
        set: (v) => updateDelay({ time: v }),
      },
      'delay-feedback': {
        min: DELAY_FEEDBACK_MIN,
        max: DELAY_FEEDBACK_MAX,
        set: (v) => updateDelay({ feedback: v }),
      },

      'reverb-mix': { min: MIX_MIN, max: MIX_MAX, set: (v) => updateReverb({ mix: v }) },
      'reverb-time': {
        min: REVERB_TIME_MIN,
        max: REVERB_TIME_MAX,
        set: (v) => updateReverb({ time: v }),
      },

      'distortion-amount': {
        min: VOLUME_MIN,
        max: VOLUME_MAX,
        set: (v) => updateDistortion({ amount: v }),
      },

      'noise-volume': { min: VOLUME_MIN, max: VOLUME_MAX, set: (v) => updateNoise({ volume: v }) },

      'lfo-frequency': {
        min: LFO_FREQUENCY_MIN,
        max: LFO_FREQUENCY_MAX,
        set: (v) => updateLFO({ frequency: v }),
      },
      'lfo-depth': { min: LFO_DEPTH_MIN, max: LFO_DEPTH_MAX, set: (v) => updateLFO({ depth: v }) },

      'master-volume': { min: VOLUME_MIN, max: VOLUME_MAX, set: (v) => setMasterVolume(v) },
      'master-tune': { min: DETUNE_MIN, max: DETUNE_MAX, set: (v) => setMasterTune(v) },
    };

    ['osc-1', 'osc-2', 'osc-3', 'osc-4'].forEach((id) => {
      registry[`oscillator-${id}-volume`] = {
        min: VOLUME_MIN,
        max: VOLUME_MAX,
        set: (v) => updateOscillator(id, { volume: v }),
      };
      registry[`oscillator-${id}-detune`] = {
        min: DETUNE_MIN,
        max: DETUNE_MAX,
        set: (v) => updateOscillator(id, { detune: v }),
      };
      registry[`oscillator-${id}-transpose`] = {
        min: TRANSPOSE_MIN,
        max: TRANSPOSE_MAX,
        set: (v) => updateOscillator(id, { transpose: v }),
      };
    });

    return registry;
  }, [
    setMasterTune,
    setMasterVolume,
    updateAmplitude,
    updateDelay,
    updateDistortion,
    updateFilter,
    updateLFO,
    updateNoise,
    updateOscillator,
    updateReverb,
  ]);
}
