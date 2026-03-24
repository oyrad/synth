import { Button } from '../ui/button.tsx';
import { Label } from '../ui/label.tsx';
import { Slider } from '../ui/slider.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.tsx';
import { isOscillatorType } from '../../utils/midi.ts';
import { Plus, X } from 'lucide-react';
import { Toggle } from '../ui/toggle.tsx';
import { useSynthStore } from '../../hooks/use-synth-store.ts';

export interface OscillatorData {
  id: string;
  waveform: OscillatorType;
  isMute: boolean;
  volume: number;
  detune: number;
  transpose: number;
}

export function Oscillators() {
  const oscillators = useSynthStore((s) => s.oscillators);
  const updateOscillator = useSynthStore((s) => s.updateOscillator);
  const removeOscillator = useSynthStore((s) => s.removeOscillator);
  const addOscillator = useSynthStore((s) => s.addOscillator);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <p className="font-mono text-2xl">Oscillators</p>
        <Button
          disabled={oscillators.length >= 6}
          variant="outline"
          onClick={() => {
            addOscillator();
          }}
        >
          <Plus />
          Add
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {oscillators.map((oscillator) => (
          <div
            className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-600 p-4"
            key={oscillator.id}
          >
            <div className="flex gap-2">
              <Select
                value={oscillator.waveform}
                onValueChange={(value) => {
                  if (isOscillatorType(value)) {
                    updateOscillator(oscillator.id, { waveform: value });
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

              <Toggle
                variant="mute"
                className="px-4"
                onClick={() => {
                  updateOscillator(oscillator.id, { isMute: !oscillator.isMute });
                }}
              >
                Mute
              </Toggle>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  removeOscillator(oscillator.id);
                }}
              >
                <X />
              </Button>
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
                onValueChange={(value) => updateOscillator(oscillator.id, { volume: value[0] })}
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
                onValueChange={(value) => updateOscillator(oscillator.id, { detune: value[0] })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Label>Transpose</Label>
                <p className="text-sm">{oscillator.transpose}</p>
              </div>
              <Slider
                defaultValue={[oscillator.transpose]}
                min={-24}
                max={24}
                step={1}
                onValueChange={(value) => updateOscillator(oscillator.id, { transpose: value[0] })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
