import { TRANSPOSE_MAX, TRANSPOSE_MIN, TRANSPOSE_STEP } from '../../../consts/parameter-values.ts';
import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

interface OscillatorTransposeProps {
  oscIndex: number;
  onChange: (value: number) => void;
}

export function OscillatorTranspose({ oscIndex, onChange }: OscillatorTransposeProps) {
  const id = useSynthStore((s) => s.parameters.oscillators[oscIndex].id);
  const transpose = useSynthStore((s) => s.parameters.oscillators[oscIndex].transpose);

  return (
    <SliderParam
      id={`oscillator-${id}-transpose`}
      labelLeft="Transpose"
      labelRight={`${transpose} st`}
      value={transpose}
      min={TRANSPOSE_MIN}
      max={TRANSPOSE_MAX}
      step={TRANSPOSE_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
