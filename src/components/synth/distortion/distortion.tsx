import { useSynthStore } from '../../../stores/use-synth-store.ts';
import { Switch } from '../../ui/switch.tsx';
import { cn } from '../../../utils/cn.ts';
import type { HTMLAttributes } from 'react';
import { Card } from '../../atoms/card.tsx';
import { Title } from '../../atoms/title.tsx';
import { DistortionAmount } from './distortion-amount.tsx';

export interface DistortionParameters {
  isActive: boolean;
  amount: number;
}

export function Distortion({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const isActive = useSynthStore((s) => s.parameters.distortion.isActive);
  const updateDistortion = useSynthStore((s) => s.updateDistortion);

  return (
    <Card
      className={cn(
        'bg-red-500/20 border-red-500/60 dark:bg-red-500/30 dark:border-red-500/60',
        className,
      )}
      isActive={isActive}
      {...rest}
    >
      <div className="flex justify-between items-center">
        <Title>distortion</Title>
        <Switch
          className="pointer-events-auto"
          checked={isActive}
          onCheckedChange={(checked) => updateDistortion({ isActive: checked })}
        />
      </div>

      <DistortionAmount onChange={(value) => updateDistortion({ amount: value })} />
    </Card>
  );
}
