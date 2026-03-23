import { Button } from './ui/button.tsx';
import { ArrowLeft, ArrowRight, Plus, Save, Trash2 } from 'lucide-react';
import { usePresetStore } from '../hooks/use-preset-store.ts';
import { useSynthStore } from '../hooks/use-synth-store.ts';
import { SavePresetDialog } from './save-preset-dialog.tsx';

export function PresetControl() {
  const {
    nextPreset,
    previousPreset,
    getActivePreset,
    deletePreset,
    savePreset,
    saveNewPreset,
  } = usePresetStore();

  const { oscillators, adsr, loadPreset } = useSynthStore();

  const activePreset = getActivePreset();

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
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2 w-fit">
      <p className="font-mono text-3xl font-semibold uppercase">{activePreset?.name}</p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            handlePrevious();
          }}
        >
          <ArrowLeft />
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            handleNext();
          }}
        >
          <ArrowRight />
        </Button>

        <Button
          onClick={() => {
            savePreset({
              id: activePreset?.id || '',
              data: {
                oscillators,
                adsr,
              },
            });
          }}
        >
          <Save />
          Save
        </Button>

        <SavePresetDialog
          trigger={
            <Button variant="outline">
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
          }}
        />

        <Button
          variant="destructive"
          onClick={() => {
            if (activePreset) {
              deletePreset(activePreset.id);
              handleNext();
            }
          }}
        >
          <Trash2 />
          Delete
        </Button>
      </div>
    </div>
  );
}
