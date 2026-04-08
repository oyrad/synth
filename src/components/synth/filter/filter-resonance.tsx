import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import {
  FILTER_RESONANCE_MAX,
  FILTER_RESONANCE_MIN,
  FILTER_RESONANCE_STEP,
} from '../../../consts/parameter-values.ts';

interface FilterResonanceProps {
  onChange: (frequency: number) => void;
}

export function FilterResonance({ onChange }: FilterResonanceProps) {
  const resonance = useSynthStore((s) => s.parameters.filter.resonance);

  return (
    <SliderParam
      id="filter-resonance"
      labelLeft="Resonance"
      labelRight={`${resonance}`}
      value={resonance}
      min={FILTER_RESONANCE_MIN}
      max={FILTER_RESONANCE_MAX}
      step={FILTER_RESONANCE_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
