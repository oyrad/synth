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
    (0.15 / Math.sqrt(numOscillators)) *
    (oscVolume / 100) *
    (masterVolume / 100)
  );
}

export const hzToLog = (hz: number, min: number, max: number) =>
  Math.log(hz / min) / Math.log(max / min);
export const logToHz = (pos: number, min: number, max: number) =>
  Math.round(min * Math.pow(max / min, pos));

export function createWhiteNoiseBuffer(ctx: AudioContext) {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  return buffer;
}

export function createDistortionCurve(amount: number) {
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);

  const k = 50;

  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;

    const wet = ((3 + k) * x) / (3 + k * Math.abs(x));
    const t = amount / 100;
    curve[i] = (1 - t) * x + t * wet;
  }
  return curve;
}

export function createReverbBuffer(
  audioContext: BaseAudioContext,
  duration: number,
  decay: number,
) {
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * duration;
  const buffer = audioContext.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      const noise = Math.random() * 2 - 1;
      channelData[i] = noise * Math.pow(1 - i / length, decay);
    }
  }
  return buffer;
}
