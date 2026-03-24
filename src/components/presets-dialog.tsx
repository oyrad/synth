import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog.tsx';
import { Button } from './ui/button.tsx';
import { useState } from 'react';
import { usePresetStore } from '../hooks/use-preset-store.ts';
import { SlidersHorizontal, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn.ts';
import { useSynthStore } from '../hooks/use-synth-store.ts';
import { toast } from 'sonner';

export function PresetsDialog() {
  const { presets, deletePreset, setActivePreset } = usePresetStore();

  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { loadPreset } = useSynthStore();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setSelectedPresetId(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <SlidersHorizontal className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="gap-3">
          <DialogTitle className="font-semibold">Presets</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          {presets.map((preset) => (
            <div
              className={cn(
                'flex justify-between items-center rounded-md cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600',
                preset.id == selectedPresetId && 'bg-gray-200 dark:bg-gray-700',
              )}
              key={preset.id}
              onClick={() => setSelectedPresetId(preset.id)}
            >
              {preset.name}
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          <Button
            disabled={!selectedPresetId}
            className="flex-1"
            onClick={() => {
              if (selectedPresetId) {
                const preset = presets.find((preset) => preset.id === selectedPresetId);

                if (preset) {
                  setActivePreset(preset.id);
                  loadPreset(preset);
                  toast('Preset loaded.');
                }
              }

              setIsOpen(false);
            }}
          >
            Load
          </Button>
          <Button
            disabled={!selectedPresetId}
            variant="destructive"
            className="flex-1"
            onClick={() => {
              if (selectedPresetId) {
                deletePreset(selectedPresetId);
                setSelectedPresetId(null);
                toast('Preset deleted.');
              }
            }}
          >
            <Trash2 />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
