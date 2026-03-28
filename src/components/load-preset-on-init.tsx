import { usePresetStore } from '../stores/use-preset-store.ts';
import { useSynthStore } from '../stores/use-synth-store.ts';
import { useEffect, useRef } from 'react';

export function LoadPresetOnInit() {
  const firstRender = useRef(true);

  const activePreset = usePresetStore((s) => s.activePreset);
  const { loadSynthParameters } = useSynthStore();

  useEffect(() => {
    if (!firstRender.current) {
      return;
    }

    loadSynthParameters(activePreset.parameters);
    firstRender.current = false;
  }, [activePreset.parameters, loadSynthParameters]);
  return null;
}
