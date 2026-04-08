import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select.tsx';
import { useSynthStore } from '../../../stores/use-synth-store.ts';

export type LFOTargetType = 'pitch' | 'volume' | 'filter';

function isLFOTargetType(value: string): value is LFOTargetType {
  return ['pitch', 'volume', 'filter'].includes(value);
}

interface LFOTargetProps {
  onChange: (target: LFOTargetType) => void;
}

export function LFOTarget({ onChange }: LFOTargetProps) {
  const target = useSynthStore((s) => s.parameters.lfo.target);

  return (
    <Select
      value={target}
      onValueChange={(value) => {
        if (isLFOTargetType(value)) {
          onChange(value);
        }
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select waveform" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="pitch">Pitch</SelectItem>
          <SelectItem value="volume">Volume</SelectItem>
          <SelectItem value="filter">Filter</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
