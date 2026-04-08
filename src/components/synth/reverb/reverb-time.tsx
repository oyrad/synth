import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import {
  REVERB_TIME_MAX,
  REVERB_TIME_MIN,
  REVERB_TIME_STEP,
} from '../../../consts/parameter-values.ts';

interface ReverbTimeProps {
  onChange: (value: number) => void;
}

export function ReverbTime({ onChange }: ReverbTimeProps) {
  const time = useSynthStore((s) => s.parameters.reverb.time);

  return (
    <SliderParam
      id="reverb-time"
      labelLeft="Time"
      labelRight={`${time}s`}
      value={time}
      min={REVERB_TIME_MIN}
      max={REVERB_TIME_MAX}
      step={REVERB_TIME_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
