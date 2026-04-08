import { SliderParam } from '../../atoms/slider-param.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import { LFO_DEPTH_MAX, LFO_DEPTH_MIN, LFO_DEPTH_STEP } from '../../../consts/parameter-values.ts';

const getDepthLabel = (value: number, target: string) => {
  switch (target) {
    case 'pitch':
      return `${(value / 100).toFixed(2)} st`;

    case 'filter':
      return `${value} Hz`;

    case 'volume':
      return `${(value / 10).toFixed(0)}%`;

    default:
      return value.toString();
  }
};

interface LFODepthProps {
  onChange: (depth: number) => void;
}

export function LFODepth({ onChange }: LFODepthProps) {
  const target = useSynthStore((s) => s.parameters.lfo.target);
  const depth = useSynthStore((s) => s.parameters.lfo.depth);

  return (
    <SliderParam
      id="lfo-depth"
      labelLeft="Depth"
      labelRight={getDepthLabel(depth, target)}
      value={depth}
      min={LFO_DEPTH_MIN}
      max={LFO_DEPTH_MAX}
      step={LFO_DEPTH_STEP}
      onChange={(value) => onChange(value[0])}
    />
  );
}
