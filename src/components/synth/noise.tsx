import { Slider } from '../ui/slider.tsx';
import { Label } from '../ui/label.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';
import { Switch } from '../ui/switch.tsx';
import { cn } from '../../utils/cn.ts';
import type { HTMLAttributes } from 'react';

export interface NoiseParameters {
  isActive: boolean;
  volume: number;
}

export function Noise({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { isActive, volume } = useSynthStore((s) => s.parameters.noise);
  const updateNoise = useSynthStore((s) => s.updateNoise);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 border rounded-lg p-4 bg-slate-500/20 border-slate-500/60 dark:bg-slate-500/30 dark:border-slate-500/60',
        !isActive &&
          'opacity-50 pointer-events-none border-neutral-600/50 dark:border-neutral-600/50 bg-neutral-700/20 dark:bg-neutral-700/30',
        className,
      )}
      {...rest}
    >
      <div className="flex justify-between items-center">
        <p className="font-mono text-xl font-bold uppercase">noise</p>
        <Switch
          className="pointer-events-auto"
          checked={isActive}
          onCheckedChange={(checked) => updateNoise({ isActive: checked })}
        />
      </div>

      <div className="flex justify-between items-center">
        <Label>Volume</Label>
        <p className="text-sm">{volume}</p>
      </div>
      <Slider
        value={[volume]}
        min={0}
        max={100}
        step={1}
        onValueChange={(value) => updateNoise({ volume: value[0] })}
      />
    </div>
  );
}
