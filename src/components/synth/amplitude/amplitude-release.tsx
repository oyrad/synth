import { SliderParam } from '../../atoms/slider-param.tsx';
import { ADSR_STEP, RELEASE_MAX, RELEASE_MIN } from '../../../consts/parameter-values.ts';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

interface AmplitudeReleaseProps {
  onChange: (value: number) => void;
}

export function AmplitudeRelease({ onChange }: AmplitudeReleaseProps) {
  const release = useSynthStore((s) => s.parameters.amplitude.release);

  return (
    <SliderParam
      id="amplitude-release"
      labelLeft="Release"
      labelRight={`${release}s`}
      value={release}
      min={RELEASE_MIN}
      max={RELEASE_MAX}
      step={ADSR_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
