import { Button } from './ui/button.tsx';
import { ArrowLeft, ArrowRight, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { usePresetStore } from '../stores/use-preset-store.ts';
import { useSynthStore } from '../stores/use-synth-store.ts';
import { SavePresetDialog } from './save-preset-dialog.tsx';
import { useMemo } from 'react';
import { toast } from 'sonner';

export function PresetControl() {
  const { nextPreset, previousPreset, activePreset, deletePreset, savePreset, saveNewPreset } =
    usePresetStore();

  const { oscillators, adsr, loadPreset } = useSynthStore();

  const isDirty = useMemo(
    () => JSON.stringify({ oscillators, adsr }) !== JSON.stringify(activePreset.data),
    [oscillators, adsr, activePreset],
  );

  const handleNext = () => {
    const preset = nextPreset();
    if (preset) {
      loadPreset(preset);
    }
  };

  const handlePrevious = () => {
    const preset = previousPreset();
    if (preset) {
      loadPreset(preset);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          onClick={() => {
            handlePrevious();
          }}
        >
          <ArrowLeft />
        </Button>

        <Button
          className="mr-2"
          variant="outline"
          onClick={() => {
            handleNext();
          }}
        >
          <ArrowRight />
        </Button>
        <p className="font-mono text-3xl font-semibold uppercase">{activePreset.name}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          disabled={!isDirty}
          onClick={() => {
            savePreset({
              id: activePreset?.id || '',
              data: {
                oscillators,
                adsr,
              },
            });
            toast('Preset saved.');
          }}
        >
          <Save />
          Save
        </Button>

        <Button
          disabled={!isDirty}
          variant="secondary"
          onClick={() => {
            loadPreset(activePreset);
            toast('Preset reloaded.');
          }}
        >
          <RotateCcw />
          Reload
        </Button>

        <SavePresetDialog
          trigger={
            <Button variant="secondary">
              <Plus />
              Save as new
            </Button>
          }
          onSave={(presetName) => {
            saveNewPreset({
              name: presetName,
              data: {
                oscillators,
                adsr,
              },
            });
            toast('Preset created');
          }}
        />

        <Button
          variant="destructive"
          onClick={() => {
            deletePreset(activePreset.id);
            toast('Preset deleted.');
            handleNext();
          }}
        >
          <Trash2 />
          Delete
        </Button>
      </div>
    </div>
  );
}
