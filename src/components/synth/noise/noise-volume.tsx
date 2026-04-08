import { SliderParam } from '../../atoms/slider-param.tsx';
import { VOLUME_MAX, VOLUME_MIN, VOLUME_STEP } from '../../../consts/parameter-values.ts';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

interface NoiseVolumeProps {
  onChange: (value: number) => void;
}

export function NoiseVolume({ onChange }: NoiseVolumeProps) {
  const volume = useSynthStore((s) => s.parameters.noise.volume);

  return (
    <SliderParam
      id="noise-volume"
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
