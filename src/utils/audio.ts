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
