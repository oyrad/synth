import { SliderParam } from '../../atoms/slider-param.tsx';
import { ADSR_STEP, SUSTAIN_MAX, SUSTAIN_MIN } from '../../../consts/parameter-values.ts';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

interface FilterSustainProps {
  onChange: (value: number) => void;
}

export function FilterSustain({ onChange }: FilterSustainProps) {
  const sustain = useSynthStore((s) => s.parameters.filter.sustain);

  return (
    <SliderParam
      id="filter-sustain"
      labelLeft="Sustain"
      labelRight={`${Math.floor(sustain * 100)}%`}
      value={sustain}
      min={SUSTAIN_MIN}
      max={SUSTAIN_MAX}
      step={ADSR_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
