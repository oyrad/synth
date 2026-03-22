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
import { useState } from 'react';
import { type Preset, usePresetStore } from '../hooks/use-preset-store.ts';
import { SlidersHorizontal } from 'lucide-react';

interface LoadPresetDialogProps {
  onLoad: (data: Preset) => void;
}

export function LoadPresetDialog({ onLoad }: LoadPresetDialogProps) {
  const [selectedPresetId, setSelectedPresetId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { presets } = usePresetStore();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <SlidersHorizontal className="cursor-pointer" />
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
                  onLoad(preset);
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
