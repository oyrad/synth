import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog.tsx';
import { Button } from './ui/button.tsx';
import { useState } from 'react';
import { usePresetStore } from '../stores/use-preset-store.ts';
import { Download, FolderOpenDot, SlidersHorizontal, Trash2, Upload } from 'lucide-react';
import { cn } from '../utils/cn.ts';
import { useSynthStore } from '../stores/use-synth-store.ts';
import { toast } from 'sonner';

export function PresetsDialog() {
  const { presets, activePreset, deletePreset, setActivePreset, saveNewPreset } = usePresetStore();

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
                  loadPreset(preset);
                  toast('Preset loaded.');
                }
              }

              setIsOpen(false);
            }}
          >
            <FolderOpenDot />
            Load
          </Button>
          <Button
            disabled={!selectedPresetId}
            className="flex-1"
            variant="outline"
            onClick={() => {
              if (selectedPresetId) {
                const preset = presets.find((preset) => preset.id === selectedPresetId);

                if (preset) {
                  const blob = new Blob([JSON.stringify(preset)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${preset.id}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }
            }}
          >
            <Download />
            Export
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json,application/json';

              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) {
                  return;
                }

                const reader = new FileReader();

                reader.onload = (event) => {
                  try {
                    const result = event.target?.result;
                    if (typeof result !== 'string') return;

                    const preset = JSON.parse(result);

                    if (preset.name && preset.data) {
                      const newPreset = saveNewPreset({
                        name: preset.name,
                        data: preset.data,
                      });

                      setActivePreset(newPreset.id);
                      loadPreset(preset);
                      toast.success('Preset imported and loaded.');
                    } else {
                      toast.error('Invalid preset format: missing name or data.');
                    }
                  } catch {
                    toast.error('Error parsing JSON file.');
                  }
                };

                reader.onerror = () => toast.error('Failed to read the file.');
                reader.readAsText(file);
              };

              // 3. Trigger the click
              input.click();
            }}
          >
            <Upload />
            Import
          </Button>
          <Button
            disabled={!selectedPresetId}
            variant="destructive"
            className="flex-1"
            onClick={() => {
              if (selectedPresetId) {
                deletePreset(selectedPresetId);

                if (selectedPresetId === activePreset.id) {
                  setActivePreset(presets[0].id);
                  loadPreset(presets[0]);
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
