import { Slider } from '../ui/slider.tsx';
import { Label } from '../ui/label.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';
import { Switch } from '../ui/switch.tsx';
import { cn } from '../../utils/cn.ts';
import type { HTMLAttributes } from 'react';

export interface DistortionParameters {
  isActive: boolean;
  amount: number;
}

export function Distortion({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { isActive, amount } = useSynthStore((s) => s.parameters.distortion);
  const updateDistortion = useSynthStore((s) => s.updateDistortion);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 border rounded-lg p-4 bg-red-500/20 border-red-500/60 dark:bg-red-500/30 dark:border-red-500/60',
        !isActive &&
          'opacity-50 pointer-events-none border-neutral-600/50 dark:border-neutral-600/50 bg-neutral-700/20 dark:bg-neutral-700/30',
        className,
      )}
      {...rest}
    >
      <div className="flex justify-between items-center">
        <p className="font-mono text-xl font-bold uppercase">distortion</p>
        <Switch
          className="pointer-events-auto"
          checked={isActive}
          onCheckedChange={(checked) => updateDistortion({ isActive: checked })}
        />
      </div>

      <div className="flex justify-between items-center">
        <Label>Amount</Label>
        <p className="text-sm">{amount}</p>
      </div>
      <Slider
        value={[amount]}
        min={0}
        max={100}
        step={1}
        onValueChange={(value) => updateDistortion({ amount: value[0] })}
      />
    </div>
  );
}
