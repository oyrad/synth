import { SliderParam } from '../../atoms/slider-param.tsx';
import { ADSR_STEP, DECAY_MAX, DECAY_MIN } from '../../../consts/parameter-values.ts';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

interface FilterDecayProps {
  onChange: (value: number) => void;
}

export function FilterDecay({ onChange }: FilterDecayProps) {
  const decay = useSynthStore((s) => s.parameters.filter.decay);

  return (
    <SliderParam
      id="filter-decay"
      labelLeft="Decay"
      labelRight={`${decay}s`}
      value={decay}
      min={DECAY_MIN}
      max={DECAY_MAX}
      step={ADSR_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
