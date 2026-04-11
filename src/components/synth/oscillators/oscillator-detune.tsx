import { DETUNE_MAX, DETUNE_MIN, DETUNE_STEP } from '../../../consts/parameter-values.ts';
import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

interface OscillatorDetuneProps {
  oscIndex: number;
  onChange: (value: number) => void;
}

export function OscillatorDetune({ oscIndex, onChange }: OscillatorDetuneProps) {
  const id = useSynthStore((s) => s.parameters.oscillators[oscIndex].id);
  const detune = useSynthStore((s) => s.parameters.oscillators[oscIndex].detune);

  return (
    <SliderParam
      id={`oscillator-${id}-detune`}
      labelLeft="Detune"
      labelRight={`${detune} cents`}
      value={detune}
      min={DETUNE_MIN}
      max={DETUNE_MAX}
      step={DETUNE_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
