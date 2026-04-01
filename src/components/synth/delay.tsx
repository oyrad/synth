import { Label } from '../ui/label.tsx';
import { Slider } from '../ui/slider.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';
import { Switch } from '../ui/switch.tsx';
import { cn } from '../../utils/cn.ts';
import type { HTMLAttributes } from 'react';

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
    <div
      className={cn(
        'flex flex-col gap-4 border rounded-lg p-4 bg-fuchsia-500/20 border-fuchsia-500/60 dark:bg-fuchsia-500/30 dark:border-fuchsia-500/60',
        !isActive &&
          'opacity-50 pointer-events-none border-neutral-600/50 dark:border-neutral-600/50 bg-neutral-700/20 dark:bg-neutral-700/30',
        className,
      )}
      {...rest}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="font-mono text-xl font-bold uppercase">delay</p>
          <Switch
            className="pointer-events-auto"
            checked={isActive}
            onCheckedChange={(checked) => updateDelay({ isActive: checked })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Label>Dry</Label>
          <Label>Wet</Label>
        </div>
        <Slider
          value={[mix]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(value) => updateDelay({ mix: value[0] })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Label>Time</Label>
          <p className="text-sm">{time}</p>
        </div>
        <Slider
          value={[time]}
          min={0}
          max={2}
          step={0.01}
          onValueChange={(value) => updateDelay({ time: value[0] })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Label>Feedback</Label>
          <p className="text-sm">{feedback}</p>
        </div>
        <Slider
          value={[feedback]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(value) => updateDelay({ feedback: value[0] })}
        />
      </div>
    </div>
  );
}
