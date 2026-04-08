import { useSynthStore } from '../../../stores/use-synth-store.ts';
import { Switch } from '../../ui/switch.tsx';
import { cn } from '../../../utils/cn.ts';
import type { HTMLAttributes } from 'react';
import { Title } from '../../atoms/title.tsx';
import { Card } from '../../atoms/card.tsx';
import { DelayMix } from './delay-mix.tsx';
import { DelayTime } from './delay-time.tsx';
import { DelayFeedback } from './delay-feedback.tsx';

export interface DelayParameters {
  isActive: boolean;
  mix: number;
  time: number;
  feedback: number;
}

export function Delay({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const isActive = useSynthStore((s) => s.parameters.delay.isActive);
  const updateDelay = useSynthStore((s) => s.updateDelay);

  return (
    <Card
      className={cn(
        'bg-fuchsia-500/20 border-fuchsia-500/60 dark:bg-fuchsia-500/30 dark:border-fuchsia-500/60',
        className,
      )}
      isActive={isActive}
      {...rest}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Title>Delay</Title>
          <Switch
            className="pointer-events-auto"
            checked={isActive}
            onCheckedChange={(checked) => updateDelay({ isActive: checked })}
          />
        </div>
      </div>

      <DelayMix onChange={(value) => updateDelay({ mix: value })} />
      <DelayTime onChange={(value) => updateDelay({ time: value })} />
      <DelayFeedback onChange={(value) => updateDelay({ feedback: value })} />
    </Card>
  );
}
