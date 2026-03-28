import { Label } from '../ui/label.tsx';
import { Slider } from '../ui/slider.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';

export interface DelayParameters {
  mix: number;
  time: number;
  feedback: number;
}

export function Delay() {
  const { mix, time, feedback } = useSynthStore((s) => s.parameters.delay);
  const updateDelay = useSynthStore((s) => s.updateDelay);

  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-2xl">Delay</p>
      <div className="flex flex-col gap-4 border rounded-lg border-gray-200 dark:border-gray-600 p-4 w-sm">
        <div className="flex justify-between items-center">
          <Label>Dry</Label>
          <Label>Wet</Label>
        </div>
        <Slider
          value={[mix]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(value) => updateDelay({ mix: value[0] })}
        />

        <div className="flex justify-between items-center">
          <Label>Time</Label>
          <p className="text-sm">{time}</p>
        </div>
        <Slider
          value={[time]}
          min={0}
          max={2}
          step={0.01}
          onValueChange={(value) => updateDelay({ time: value[0] })}
        />

        <div className="flex justify-between items-center">
          <Label>Feedback</Label>
          <p className="text-sm">{feedback}</p>
        </div>
        <Slider
          value={[feedback]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(value) => updateDelay({ feedback: value[0] })}
        />
      </div>
    </div>
  );
}
