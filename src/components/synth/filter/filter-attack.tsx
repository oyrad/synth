import { ADSR_STEP, ATTACK_MAX, ATTACK_MIN } from '../../../consts/parameter-values.ts';
import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

interface FilterAttackProps {
  onChange: (value: number) => void;
}

export function FilterAttack({ onChange }: FilterAttackProps) {
  const attack = useSynthStore((s) => s.parameters.filter.attack);

  return (
    <SliderParam
      id="filter-attack"
      labelLeft="Attack"
      labelRight={`${attack}s`}
      value={attack}
      min={ATTACK_MIN}
      max={ATTACK_MAX}
      step={ADSR_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
