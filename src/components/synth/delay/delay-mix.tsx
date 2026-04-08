import { SliderParam } from '../../atoms/slider-param.tsx';
import { MIX_MAX, MIX_MIN, MIX_STEP } from '../../../consts/parameter-values.ts';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

interface DelayMixProps {
  onChange: (value: number) => void;
}

export function DelayMix({ onChange }: DelayMixProps) {
  const mix = useSynthStore((s) => s.parameters.delay.mix);
  
  return (
    <SliderParam
      id="delay-mix"
      labelLeft="Dry"
      labelRight="Wet"
      value={mix}
      min={MIX_MIN}
      max={MIX_MAX}
      step={MIX_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
