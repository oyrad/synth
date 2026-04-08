import { AdsrVisualizer } from '../adsr-visualizer.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import type { HTMLAttributes } from 'react';
import { SliderParam } from '../../atoms/slider-param.tsx';
import { Title } from '../../atoms/title.tsx';
import { Card } from '../../atoms/card.tsx';
import {
  ADSR_STEP,
  ATTACK_MAX,
  ATTACK_MIN,
  DECAY_MAX,
  DECAY_MIN,
  RELEASE_MAX,
  RELEASE_MIN,
  SUSTAIN_MAX,
  SUSTAIN_MIN,
} from '../../../consts/parameter-values.ts';

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
    <Card className={className} {...rest}>
      <Title>Amplitude</Title>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
        <SliderParam
          id="amplitude-attack"
          labelLeft="Attack"
          labelRight={`${attack}s`}
          value={attack}
          min={ATTACK_MIN}
          max={ATTACK_MAX}
          step={ADSR_STEP}
          onChange={(value) => updateAmplitude({ attack: value[0] })}
        />

        <SliderParam
          id="amplitude-decay"
          labelLeft="Decay"
          labelRight={`${decay}s`}
          value={decay}
          min={DECAY_MIN}
          max={DECAY_MAX}
          step={ADSR_STEP}
          onChange={(value) => updateAmplitude({ decay: value[0] })}
        />

        <SliderParam
          id="amplitude-sustain"
          labelLeft="Sustain"
          labelRight={`${Math.floor(sustain * 100)}%`}
          value={sustain}
          min={SUSTAIN_MIN}
          max={SUSTAIN_MAX}
          step={ADSR_STEP}
          onChange={(value) => updateAmplitude({ sustain: value[0] })}
        />

        <SliderParam
          id="amplitude-release"
          labelLeft="Release"
          labelRight={`${release}s`}
          value={release}
          min={RELEASE_MIN}
          max={RELEASE_MAX}
          step={ADSR_STEP}
          onChange={(value) => updateAmplitude({ release: value[0] })}
        />
      </div>

      <AdsrVisualizer {...amplitude} />
    </Card>
  );
}
