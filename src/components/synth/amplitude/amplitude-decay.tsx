import { SliderParam } from '../../atoms/slider-param.tsx';
import { ADSR_STEP, DECAY_MAX, DECAY_MIN } from '../../../consts/parameter-values.ts';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

interface AmplitudeDecayProps {
  onChange: (value: number) => void;
}

export function AmplitudeDecay({ onChange }: AmplitudeDecayProps) {
  const decay = useSynthStore((s) => s.parameters.amplitude.decay);

  return (
    <SliderParam
      id="amplitude-decay"
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
