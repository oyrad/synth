import { useSynthStore } from '../../../stores/use-synth-store.ts';
import { SliderParam } from '../../atoms/slider-param.tsx';
import { ADSR_STEP, RELEASE_MAX, RELEASE_MIN } from '../../../consts/parameter-values.ts';

interface FilterReleaseProps {
  onChange: (value: number) => void;
}

export function FilterRelease({ onChange }: FilterReleaseProps) {
  const release = useSynthStore((s) => s.parameters.filter.release);

  return (
    <SliderParam
      id="filter-release"
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
