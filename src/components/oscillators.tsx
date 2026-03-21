import { Button } from './ui/button.tsx';
import { Checkbox } from './ui/checkbox.tsx';
import { Label } from './ui/label.tsx';
import type { Dispatch, SetStateAction } from 'react';
import { DEFAULT_OSCILLATOR_DATA, type OscillatorData } from '../utils/default-oscillator-data.ts';
import { Slider } from './ui/slider.tsx';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx';
import { isOscillatorType } from '../utils/midi.ts';
import { X } from 'lucide-react';

interface OscillatorsProps {
  oscillators: Array<OscillatorData>;
  setOscillators: Dispatch<SetStateAction<Array<OscillatorData>>>;
}

export function Oscillators({ oscillators, setOscillators }: OscillatorsProps) {
  return (
    <div className="flex flex-col gap-4 w-2/3">
      <div className="flex justify-between items-center">
        <h3 className="font-mono text-2xl">Oscillators</h3>
        <Button
          size="lg"
          variant="outline"
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
          Add oscillator
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {oscillators.map(oscillator =>
          <div
            className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4"
            key={oscillator.id}
          >
            <div className="flex gap-2">
              <Select
                value={oscillator.waveform}
                onValueChange={(value) => {
                  if (isOscillatorType(value)) {
                    setOscillators((prev) =>
                      prev.map(osc => osc.id === oscillator.id ? { ...osc, waveform: value } : osc)
                    );
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select waveform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="sine">Sine</SelectItem>
                    <SelectItem value="triangle">Triangle</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="sawtooth">Sawtooth</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  setOscillators((prev) => prev.filter(osc => osc.id !== oscillator.id));
                }}
              >
                <X />
              </Button>
            </div>

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

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Label>Volume</Label>
                <p className="text-sm">{oscillator.volume}</p>
              </div>
              <Slider
                defaultValue={[oscillator.volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setOscillators((prev) =>
                  prev.map(osc => osc.id === oscillator.id ? {
                    ...osc,
                    volume: value[0]
                  } : osc)
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Label>Detune</Label>
                <p className="text-sm">{oscillator.detune}</p>
              </div>
              <Slider
                defaultValue={[oscillator.detune]}
                min={-100}
                max={100}
                step={1}
                onValueChange={(value) => setOscillators((prev) =>
                  prev.map(osc => osc.id === oscillator.id ? {
                    ...osc,
                    detune: value[0]
                  } : osc)
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}