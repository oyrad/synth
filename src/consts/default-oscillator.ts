import type { OscillatorData } from '../components/oscillators.tsx';

export const DEFAULT_OSCILLATOR: Omit<OscillatorData, 'id'> = {
  waveform: 'sine',
  velocitySensitive: true,
  volume: 50,
  detune: 0,
  transpose: 0,
};
