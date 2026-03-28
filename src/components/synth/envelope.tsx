import { Slider } from '../ui/slider.tsx';
import { Label } from '../ui/label.tsx';
import { EnvelopeVisualizer } from './envelope-visualizer.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';

export interface EnvelopeParameters {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export function Envelope() {
  const envelope = useSynthStore((s) => s.parameters.envelope);
  const updateAdsr = useSynthStore((s) => s.updateEnvelope);

  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-2xl">Envelope</p>

      <div className="flex gap-4 items-stretch">
        <EnvelopeVisualizer envelope={envelope} />

        <div className="flex flex-col gap-6 border border-gray-200 dark:border-gray-600 rounded-lg p-4 w-sm">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label>Attack</Label>
              <p className="text-sm">{envelope.attack}s</p>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[envelope.attack]}
              onValueChange={(value) => updateAdsr({ attack: value[0] })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label>Decay</Label>
              <p className="text-sm">{envelope.decay}s</p>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[envelope.decay]}
              onValueChange={(value) => updateAdsr({ decay: value[0] })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label>Sustain</Label>
              <p className="text-sm">{envelope.sustain}</p>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[envelope.sustain]}
              onValueChange={(value) => updateAdsr({ sustain: value[0] })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label>Release</Label>
              <p className="text-sm">{envelope.release}s</p>
            </div>
            <Slider
              min={0}
              max={2}
              step={0.01}
              value={[envelope.release]}
              onValueChange={(value) => updateAdsr({ release: value[0] })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
