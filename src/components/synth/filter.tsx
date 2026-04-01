import { isFilterType } from '../../utils/midi.ts';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';
import { hzToLog, logToHz, MAX_FREQ, MIN_FREQ } from '../../utils/audio.ts';
import { Switch } from '../ui/switch.tsx';
import { cn } from '../../utils/cn.ts';
import type { HTMLAttributes } from 'react';
import { AdsrVisualizer } from './adsr-visualizer.tsx';
import { SliderParam } from '../atoms/slider-param.tsx';
import { Title } from '../atoms/title.tsx';
import { Card } from '../atoms/card.tsx';

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
  const { isActive, type, frequency, resonance, depth, ...adsr } = useSynthStore(
    (s) => s.parameters.filter,
  );

  const { attack, decay, sustain, release } = adsr;
  const updateFilter = useSynthStore((s) => s.updateFilter);

  return (
    <Card className={cn('', className)} isActive={isActive} {...rest}>
      <div className="flex justify-between items-center">
        <Title>Filter</Title>
        <Switch
          className="pointer-events-auto"
          checked={isActive}
          onCheckedChange={(checked) => updateFilter({ isActive: checked })}
        />
      </div>

      <Select
        value={type}
        onValueChange={(value) => {
          if (isFilterType(value)) {
            updateFilter({ type: value });
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select waveform" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="lowpass">Lowpass</SelectItem>
            <SelectItem value="highpass">Highpass</SelectItem>
            <SelectItem value="bandpass">Bandpass</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <SliderParam
        labelLeft="Cutoff"
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
        value={depth}
        min={0}
        max={5000}
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

      <AdsrVisualizer {...adsr} />
    </Card>
  );
}
