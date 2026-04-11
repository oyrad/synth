import { VOLUME_MAX, VOLUME_MIN, VOLUME_STEP } from '../../../consts/parameter-values.ts';
import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

interface OscillatorVolumeProps {
  oscIndex: number;
  onChange: (value: number) => void;
}

export function OscillatorVolume({ oscIndex, onChange }: OscillatorVolumeProps) {
  const id = useSynthStore((s) => s.parameters.oscillators[oscIndex].id);
  const volume = useSynthStore((s) => s.parameters.oscillators[oscIndex].volume);

  return (
    <SliderParam
      id={`oscillator-${id}-volume`}
      labelLeft="Volume"
      labelRight={`${volume}`}
      value={volume}
      min={VOLUME_MIN}
      max={VOLUME_MAX}
      step={VOLUME_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
