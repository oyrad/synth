import { Slider } from '../ui/slider.tsx';
import { Label } from '../ui/label.tsx';
import { AdsrVisualizer } from './adsr-visualizer.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';

export interface AdsrEnvelope {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export function Adsr() {
  const adsr = useSynthStore((s) => s.adsr);
  const updateAdsr = useSynthStore((s) => s.updateAdsr);

  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-2xl">ADSR Envelope</p>

      <div className="flex gap-4 items-stretch">
        <AdsrVisualizer adsr={adsr} />

        <div className="flex flex-col gap-6 border border-gray-200 dark:border-gray-600 rounded-lg p-4 w-sm">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label>Attack</Label>
              <p className="text-sm">{adsr.attack}s</p>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[adsr.attack]}
              onValueChange={(value) => updateAdsr({ attack: value[0] })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label>Decay</Label>
              <p className="text-sm">{adsr.decay}s</p>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[adsr.decay]}
              onValueChange={(value) => updateAdsr({ decay: value[0] })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label>Sustain</Label>
              <p className="text-sm">{adsr.sustain}</p>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[adsr.sustain]}
              onValueChange={(value) => updateAdsr({ sustain: value[0] })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Label>Release</Label>
              <p className="text-sm">{adsr.release}s</p>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[adsr.release]}
              onValueChange={(value) => updateAdsr({ release: value[0] })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
