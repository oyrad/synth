import { Label } from '../ui/label.tsx';
import { Slider } from '../ui/slider.tsx';
import { isFilterType } from '../../utils/midi.ts';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.tsx';
import { useSynthStore } from '../../stores/use-synth-store.ts';
import { hzToLog, logToHz } from '../../utils/audio.ts';

export interface FilterParameters {
  type: BiquadFilterType;
  frequency: number;
  resonance: number;
}

export function Filter() {
  const filter = useSynthStore((s) => s.parameters.filter);
  const updateFilter = useSynthStore((s) => s.updateFilter);

  const { type, frequency, resonance } = filter;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 border rounded-lg bg-emerald-500 dark:bg-emerald-800 border-emerald-600 dark:border-emerald-900 p-4">
        <p className="font-mono text-xl font-bold uppercase">filter</p>
        <Select
          value={type}
          onValueChange={(value) => {
            if (isFilterType(value)) {
              updateFilter({ type: value });
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select waveform" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="lowpass">Lowpass</SelectItem>
              <SelectItem value="highpass">Highpass</SelectItem>
              <SelectItem value="bandpass">Bandpass</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex justify-between items-center">
          <Label>Frequency</Label>
          <p className="text-sm">{frequency} Hz</p>
        </div>
        <Slider
          value={[hzToLog(frequency)]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(value) => updateFilter({ frequency: logToHz(value[0]) })}
        />

        <div className="flex justify-between items-center">
          <Label>Resonance</Label>
          <p className="text-sm">{resonance}</p>
        </div>
        <Slider
          value={[resonance]}
          min={0}
          max={20}
          step={0.1}
          onValueChange={(value) => updateFilter({ resonance: value[0] })}
        />
      </div>
    </div>
  );
}
