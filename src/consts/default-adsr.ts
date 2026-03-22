import type { AdsrEnvelope } from '../components/adsr.tsx';

export const DEFAULT_ADSR: AdsrEnvelope = {
  attack: 0.1,
  decay: 0.1,
  sustain: 0.8,
  release: 0.3,
};
