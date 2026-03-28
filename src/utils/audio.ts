export function midiNoteToFrequency(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export function calculateVelocity({
  velocity,
  numOscillators,
  oscVolume,
  masterVolume,
}: {
  velocity: number;
  numOscillators: number;
  oscVolume: number;
  masterVolume: number;
}) {
  return (
    (velocity / 127) * (0.25 / Math.sqrt(numOscillators)) * (oscVolume / 100) * (masterVolume / 100)
  );
}

export const MIN_FREQ = 20;
export const MAX_FREQ = 20000;

export const hzToLog = (hz: number) => Math.log(hz / MIN_FREQ) / Math.log(MAX_FREQ / MIN_FREQ);
export const logToHz = (pos: number) => Math.round(MIN_FREQ * Math.pow(MAX_FREQ / MIN_FREQ, pos));
