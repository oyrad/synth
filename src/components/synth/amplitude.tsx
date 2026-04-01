import { Slider } from '../ui/slider.tsx';
import { Label } from '../ui/label.tsx';
import { AdsrVisualizer } from './adsr-visualizer.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn.ts';

export interface AmplitudeParameters {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export function Amplitude({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const amplitude = useSynthStore((s) => s.parameters.amplitude);
  const updateAmplitude = useSynthStore((s) => s.updateAmplitude);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 border border-gray-200 dark:border-neutral-800 rounded-lg p-4',
        className,
      )}
      {...rest}
    >
      <p className="font-mono text-xl uppercase font-bold">Amplitude</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Label>Attack</Label>
            <p className="text-sm">{amplitude.attack}s</p>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[amplitude.attack]}
            onValueChange={(value) => updateAmplitude({ attack: value[0] })}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Label>Decay</Label>
            <p className="text-sm">{amplitude.decay}s</p>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[amplitude.decay]}
            onValueChange={(value) => updateAmplitude({ decay: value[0] })}
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Label>Sustain</Label>
            <p className="text-sm">{amplitude.sustain}</p>
          </div>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[amplitude.sustain]}
            onValueChange={(value) => updateAmplitude({ sustain: value[0] })}
          />
        </div>
        <div className="flex flex-col gap-3 mb-2">
          <div className="flex justify-between items-center">
            <Label>Release</Label>
            <p className="text-sm">{amplitude.release}s</p>
          </div>
          <Slider
            min={0}
            max={2}
            step={0.01}
            value={[amplitude.release]}
            onValueChange={(value) => updateAmplitude({ release: value[0] })}
          />
        </div>
      </div>

      <AdsrVisualizer {...amplitude} />
    </div>
  );
}
