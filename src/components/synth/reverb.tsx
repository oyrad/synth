import { Slider } from '../ui/slider.tsx';
import { Label } from '../ui/label.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';
import { Switch } from '../ui/switch.tsx';
import { cn } from '../../utils/cn.ts';
import type { HTMLAttributes } from 'react';

export interface ReverbParameters {
  isActive: boolean;
  mix: number;
  time: number;
}

export function Reverb({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { isActive, mix, time } = useSynthStore((s) => s.parameters.reverb);
  const updateReverb = useSynthStore((s) => s.updateReverb);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 border rounded-lg p-4 bg-sky-500/20 border-sky-500/60 dark:bg-sky-500/30 dark:border-sky-500/60 ',
        !isActive &&
          'opacity-50 pointer-events-none border-neutral-600/50 dark:border-neutral-600/50 bg-neutral-700/20 dark:bg-neutral-700/30',
        className,
      )}
      {...rest}
    >
      <div className="flex justify-between items-center">
        <p className="font-mono text-xl font-bold uppercase">reverb</p>
        <Switch
          className="pointer-events-auto"
          checked={isActive}
          onCheckedChange={(checked) => updateReverb({ isActive: checked })}
        />
      </div>

      <div className="flex justify-between items-center">
        <Label>Dry</Label>
        <Label>Wet</Label>
      </div>
      <Slider
        value={[mix]}
        min={0}
        max={1}
        step={0.01}
        onValueChange={(value) => updateReverb({ mix: value[0] })}
      />
      <div className="flex justify-between items-center">
        <Label>Time</Label>
        <p className="text-sm">{time}</p>
      </div>
      <Slider
        value={[time]}
        min={0}
        max={5}
        step={0.01}
        onValueChange={(value) => updateReverb({ time: value[0] })}
      />
    </div>
  );
}
