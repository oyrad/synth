import { WaveformSelect } from '../waveform-select.tsx';
import { isOscillatorType } from '../../../utils/midi.ts';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

interface LFOWaveformProps {
  onChange: (waveform: OscillatorType) => void;
}

export function LFOWaveform({ onChange }: LFOWaveformProps) {
  const waveform = useSynthStore((s) => s.parameters.lfo.waveform);

  return (
    <WaveformSelect
      value={waveform}
      onChange={(value) => {
        if (isOscillatorType(value)) {
          onChange(value);
        }
      }}
    />
  );
}
