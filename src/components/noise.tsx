import { Slider } from './ui/slider.tsx';
import { Label } from './ui/label.tsx';
import { useSynthStore } from '../stores/use-synth-store.ts';

export interface NoiseData {
  volume: number;
}

export function Noise() {
  const { volume } = useSynthStore((s) => s.noise);
  const updateNoise = useSynthStore((s) => s.updateNoise);

  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-2xl">Noise</p>
      <div className="flex flex-col gap-4 border rounded-lg border-gray-200 dark:border-gray-600 p-4 w-sm">
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
