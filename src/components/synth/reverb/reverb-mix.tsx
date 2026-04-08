import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import { MIX_MAX, MIX_MIN, MIX_STEP } from '../../../consts/parameter-values.ts';

interface ReverbMixProps {
  onChange: (value: number) => void;
}

export function ReverbMix({ onChange }: ReverbMixProps) {
  const mix = useSynthStore((s) => s.parameters.reverb.mix);

  return (
    <SliderParam
      id="reverb-mix"
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
