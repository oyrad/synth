import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import {
  DELAY_TIME_MAX,
  DELAY_TIME_MIN,
  DELAY_TIME_STEP,
} from '../../../consts/parameter-values.ts';

interface DelayTimeProps {
  onChange: (value: number) => void;
}

export function DelayTime({ onChange }: DelayTimeProps) {
  const time = useSynthStore((s) => s.parameters.delay.time);

  return (
    <SliderParam
      id="delay-time"
      labelLeft="Time"
      labelRight={`${time}s`}
      value={time}
      min={DELAY_TIME_MIN}
      max={DELAY_TIME_MAX}
      step={DELAY_TIME_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
