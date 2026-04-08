import { useEffect } from 'react';
import { useSynthStore } from '../stores/use-synth-store.ts';
import { usePresetStore } from '../stores/use-preset-store.ts';

export function PresetHotkeys() {
  const nextPreset = usePresetStore((s) => s.nextPreset);
  const previousPreset = usePresetStore((s) => s.previousPreset);

  const loadSynthParameters = useSynthStore((s) => s.loadSynthParameters);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        const newPreset = previousPreset();
        if (newPreset) {
          loadSynthParameters(newPreset.parameters);
        }
      } else if (event.key === 'ArrowRight') {
        const newPreset = nextPreset();
        if (newPreset) {
          loadSynthParameters(newPreset.parameters);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [loadSynthParameters, nextPreset, previousPreset]);

  return null;
}
