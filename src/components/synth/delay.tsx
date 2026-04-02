import { useSynthStore } from '../../stores/use-synth-store.ts';
import { Switch } from '../ui/switch.tsx';
import { cn } from '../../utils/cn.ts';
import type { HTMLAttributes } from 'react';
import { Title } from '../atoms/title.tsx';
import { Card } from '../atoms/card.tsx';
import { SliderParam } from '../atoms/slider-param.tsx';

export interface DelayParameters {
  isActive: boolean;
  mix: number;
  time: number;
  feedback: number;
}

export function Delay({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { isActive, mix, time, feedback } = useSynthStore((s) => s.parameters.delay);
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

      <SliderParam
        labelLeft="Dry"
        labelRight="Wet"
        value={mix}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => updateDelay({ mix: value[0] })}
      />

      <SliderParam
        labelLeft="Time"
        labelRight={`${time}s`}
        value={time}
        min={0}
        max={5}
        step={0.1}
        onChange={(value) => updateDelay({ time: value[0] })}
      />

      <SliderParam
        labelLeft="Feedback"
        value={feedback}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => updateDelay({ feedback: value[0] })}
      />
    </Card>
  );
}
