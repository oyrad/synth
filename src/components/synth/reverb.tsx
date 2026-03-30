import { Slider } from '../ui/slider.tsx';
import { Label } from '../ui/label.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';

export interface ReverbParameters {
  mix: number;
  time: number;
}

export function Reverb() {
  const { mix, time } = useSynthStore((s) => s.parameters.reverb);
  const updateReverb = useSynthStore((s) => s.updateReverb);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 border rounded-lg bg-blue-400 dark:bg-sky-700 border-blue-500 dark:border-sky-900 p-4">
        <p className="font-mono text-xl font-bold uppercase">reverb</p>
        <div className="flex justify-between items-center">
          <Label>Dry</Label>
          <Label>Wet</Label>
        </div>
        <Slider
          value={[mix]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(value) => updateReverb({ mix: value[0] })}
        />

        <div className="flex justify-between items-center">
          <Label>Time</Label>
          <p className="text-sm">{time}</p>
        </div>
        <Slider
          value={[time]}
          min={0}
          max={5}
          step={0.01}
          onValueChange={(value) => updateReverb({ time: value[0] })}
        />
      </div>
    </div>
  );
}
