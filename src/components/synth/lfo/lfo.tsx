import { Switch } from '../../ui/switch.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import type { HTMLAttributes } from 'react';
import { Card } from '../../atoms/card.tsx';
import { cn } from '../../../utils/cn.ts';
import { Title } from '../../atoms/title.tsx';
import { ArrowRight } from 'lucide-react';
import { LFOWaveform } from './lfo-waveform.tsx';
import { LFOTarget, type LFOTargetType } from './lfo-target.tsx';
import { LFOFrequency } from './lfo-frequency.tsx';
import { LFODepth } from './lfo-depth.tsx';

export interface LFOParameters {
  isActive: boolean;
  waveform: OscillatorType;
  frequency: number;
  depth: number;
  target: LFOTargetType;
}

export function LFO({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const isActive = useSynthStore((s) => s.parameters.lfo.isActive);
  const updateLFO = useSynthStore((s) => s.updateLFO);

  return (
    <Card
      className={cn(
        'bg-teal-500/20 border-teal-500/60 dark:bg-teal-500/30 dark:border-teal-500/60',
        className,
      )}
      isActive={isActive}
      {...rest}
    >
      <div className="flex justify-between items-center">
        <Title>lfo</Title>
        <Switch
          className="pointer-events-auto"
          checked={isActive}
          onCheckedChange={(checked) => updateLFO({ isActive: checked })}
        />
      </div>

      <div className="flex items-center gap-4">
        <LFOWaveform onChange={(waveform) => updateLFO({ waveform })} />

        <ArrowRight className="size-12" />

        <LFOTarget onChange={(target) => updateLFO({ target })} />
      </div>

      <LFOFrequency onChange={(frequency) => updateLFO({ frequency })} />

      <LFODepth onChange={(depth) => updateLFO({ depth })} />
    </Card>
  );
}
