import { isFilterType } from '../../../utils/midi.ts';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import { Switch } from '../../ui/switch.tsx';
import { cn } from '../../../utils/cn.ts';
import { type HTMLAttributes } from 'react';
import { AdsrVisualizer } from '../adsr-visualizer.tsx';
import { SliderParam } from '../../atoms/slider-param.tsx';
import { Title } from '../../atoms/title.tsx';
import { Card } from '../../atoms/card.tsx';
import { FilterFrequency } from './filter-frequency.tsx';
import { FilterType } from './filter-type.tsx';
import { FilterDepth } from './filter-depth.tsx';
import { FilterResonance } from './filter-resonance.tsx';

export interface FilterParameters {
  isActive: boolean;
  type: BiquadFilterType;
  frequency: number;
  resonance: number;
  depth: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export function Filter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const isActive = useSynthStore((s) => s.parameters.filter.isActive);
  const attack = useSynthStore((s) => s.parameters.filter.attack);
  const decay = useSynthStore((s) => s.parameters.filter.decay);
  const sustain = useSynthStore((s) => s.parameters.filter.sustain);
  const release = useSynthStore((s) => s.parameters.filter.release);

  const updateFilter = useSynthStore((s) => s.updateFilter);

  return (
    <Card
      className={cn(
        'bg-violet-500/20 border-violet-500/60 dark:bg-violet-500/30 dark:border-violet-500/60',
        className,
      )}
      isActive={isActive}
      {...rest}
    >
      <div className="flex justify-between items-center">
        <Title>Filter</Title>
        <Switch
          className="pointer-events-auto"
          checked={isActive}
          onCheckedChange={(checked) => updateFilter({ isActive: checked })}
        />
      </div>

      <FilterType onChange={(value) => isFilterType(value) && updateFilter({ type: value })} />
      <FilterFrequency onChange={(value) => updateFilter({ frequency: value })} />
      <FilterResonance onChange={(value) => updateFilter({ resonance: value })} />
      <FilterDepth onChange={(value) => updateFilter({ depth: value })} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
        <SliderParam
          id="filter-attack"
          labelLeft="Attack"
          labelRight={`${attack}s`}
          value={attack}
          min={0}
          max={2}
          step={0.01}
          onChange={(value) => updateFilter({ attack: value[0] })}
        />

        <SliderParam
          id="filter-decay"
          labelLeft="Decay"
          labelRight={`${decay}s`}
          value={decay}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => updateFilter({ decay: value[0] })}
        />

        <SliderParam
          id="filter-sustain"
          labelLeft="Sustain"
          labelRight={`${Math.floor(sustain * 100)}%`}
          value={sustain}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => updateFilter({ sustain: value[0] })}
        />

        <SliderParam
          id="filter-release"
          labelLeft="Release"
          labelRight={`${release}s`}
          value={release}
          min={0}
          max={4}
          step={0.01}
          onChange={(value) => updateFilter({ release: value[0] })}
        />
      </div>

      <AdsrVisualizer
        className={cn(
          'bg-white/60  dark:bg-black/60 border border-violet-500/20',
          !isActive && 'bg-transparent',
        )}
        attack={attack}
        decay={decay}
        sustain={sustain}
        release={release}
      />
    </Card>
  );
}
