import { Button } from './ui/button.tsx';
import { Download } from 'lucide-react';
import type { ComponentProps } from 'react';
import { usePresetStore } from '../stores/use-preset-store.ts';

interface ExportPresetButtonProps extends ComponentProps<'button'> {
  selectedPresetId: string | null;
}

export function ExportPresetButton({ selectedPresetId, ...rest }: ExportPresetButtonProps) {
  const { presets } = usePresetStore();

  return (
    <Button
      disabled={!selectedPresetId}
      {...rest}
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
  );
}
