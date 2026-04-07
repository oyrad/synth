import { useSynthStore } from '../stores/use-synth-store.ts';
import {
  DETUNE_MAX,
  DETUNE_MIN,
  TRANSPOSE_MAX,
  TRANSPOSE_MIN,
  VOLUME_MAX,
  VOLUME_MIN,
} from '../consts/parameter-values.tsx';
import { useMemo } from 'react';

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
  const oscillators = useSynthStore((s) => s.parameters.oscillators);

  return useMemo(
    () => ({
      ...Object.fromEntries(
        oscillators.flatMap(({ id }) => [
          [
            `oscillator-${id}-volume`,
            { min: VOLUME_MIN, max: VOLUME_MAX, set: (v) => updateOscillator(id, { volume: v }) },
          ],
          [
            `oscillator-${id}-detune`,
            { min: DETUNE_MIN, max: DETUNE_MAX, set: (v) => updateOscillator(id, { detune: v }) },
          ],
          [
            `oscillator-${id}-transpose`,
            {
              min: TRANSPOSE_MIN,
              max: TRANSPOSE_MAX,
              set: (v) => updateOscillator(id, { transpose: v }),
            },
          ],
        ]),
      ),

      'amplitude-attack': { min: 0, max: 2, set: (v) => updateAmplitude({ attack: v }) },
      'amplitude-decay': { min: 0, max: 1, set: (v) => updateAmplitude({ decay: v }) },
      'amplitude-sustain': { min: 0, max: 1, set: (v) => updateAmplitude({ sustain: v }) },
      'amplitude-release': { min: 0, max: 4, set: (v) => updateAmplitude({ release: v }) },

      'filter-frequency': {
        min: 20,
        max: 20000,
        logarithmic: true,
        set: (v) => updateFilter({ frequency: v }),
      },
      'filter-resonance': { min: 0, max: 30, set: (v) => updateFilter({ resonance: v }) },
      'filter-depth': { min: 0, max: 10000, set: (v) => updateFilter({ depth: v }) },
      'filter-attack': { min: 0, max: 2, set: (v) => updateFilter({ attack: v }) },
      'filter-decay': { min: 0, max: 1, set: (v) => updateFilter({ decay: v }) },
      'filter-sustain': { min: 0, max: 1, set: (v) => updateFilter({ sustain: v }) },
      'filter-release': { min: 0, max: 4, set: (v) => updateFilter({ release: v }) },

      'delay-mix': { min: 0, max: 1, set: (v) => updateDelay({ mix: v }) },
      'delay-time': { min: 0, max: 2, set: (v) => updateDelay({ time: v }) },
      'delay-feedback': { min: 0, max: 0.95, set: (v) => updateDelay({ feedback: v }) },

      'reverb-mix': { min: 0, max: 1, set: (v) => updateReverb({ mix: v }) },
      'reverb-time': { min: 0, max: 5, set: (v) => updateReverb({ time: v }) },

      'distortion-amount': { min: 0, max: 1, set: (v) => updateDistortion({ amount: v }) },

      'noise-volume': { min: 0, max: 100, set: (v) => updateNoise({ volume: v }) },

      'lfo-frequency': { min: 0, max: 20, set: (v) => updateLFO({ frequency: v }) },
      'lfo-depth': { min: 0, max: 1200, set: (v) => updateLFO({ depth: v }) },
    }),
    [
      oscillators,
      updateAmplitude,
      updateDelay,
      updateDistortion,
      updateFilter,
      updateLFO,
      updateNoise,
      updateOscillator,
      updateReverb,
    ],
  );
}
