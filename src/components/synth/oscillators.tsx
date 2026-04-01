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
import { useSynthStore } from '../../stores/use-synth-store.ts';
import { Switch } from '../ui/switch.tsx';
import { cn } from '../../utils/cn.ts';

export interface OscillatorParameters {
  id: string;
  isActive: boolean;
  waveform: OscillatorType;
  volume: number;
  detune: number;
  transpose: number;
}

export function Oscillators() {
  const oscillators = useSynthStore((s) => s.parameters.oscillators);
  const updateOscillator = useSynthStore((s) => s.updateOscillator);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
      {oscillators.map((oscillator, index) => (
        <div
          className={cn(
            'flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-neutral-800 p-4',
            index === 0 &&
              'bg-blue-600/50 border-blue-600/80 dark:bg-blue-600/30 dark:border-blue-600/60',
            index === 1 &&
              'bg-green-600/50 border-green-600/80 dark:bg-green-600/30 dark:border-green-600/60',
            index === 2 &&
              'bg-rose-600/50 border-rose-600/80 dark:bg-rose-600/30 dark:border-rose-600/60',
            index === 3 &&
              'bg-yellow-600/50 border-yellow-600/80 dark:bg-yellow-600/30 dark:border-yellow-600/60',
            !oscillator.isActive &&
              'opacity-50 pointer-events-none border-neutral-600/50 dark:border-neutral-600/60 bg-neutral-700/20 dark:bg-neutral-700/30',
          )}
          key={oscillator.id}
        >
          <div className="flex justify-between items-center">
            <p className="font-mono text-xl font-bold uppercase">oscillator {index + 1}</p>
            <Switch
              className="pointer-events-auto"
              checked={oscillator.isActive}
              onCheckedChange={(checked) => updateOscillator(oscillator.id, { isActive: checked })}
            />
          </div>

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

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <Label>Volume</Label>
              <p className="text-sm">{oscillator.volume}</p>
            </div>
            <Slider
              value={[oscillator.volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => updateOscillator(oscillator.id, { volume: value[0] })}
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <Label>Detune</Label>
              <p className="text-sm">{oscillator.detune}</p>
            </div>
            <Slider
              value={[oscillator.detune]}
              min={-64}
              max={64}
              step={1}
              onValueChange={(value) => updateOscillator(oscillator.id, { detune: value[0] })}
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <Label>Transpose</Label>
              <p className="text-sm">{oscillator.transpose}</p>
            </div>
            <Slider
              value={[oscillator.transpose]}
              min={-24}
              max={24}
              step={1}
              onValueChange={(value) => updateOscillator(oscillator.id, { transpose: value[0] })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
