import { usePresetStore } from '../stores/use-preset-store.ts';
import { useSynthStore } from '../stores/use-synth-store.ts';
import { useEffect, useRef } from 'react';

export function LoadPresetOnInit() {
  const firstRender = useRef(true);

  const activePreset = usePresetStore((s) => s.activePreset);
  const { loadSynthData } = useSynthStore();

  useEffect(() => {
    if (!firstRender.current) {
      return;
    }

    loadSynthData(activePreset.data);
    firstRender.current = false;
  }, [activePreset, loadSynthData]);
  return null;
}
