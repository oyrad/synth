import { usePresetStore } from '../stores/use-preset-store.ts';
import { useSynthStore } from '../stores/use-synth-store.ts';
import { useEffect, useRef } from 'react';

export function LoadPresetOnInit() {
  const firstRender = useRef(true);

  const activePreset = usePresetStore((s) => s.activePreset);
  const { loadPreset } = useSynthStore();

  useEffect(() => {
    if (!firstRender.current) {
      return;
    }

    loadPreset(activePreset);
    firstRender.current = false;
  }, [activePreset, loadPreset]);
  return null;
}
