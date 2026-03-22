import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog.tsx';
import { Button } from './ui/button.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select.tsx';
import { type Dispatch, type SetStateAction, useState } from 'react';
import type { OscillatorData } from '../utils/default-oscillator-data.ts';
import { usePresetStore } from '../hooks/use-preset-store.ts';

interface LoadPresetDialogProps {
  setOscillators: Dispatch<SetStateAction<Array<OscillatorData>>>;
}

export function LoadPresetDialog({ setOscillators }: LoadPresetDialogProps) {
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { presets } = usePresetStore();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button className="bg-slate-600 hover:bg-slate-700" disabled={!presets.length}>
          Load preset
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="gap-3">
          <DialogTitle>Load preset</DialogTitle>

          <Select
            value={selectedPresetId}
            onValueChange={(value) => setSelectedPresetId(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {presets.map((preset) => (
                  <SelectItem value={preset.id} key={preset.id}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              if (selectedPresetId) {
                const preset = presets.find((preset) => preset.id === selectedPresetId);

                if (preset) {
                  setOscillators(preset.data.oscillators);
                }
              }

              setIsOpen(false);
            }}
          >
            Load
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
