export interface OscillatorData {
  id: string;
  waveform: OscillatorType;
  velocitySensitive: boolean;
  volume: number;
  detune: number;
}

export const DEFAULT_OSCILLATOR_DATA: Omit<OscillatorData, 'id'> = {
  waveform: 'sine',
  velocitySensitive: true,
  volume: 50,
  detune: 0
};