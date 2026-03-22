import type { OscillatorData } from '../components/oscillators/oscillators.tsx';

export const DEFAULT_OSCILLATOR: Omit<OscillatorData, 'id'> = {
  waveform: 'sine',
  isMute: false,
  volume: 50,
  detune: 0,
  transpose: 0,
};
