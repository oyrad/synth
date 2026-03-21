import { useState } from 'react';
import { Button } from './ui/button.tsx';
import { WaveformSelect } from './waveform-select.tsx';
import { Checkbox } from './ui/checkbox.tsx';
import { Label } from './ui/label.tsx';

export interface OscillatorData {
  id: string;
  waveform: OscillatorType;
  velocitySensitive: boolean;
  volume: number;
  detune: number;
}

const DEFAULT_OSCILLATOR_DATA: Omit<OscillatorData, 'id'> = {
  waveform: 'sine',
  velocitySensitive: true,
  volume: 0.5,
  detune: 0
};

export function Oscillators() {
  const [oscillators, setOscillators] = useState<Array<OscillatorData>>([{
    ...DEFAULT_OSCILLATOR_DATA,
    id: crypto.randomUUID()
  }]);

  console.log(oscillators);

  return (
    <div className="flex flex-col gap-4 w-2/3">
      <div className="flex justify-between items-center">
        <p>Oscillators</p>
        <Button
          onClick={() => {
            setOscillators((prev) => [
              ...prev,
              {
                ...DEFAULT_OSCILLATOR_DATA,
                id: crypto.randomUUID()
              }
            ]);
          }}
        >
          Add Oscillator
        </Button>
      </div>

      <div className="flex flex-wrap">
        {oscillators.map(oscillator =>
          <div
            className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4 w-1/3"
            key={oscillator.id}
          >
            <WaveformSelect
              waveform={oscillator.waveform}
              onSelect={(value) => {
                setOscillators((prev) =>
                  prev.map(osc => osc.id === oscillator.id ? { ...osc, waveform: value } : osc)
                );
              }}
            />

            <div className="flex items-center gap-2">
              <Checkbox
                id={`velocity-sensitive-${oscillator.id}`}
                checked={oscillator.velocitySensitive}
                onCheckedChange={(checked) => setOscillators((prev) => {
                  return prev.map(osc => osc.id === oscillator.id ? {
                    ...osc,
                    velocitySensitive: checked === true
                  } : osc);
                })}
              />
              <Label htmlFor={`velocity-sensitive-${oscillator.id}`}>Velocity sensitive</Label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}