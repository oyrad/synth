import { Button } from './ui/button.tsx';
import { ArrowLeft, ArrowRight, Plus, RotateCcw, Save } from 'lucide-react';
import { usePresetStore } from '../stores/use-preset-store.ts';
import { useSynthStore } from '../stores/use-synth-store.ts';
import { SavePresetDialog } from './save-preset-dialog.tsx';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Input } from './ui/input.tsx';
import { useHotkeyStore } from '../stores/use-hotkey-store.ts';
import { DEFAULT_PRESETS } from '../consts/default-presets.ts';

interface EditablePresetNameProps {
  onSubmit: (name: string) => void;
  defaultValue: string;
}

function EditablePresetName({ onSubmit, defaultValue }: EditablePresetNameProps) {
  const [presetName, setPresetName] = useState(defaultValue);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onSubmit(presetName);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSubmit, presetName]);

  return (
    <Input
      className="my-0.5"
      autoFocus
      size={20}
      value={presetName}
      onChange={(e) => setPresetName(e.target.value)}
      onBlur={() => {
        onSubmit(presetName);
      }}
    />
  );
}

export function PresetControl() {
  const [isNameEditing, setIsNameEditing] = useState(false);

  const { presets, nextPreset, previousPreset, activePreset, savePreset, saveNewPreset } =
    usePresetStore();

  const { parameters, loadSynthParameters } = useSynthStore();

  const setHotkeysEnabled = useHotkeyStore((s) => s.setEnabled);

  const isDirty = useMemo(
    () => JSON.stringify(parameters) !== JSON.stringify(activePreset.parameters),
    [activePreset.parameters, parameters],
  );

  const handleNext = () => {
    const preset = nextPreset();
    if (preset) {
      loadSynthParameters(preset.parameters);
    }
  };

  const handlePrevious = () => {
    const preset = previousPreset();
    if (preset) {
      loadSynthParameters(preset.parameters);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <Button
          disabled={activePreset.id === presets[0].id}
          variant="outline"
          onClick={() => {
            handlePrevious();
          }}
        >
          <ArrowLeft />
        </Button>

        <Button
          disabled={activePreset.id === presets[presets.length - 1].id}
          className="mr-2"
          variant="outline"
          onClick={() => {
            handleNext();
          }}
        >
          <ArrowRight />
        </Button>
        {isNameEditing ? (
          <EditablePresetName
            onSubmit={(newName) => {
              savePreset({
                id: activePreset.id,
                name: newName,
                parameters: activePreset.parameters,
              });
              setIsNameEditing(false);
              setHotkeysEnabled(true);
            }}
            defaultValue={activePreset.name}
          />
        ) : (
          <p
            className="font-mono text-3xl font-semibold uppercase"
            onClick={() => {
              setIsNameEditing(true);
              setHotkeysEnabled(false);
            }}
          >
            {activePreset.name}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            const newPreset = saveNewPreset({
              name: `Preset ${presets.length + 1}`,
              parameters: DEFAULT_PRESETS[0].parameters,
            });

            loadSynthParameters(newPreset.parameters);
            toast('New preset created.');
          }}
        >
          <Plus />
          New
        </Button>

        <Button
          variant="secondary"
          disabled={!isDirty}
          onClick={() => {
            savePreset({
              id: activePreset.id,
              name: activePreset.name,
              parameters,
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
            loadSynthParameters(activePreset.parameters);
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
              parameters,
            });
            toast('Preset created.');
          }}
        />
      </div>
    </div>
  );
}
