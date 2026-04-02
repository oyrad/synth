import { Button } from './ui/button.tsx';
import { ArrowLeft, ArrowRight, Plus, RotateCcw, Save } from 'lucide-react';
import { usePresetStore } from '../stores/use-preset-store.ts';
import { useSynthStore } from '../stores/use-synth-store.ts';
import { SavePresetDialog } from './save-preset-dialog.tsx';
import { type HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Input } from './ui/input.tsx';
import { useHotkeyStore } from '../stores/use-hotkey-store.ts';
import { DEFAULT_PRESETS } from '../consts/default-presets.ts';
import { cn } from '../utils/cn.ts';
import { Card } from './atoms/card.tsx';

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

export function PresetControl({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
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
    <Card className={cn('gap-3', className)} {...rest}>
      <div className="flex gap-2 items-center">
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
            className="font-mono text-2xl sm:text-3xl font-semibold uppercase"
            onClick={() => {
              setIsNameEditing(true);
              setHotkeysEnabled(false);
            }}
          >
            {activePreset.name}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex gap-2">
          <Button
            disabled={activePreset.id === presets[0].id}
            variant="outline"
            className="flex-1"
            onClick={() => {
              handlePrevious();
            }}
          >
            <ArrowLeft />
          </Button>

          <Button
            disabled={activePreset.id === presets[presets.length - 1].id}
            variant="outline"
            className="flex-1"
            onClick={() => {
              handleNext();
            }}
          >
            <ArrowRight />
          </Button>
        </div>
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
          variant="secondary"
          disabled={!isDirty}
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
    </Card>
  );
}
