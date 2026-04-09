import { useCallback } from 'react';
import { useMidi } from './use-midi';
import { useMidiCCStore } from '../stores/use-midi-cc-store.tsx';
import { useParameterRegistry } from './use-parameter-registry';
import { logToHz } from '../utils/audio';

interface UseMidiControlsParams {
  onNoteOn: (note: number, velocity: number, channel: number) => void;
  onNoteOff: (note: number, channel: number) => void;
}

export function useMidiControls({ onNoteOn, onNoteOff }: UseMidiControlsParams) {
  const registry = useParameterRegistry();

  const assignKnob = useMidiCCStore((s) => s.assignKnob);
  const activeParameterId = useMidiCCStore((s) => s.activeParameterId);
  const isModeActive = useMidiCCStore((s) => s.isAssignModeActive);
  const getParameterId = useMidiCCStore((s) => s.getParameterId);

  const handleCC = useCallback(
    (controller: number, value: number, channel: number) => {
      if (isModeActive && activeParameterId) {
        assignKnob(activeParameterId, { channel, ccNumber: controller });
        return;
      }

      const parameterId = getParameterId(controller, channel);
      if (parameterId) {
        const descriptor = registry[parameterId];

        if (descriptor) {
          const mapped = descriptor.logarithmic
            ? logToHz(value / 127, descriptor.min, descriptor.max)
            : descriptor.min + (value / 127) * (descriptor.max - descriptor.min);

          requestAnimationFrame(() => {
            descriptor.set(+mapped.toFixed(2));
          });
        }
      }
    },
    [isModeActive, activeParameterId, getParameterId, assignKnob, registry],
  );

  useMidi({
    onNoteOn,
    onNoteOff,
    onCC: handleCC,
  });

  return null;
}
