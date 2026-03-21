import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx';

interface WaveformSelectProps {
  waveform: OscillatorType;
  onSelect: (waveform: OscillatorType) => void;
}

export function WaveformSelect({ waveform, onSelect }: WaveformSelectProps) {
  return (
    <Select
      value={waveform}
      onValueChange={onSelect}
    >
      <SelectTrigger className="w-[180px]">
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
    </Select>);
}