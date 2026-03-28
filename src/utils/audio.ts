export function midiNoteToFrequency(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export const MAX_VELOCITY = 127;

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
    (velocity / MAX_VELOCITY) *
    (0.25 / Math.sqrt(numOscillators)) *
    (oscVolume / 100) *
    (masterVolume / 100)
  );
}

export const MIN_FREQ = 20;
export const MAX_FREQ = 20000;

export const hzToLog = (hz: number) => Math.log(hz / MIN_FREQ) / Math.log(MAX_FREQ / MIN_FREQ);
export const logToHz = (pos: number) => Math.round(MIN_FREQ * Math.pow(MAX_FREQ / MIN_FREQ, pos));

export function createWhiteNoiseBuffer(ctx: AudioContext) {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  return buffer;
}
