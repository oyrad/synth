import { isFilterType } from '../../utils/midi.ts';
import { useSynthStore } from '../../stores/use-synth-store.ts';
import { hzToLog, logToHz, MAX_FREQ, MIN_FREQ } from '../../utils/audio.ts';
import { Switch } from '../ui/switch.tsx';
import { cn } from '../../utils/cn.ts';
import { type HTMLAttributes } from 'react';
import { AdsrVisualizer } from './adsr-visualizer.tsx';
import { SliderParam } from '../atoms/slider-param.tsx';
import { Title } from '../atoms/title.tsx';
import { Card } from '../atoms/card.tsx';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs.tsx';

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

interface FilterSelectProps {
  value: BiquadFilterType;
  onChange: (value: string) => void;
  className?: string;
}

function FilterSelect({ value, onChange, className = '' }: FilterSelectProps) {
  return (
    <Tabs value={value} onValueChange={onChange} className={className}>
      <TabsList className="grid w-full grid-cols-3 border border-black/20 dark:border-white/20 bg-transparent">
        <TabsTrigger value="lowpass" title="Lowpass">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 8h10c4 0 8 2 10 12" />
          </svg>
        </TabsTrigger>
        <TabsTrigger value="highpass" title="Highpass">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 20c2-10 6-12 10-12h10" />
          </svg>
        </TabsTrigger>
        <TabsTrigger value="bandpass" title="Bandpass">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 20c4 0 7-16 10-16s6 16 10 16" />
          </svg>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export function Filter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { isActive, type, frequency, resonance, depth, ...adsr } = useSynthStore(
    (s) => s.parameters.filter,
  );

  const { attack, decay, sustain, release } = adsr;
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

      <FilterSelect
        value={type}
        onChange={(value) => {
          if (isFilterType(value)) {
            updateFilter({ type: value });
          }
        }}
      />

      <SliderParam
        labelLeft="Cutoff"
        labelRight={`${frequency} Hz`}
        value={hzToLog(frequency, MIN_FREQ, MAX_FREQ)}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => updateFilter({ frequency: logToHz(value[0], MIN_FREQ, MAX_FREQ) })}
      />

      <SliderParam
        labelLeft="Resonance"
        value={resonance}
        min={0}
        max={30}
        step={0.1}
        onChange={(value) => updateFilter({ resonance: value[0] })}
      />

      <SliderParam
        labelLeft="Depth"
        labelRight={`${depth} Hz`}
        value={depth}
        min={0}
        max={10000}
        step={20}
        onChange={(value) => updateFilter({ depth: value[0] })}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
        <SliderParam
          labelLeft="Attack"
          labelRight={`${attack}s`}
          value={attack}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => updateFilter({ attack: value[0] })}
        />

        <SliderParam
          labelLeft="Decay"
          labelRight={`${decay}s`}
          value={decay}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => updateFilter({ decay: value[0] })}
        />

        <SliderParam
          labelLeft="Sustain"
          labelRight={`${Math.floor(sustain * 100)}%`}
          value={sustain}
          min={0}
          max={1}
          step={0.01}
          onChange={(value) => updateFilter({ sustain: value[0] })}
        />

        <SliderParam
          labelLeft="Release"
          labelRight={`${release}s`}
          value={release}
          min={0}
          max={2}
          step={0.01}
          onChange={(value) => updateFilter({ release: value[0] })}
        />
      </div>

      <AdsrVisualizer
        className={cn(
          'bg-white/60  dark:bg-black/60 border border-violet-500/20',
          !isActive && 'bg-transparent',
        )}
        {...adsr}
      />
    </Card>
  );
}
