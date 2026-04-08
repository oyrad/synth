import { useSynthStore } from '../../../stores/use-synth-store.ts';
import type { HTMLAttributes } from 'react';
import { Title } from '../../atoms/title.tsx';
import { Card } from '../../atoms/card.tsx';
import { AmplitudeAttack } from './amplitude-attack.tsx';
import { AmplitudeDecay } from './amplitude-decay.tsx';
import { AmplitudeSustain } from './amplitude-sustain.tsx';
import { AmplitudeRelease } from './amplitude-release.tsx';
import { AmplitudeAdsrVisualizer } from './amplitude-adsr-visualizer.tsx';

export interface AmplitudeParameters {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export function Amplitude({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const updateAmplitude = useSynthStore((s) => s.updateAmplitude);

  return (
    <Card className={className} {...rest}>
      <Title>Amplitude</Title>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
        <AmplitudeAttack onChange={(value) => updateAmplitude({ attack: value })} />
        <AmplitudeDecay onChange={(value) => updateAmplitude({ decay: value })} />
        <AmplitudeSustain onChange={(value) => updateAmplitude({ sustain: value })} />
        <AmplitudeRelease onChange={(value) => updateAmplitude({ release: value })} />
      </div>

      <AmplitudeAdsrVisualizer />
    </Card>
  );
}
