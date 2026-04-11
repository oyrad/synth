import { WaveformSelect } from '../waveform-select.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import { isOscillatorType } from '../../../utils/midi.ts';

interface OscillatorWaveformProps {
  oscIndex: number;
  onChange: (waveform: OscillatorType) => void;
}

export function OscillatorWaveform({ oscIndex, onChange }: OscillatorWaveformProps) {
  const waveform = useSynthStore((s) => s.parameters.oscillators[oscIndex].waveform);

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
