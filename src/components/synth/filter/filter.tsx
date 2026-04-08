import { isFilterType } from '../../../utils/midi.ts';
import { useSynthStore } from '../../../stores/use-synth-store.ts';
import { Switch } from '../../ui/switch.tsx';
import { cn } from '../../../utils/cn.ts';
import { type HTMLAttributes } from 'react';
import { Title } from '../../atoms/title.tsx';
import { Card } from '../../atoms/card.tsx';
import { FilterFrequency } from './filter-frequency.tsx';
import { FilterType } from './filter-type.tsx';
import { FilterDepth } from './filter-depth.tsx';
import { FilterResonance } from './filter-resonance.tsx';
import { FilterAdsrVisualizer } from './filter-adsr-visualizer.tsx';
import { FilterAttack } from './filter-attack.tsx';
import { FilterDecay } from './filter-decay.tsx';
import { FilterSustain } from './filter-sustain.tsx';
import { FilterRelease } from './filter-release.tsx';

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
        <FilterAttack onChange={(value) => updateFilter({ attack: value })} />
        <FilterDecay onChange={(value) => updateFilter({ decay: value })} />
        <FilterSustain onChange={(value) => updateFilter({ sustain: value })} />
        <FilterRelease onChange={(value) => updateFilter({ release: value })} />
      </div>

      <FilterAdsrVisualizer />
    </Card>
  );
}
