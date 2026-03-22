import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog.tsx';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { useState } from 'react';
import { type Preset, usePresetStore } from '../hooks/use-preset-store.ts';

interface SavePresetDialogProps {
  data: Preset['data'];
}

export function SavePresetDialog({ data }: SavePresetDialogProps) {
  const [presetName, setPresetName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { savePreset } = usePresetStore();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">Save preset</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="gap-3">
          <DialogTitle>Save preset</DialogTitle>

          <Input
            id="preset-name"
            type="text"
            placeholder="Preset name"
            value={presetName}
            onChange={(e) => {
              setPresetName(e.target.value);
            }}
          />

          <Button
            onClick={() => {
              savePreset({
                id: crypto.randomUUID(),
                name: presetName,
                data,
              });

              setPresetName('');
              setIsOpen(false);
            }}
          >
            Save
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
