import { hzToLog, logToHz } from '../../../utils/audio.ts';
import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import {
  FILTER_FREQUENCY_MAX,
  FILTER_FREQUENCY_MIN,
  FILTER_FREQUENCY_STEP,
} from '../../../consts/parameter-values.ts';

const MIN_FREQ_HZ = 20;
const MAX_FREQ_HZ = 20000;

interface FilterFrequencyProps {
  onChange: (frequency: number) => void;
}

export function FilterFrequency({ onChange }: FilterFrequencyProps) {
  const frequency = useSynthStore((s) => s.parameters.filter.frequency);

  return (
    <SliderParam
      id="filter-frequency"
      labelLeft="Frequency"
      labelRight={`${frequency} Hz`}
      value={hzToLog(frequency, MIN_FREQ_HZ, MAX_FREQ_HZ)}
      min={FILTER_FREQUENCY_MIN}
      max={FILTER_FREQUENCY_MAX}
      step={FILTER_FREQUENCY_STEP}
      onChange={(value) => onChange(logToHz(value[0], MIN_FREQ_HZ, MAX_FREQ_HZ))}
    />
  );
}
