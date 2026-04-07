import { useSynthStore } from '../../stores/use-synth-store.ts';
import { Switch } from '../ui/switch.tsx';
import { cn } from '../../utils/cn.ts';
import type { HTMLAttributes } from 'react';
import { Card } from '../atoms/card.tsx';
import { Title } from '../atoms/title.tsx';
import { SliderParam } from '../atoms/slider-param.tsx';

export interface NoiseParameters {
  isActive: boolean;
  volume: number;
}

export function Noise({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { isActive, volume } = useSynthStore((s) => s.parameters.noise);
  const updateNoise = useSynthStore((s) => s.updateNoise);

  return (
    <Card
      className={cn(
        'bg-slate-500/20 border-slate-500/60 dark:bg-slate-500/30 dark:border-slate-500/60',
        className,
      )}
      isActive={isActive}
      {...rest}
    >
      <div className="flex justify-between items-center">
        <Title>noise</Title>
        <Switch
          className="pointer-events-auto"
          checked={isActive}
          onCheckedChange={(checked) => updateNoise({ isActive: checked })}
        />
      </div>

      <SliderParam
        id="noise-volume"
        labelLeft="Volume"
        labelRight={`${volume}`}
        value={volume}
        min={0}
        max={100}
        step={1}
        onChange={(value) => updateNoise({ volume: value[0] })}
      />
    </Card>
  );
}
