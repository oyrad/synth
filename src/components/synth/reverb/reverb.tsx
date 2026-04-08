import { useSynthStore } from '../../../stores/use-synth-store.ts';
import { Switch } from '../../ui/switch.tsx';
import { cn } from '../../../utils/cn.ts';
import type { HTMLAttributes } from 'react';
import { Title } from '../../atoms/title.tsx';
import { Card } from '../../atoms/card.tsx';
import { ReverbMix } from './reverb-mix.tsx';
import { ReverbTime } from './reverb-time.tsx';

export interface ReverbParameters {
  isActive: boolean;
  mix: number;
  time: number;
}

export function Reverb({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const isActive = useSynthStore((s) => s.parameters.reverb.isActive);
  const updateReverb = useSynthStore((s) => s.updateReverb);

  return (
    <Card
      className={cn(
        'bg-sky-500/20 border-sky-500/60 dark:bg-sky-500/30 dark:border-sky-500/60',
        className,
      )}
      isActive={isActive}
      {...rest}
    >
      <div className="flex justify-between items-center">
        <Title>reverb</Title>
        <Switch
          className="pointer-events-auto"
          checked={isActive}
          onCheckedChange={(checked) => updateReverb({ isActive: checked })}
        />
      </div>

      <ReverbMix onChange={(value) => updateReverb({ mix: value })} />
      <ReverbTime onChange={(value) => updateReverb({ time: value })} />
    </Card>
  );
}
