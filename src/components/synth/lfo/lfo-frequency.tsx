import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import {
  LFO_FREQUENCY_MAX,
  LFO_FREQUENCY_MIN,
  LFO_FREQUENCY_STEP,
} from '../../../consts/parameter-values.ts';

interface LFOFrequencyProps {
  onChange: (frequency: number) => void;
}

export function LFOFrequency({ onChange }: LFOFrequencyProps) {
  const frequency = useSynthStore((s) => s.parameters.lfo.frequency);

  return (
    <SliderParam
      id="lfo-frequency"
      labelLeft="Frequency"
      labelRight={`${frequency} Hz`}
      value={frequency}
      min={LFO_FREQUENCY_MIN}
      max={LFO_FREQUENCY_MAX}
      step={LFO_FREQUENCY_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
