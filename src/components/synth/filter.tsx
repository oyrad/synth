import { Label } from '../ui/label.tsx';
import { Slider } from '../ui/slider.tsx';
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
    <div
      className={cn(
        'flex flex-col gap-4 border rounded-lg p-4 h-fit',
        !isActive && 'opacity-50 pointer-events-none',
        className,
      )}
      {...rest}
    >
      <div className="flex justify-between items-center">
        <p className="font-mono text-xl font-bold uppercase">filter</p>
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

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Label>Frequency</Label>
          <p className="text-sm">{frequency} Hz</p>
        </div>
        <Slider
          value={[hzToLog(frequency, MIN_FREQ, MAX_FREQ)]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(value) =>
            updateFilter({ frequency: logToHz(value[0], MIN_FREQ, MAX_FREQ) })
          }
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Label>Resonance</Label>
          <p className="text-sm">{resonance}</p>
        </div>
        <Slider
          value={[resonance]}
          min={0}
          max={30}
          step={0.1}
          onValueChange={(value) => updateFilter({ resonance: value[0] })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Label>Depth</Label>
          <p className="text-sm">{depth} Hz</p>
        </div>
        <Slider
          value={[depth]}
          min={0}
          max={5000}
          step={20}
          onValueChange={(value) => updateFilter({ depth: value[0] })}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Label>Attack</Label>
            <p className="text-sm">{attack}s</p>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[attack]}
            onValueChange={(value) => updateFilter({ attack: value[0] })}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Label>Decay</Label>
            <p className="text-sm">{decay}s</p>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[decay]}
            onValueChange={(value) => updateFilter({ decay: value[0] })}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Label>Sustain</Label>
            <p className="text-sm">{sustain}</p>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[sustain]}
            onValueChange={(value) => updateFilter({ sustain: value[0] })}
          />
        </div>

        <div className="flex flex-col gap-3 mb-2">
          <div className="flex justify-between items-center">
            <Label>Release</Label>
            <p className="text-sm">{release}s</p>
          </div>
          <Slider
            min={0}
            max={2}
            step={0.01}
            value={[release]}
            onValueChange={(value) => updateFilter({ release: value[0] })}
          />
        </div>
      </div>

      <AdsrVisualizer {...adsr} />
    </div>
  );
}
