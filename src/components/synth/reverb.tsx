import { useSynthStore } from '../../stores/use-synth-store.ts';
import { Switch } from '../ui/switch.tsx';
import { cn } from '../../utils/cn.ts';
import type { HTMLAttributes } from 'react';
import { SliderParam } from '../atoms/slider-param.tsx';
import { Title } from '../atoms/title.tsx';
import { Card } from '../atoms/card.tsx';

export interface ReverbParameters {
  isActive: boolean;
  mix: number;
  time: number;
}

export function Reverb({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { isActive, mix, time } = useSynthStore((s) => s.parameters.reverb);
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

      <SliderParam
        id="reverb-mix"
        labelLeft="Dry"
        labelRight="Wet"
        value={mix}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => updateReverb({ mix: value[0] })}
      />

      <SliderParam
        id="reverb-time"
        labelLeft="Time"
        labelRight={`${time}s`}
        value={time}
        min={0}
        max={5}
        step={0.01}
        onChange={(value) => updateReverb({ time: value[0] })}
      />
    </Card>
  );
}
