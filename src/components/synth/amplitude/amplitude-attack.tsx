import { ADSR_STEP, ATTACK_MAX, ATTACK_MIN } from '../../../consts/parameter-values.ts';
import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

interface AmplitudeAttackProps {
  onChange: (value: number) => void;
}

export function AmplitudeAttack({ onChange }: AmplitudeAttackProps) {
  const attack = useSynthStore((s) => s.parameters.amplitude.attack);

  return (
    <SliderParam
      id="amplitude-attack"
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
