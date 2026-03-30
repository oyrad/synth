import { Slider } from '../ui/slider.tsx';
import { Label } from '../ui/label.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';

export interface DistortionParameters {
  amount: number;
}

export function Distortion() {
  const { amount } = useSynthStore((s) => s.parameters.distortion);
  const updateDistortion = useSynthStore((s) => s.updateDistortion);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 border rounded-lg bg-red-400 dark:bg-rose-700 border-red-500 dark:border-rose-900 p-4">
        <p className="font-mono text-xl font-bold uppercase">distortion</p>
        <div className="flex justify-between items-center">
          <Label>Amount</Label>
          <p className="text-sm">{amount}</p>
        </div>
        <Slider
          value={[amount]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => updateDistortion({ amount: value[0] })}
        />
      </div>
    </div>
  );
}
