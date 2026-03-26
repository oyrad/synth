import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog.tsx';
import { Button } from './ui/button.tsx';
import { useState } from 'react';
import { usePresetStore } from '../stores/use-preset-store.ts';
import { FolderOpenDot, SlidersHorizontal, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn.ts';
import { useSynthStore } from '../stores/use-synth-store.ts';
import { toast } from 'sonner';
import { ExportPresetButton } from './export-preset-button.tsx';
import { ImportPresetButton } from './import-preset-button.tsx';

export function PresetsDialog() {
  const { presets, activePreset, deletePreset, setActivePreset } = usePresetStore();

  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { loadSynthData } = useSynthStore();

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="gap-3">
          <DialogTitle className="font-semibold">Presets</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1 max-h-96 overflow-y-auto">
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

        <div className="flex gap-2">
          <Button
            disabled={!selectedPresetId}
            className="flex-1"
            onClick={() => {
              if (selectedPresetId) {
                const preset = presets.find((preset) => preset.id === selectedPresetId);

                if (preset) {
                  setActivePreset(preset.id);
                  loadSynthData(preset.data);
                  toast('Preset loaded.');
                }
              }

              setIsOpen(false);
            }}
          >
            <FolderOpenDot />
            Load
          </Button>
          <ExportPresetButton selectedPresetId={selectedPresetId} className="flex-1" />
          <ImportPresetButton className="flex-1" onImport={() => setIsOpen(false)} />
          <Button
            disabled={!selectedPresetId}
            variant="destructive"
            className="flex-1"
            onClick={() => {
              if (selectedPresetId) {
                deletePreset(selectedPresetId);

                if (selectedPresetId === activePreset.id) {
                  setActivePreset(presets[0].id);
                  loadSynthData(presets[0].data);
                }

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
