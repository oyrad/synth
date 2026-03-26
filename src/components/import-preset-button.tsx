import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { Button } from './ui/button.tsx';
import { usePresetStore } from '../stores/use-preset-store.ts';
import { useSynthStore } from '../stores/use-synth-store.ts';
import type { ComponentProps } from 'react';

interface ImportPresetButtonProps extends ComponentProps<'button'> {
  onImport?: VoidFunction;
}

export function ImportPresetButton({ onImport, ...props }: ImportPresetButtonProps) {
  const { saveNewPreset, setActivePreset } = usePresetStore();
  const { loadSynthData } = useSynthStore();

  return (
    <Button
      {...props}
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
                loadSynthData(preset.data);
                toast('Preset imported and loaded.');

                onImport?.();
              } else {
                toast('Invalid preset format: missing name or data.');
              }
            } catch {
              toast('Error parsing JSON file.');
            }
          };

          reader.onerror = () => toast('Failed to read the file.');
          reader.readAsText(file);
        };

        input.click();
      }}
    >
      <Upload />
      Import
    </Button>
  );
}
