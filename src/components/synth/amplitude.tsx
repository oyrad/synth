import { AdsrVisualizer } from './adsr-visualizer.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn.ts';
import { SliderParam } from '../atoms/slider-param.tsx';
import { Title } from '../atoms/title.tsx';
import { Card } from '../atoms/card.tsx';

export interface AmplitudeParameters {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export function Amplitude({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const amplitude = useSynthStore((s) => s.parameters.amplitude);
  const updateAmplitude = useSynthStore((s) => s.updateAmplitude);

  const { attack, decay, sustain, release } = amplitude;

  return (
    <Card className={cn('', className)} {...rest}>
      <Title>Amplitude</Title>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
        <SliderParam
          labelLeft="Attack"
          labelRight={`${attack}s`}
          value={attack}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => updateAmplitude({ attack: value[0] })}
        />

        <SliderParam
          labelLeft="Decay"
          labelRight={`${decay}s`}
          value={decay}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => updateAmplitude({ decay: value[0] })}
        />

        <SliderParam
          labelLeft="Sustain"
          value={sustain}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => updateAmplitude({ sustain: value[0] })}
        />

        <SliderParam
          labelLeft="Release"
          labelRight={`${release}s`}
          value={release}
          min={0}
          max={2}
          step={0.01}
          onChange={(value) => updateAmplitude({ release: value[0] })}
        />
      </div>

      <AdsrVisualizer {...amplitude} />
    </Card>
  );
}
