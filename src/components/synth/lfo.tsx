import { Switch } from '../ui/switch.tsx';
import { Label } from '../ui/label.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';
import type { HTMLAttributes } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.tsx';
import { isOscillatorType } from '../../utils/midi.ts';
import { SliderParam } from '../atoms/slider-param.tsx';
import { Card } from '../atoms/card.tsx';
import { cn } from '../../utils/cn.ts';
import { Title } from '../atoms/title.tsx';
import { WaveformSelect } from './waveform-select.tsx';

type LFOTarget = 'pitch' | 'volume' | 'filter';

function isLFOTargetType(value: string): value is LFOTarget {
  return ['pitch', 'volume', 'filter'].includes(value);
}

const getDepthLabel = (value: number, target: string) => {
  switch (target) {
    case 'pitch':
      return `${(value / 100).toFixed(2)} st`;

    case 'filter':
      return `${value} Hz`;

    case 'volume':
      return `${(value / 10).toFixed(0)}%`;

    default:
      return value.toString();
  }
};

export interface LFOParameters {
  isActive: boolean;
  waveform: OscillatorType;
  frequency: number;
  depth: number;
  target: LFOTarget;
}

export function LFO({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { isActive, waveform, target, frequency, depth } = useSynthStore((s) => s.parameters.lfo);
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

      <div className="flex gap-4">
        <div className="flex flex-col gap-3 flex-1">
          <Label>Waveform</Label>
          <WaveformSelect
            value={waveform}
            onChange={(value) => {
              if (isOscillatorType(value)) {
                updateLFO({ waveform: value });
              }
            }}
          />
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <Label>Target</Label>
          <Select
            value={target}
            onValueChange={(value) => {
              if (isLFOTargetType(value)) {
                updateLFO({ target: value });
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select waveform" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="pitch">Pitch</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="filter">Filter</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SliderParam
        labelLeft="Frequency"
        labelRight={`${frequency} Hz`}
        value={frequency}
        min={0}
        max={20}
        step={0.01}
        onChange={(value) => updateLFO({ frequency: value[0] })}
      />

      <SliderParam
        labelLeft="Depth"
        labelRight={getDepthLabel(depth, target)}
        value={depth}
        min={0}
        max={1000}
        step={10}
        onChange={(value) => updateLFO({ depth: value[0] })}
      />
    </Card>
  );
}
