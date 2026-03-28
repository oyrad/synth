import type { OscillatorParameters } from '../components/synth/oscillators.tsx';

export const DEFAULT_OSCILLATOR_PARAMETERS: Omit<OscillatorParameters, 'id'> = {
  waveform: 'sine',
  isMute: false,
  volume: 50,
  detune: 0,
  transpose: 0,
};
