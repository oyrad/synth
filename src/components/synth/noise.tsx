import { Slider } from '../ui/slider.tsx';
import { Label } from '../ui/label.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';

export interface NoiseParameters {
  volume: number;
}

export function Noise() {
  const { volume } = useSynthStore((s) => s.parameters.noise);
  const updateNoise = useSynthStore((s) => s.updateNoise);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 border rounded-lg bg-slate-300 dark:bg-slate-600 border-slate-400 dark:border-slate-900 p-4">
        <p className="font-mono text-xl font-bold uppercase">noise</p>
        <div className="flex justify-between items-center">
          <Label>Volume</Label>
          <p className="text-sm">{volume}</p>
        </div>
        <Slider
          value={[volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => updateNoise({ volume: value[0] })}
        />
      </div>
    </div>
  );
}
