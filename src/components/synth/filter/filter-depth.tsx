import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import { hzToLog, logToHz } from '../../../utils/audio.ts';
import {
  FILTER_DEPTH_MAX,
  FILTER_DEPTH_MIN,
  FILTER_DEPTH_STEP,
} from '../../../consts/parameter-values.ts';

const MIN_FREQ_HZ = 1;
const MAX_FREQ_HZ = 10000;

interface FilterDepthProps {
  onChange: (value: number) => void;
}

export function FilterDepth({ onChange }: FilterDepthProps) {
  const depth = useSynthStore((s) => s.parameters.filter.depth);

  return (
    <SliderParam
      id="filter-depth"
      labelLeft="Depth"
      labelRight={`${depth} Hz`}
      value={hzToLog(depth, MIN_FREQ_HZ, MAX_FREQ_HZ)}
      min={FILTER_DEPTH_MIN}
      max={FILTER_DEPTH_MAX}
      step={FILTER_DEPTH_STEP}
      onChange={(value) => onChange(logToHz(value[0], MIN_FREQ_HZ, MAX_FREQ_HZ))}
    />
  );
}
