import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import { VOLUME_MAX, VOLUME_MIN, VOLUME_STEP } from '../../../consts/parameter-values.ts';

interface DistortionAmountProps {
  onChange: (value: number) => void;
}

export function DistortionAmount({ onChange }: DistortionAmountProps) {
  const amount = useSynthStore((s) => s.parameters.distortion.amount);

  return (
    <SliderParam
      id="distortion-amount"
      labelLeft="Amount"
      labelRight={`${amount}`}
      value={amount}
      min={VOLUME_MIN}
      max={VOLUME_MAX}
      step={VOLUME_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
