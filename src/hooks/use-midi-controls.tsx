import { useCallback } from 'react';
import { useMidi } from './use-midi';
import { useAssignKnobStore } from '../stores/use-assign-knob-store';
import { useParameterRegistry } from './use-parameter-registry';
import { logToHz } from '../utils/audio';

interface UseMidiControlsParams {
  onNoteOn: (note: number, velocity: number, channel: number) => void;
  onNoteOff: (note: number, channel: number) => void;
}

export function useMidiControls({ onNoteOn, onNoteOff }: UseMidiControlsParams) {
  const registry = useParameterRegistry();

  const assignKnob = useAssignKnobStore((s) => s.assignKnob);
  const activeParameterId = useAssignKnobStore((s) => s.activeParameterId);
  const setIsModeActive = useAssignKnobStore((s) => s.setIsModeActive);
  const isModeActive = useAssignKnobStore((s) => s.isModeActive);
  const assignedKnobs = useAssignKnobStore((s) => s.assignedKnobs);
  const unassignKnob = useAssignKnobStore((s) => s.unassignKnob);

  const handleCC = useCallback(
    (controller: number, value: number, channel: number) => {
      if (isModeActive && activeParameterId) {
        if (assignedKnobs[activeParameterId]) {
          unassignKnob(activeParameterId);
        }
        assignKnob(activeParameterId, { channel, ccNumber: controller });
        setIsModeActive(false);
        return;
      }

      const mapping = Object.entries(assignedKnobs).find(
        ([_, m]) => m.ccNumber === controller && m.channel === channel,
      );

      if (mapping) {
        const [parameterId] = mapping;
        const descriptor = registry[parameterId];

        if (descriptor) {
          const mapped = descriptor.logarithmic
            ? logToHz(value / 127, descriptor.min, descriptor.max)
            : descriptor.min + (value / 127) * (descriptor.max - descriptor.min);

          requestAnimationFrame(() => {
            descriptor.set(mapped);
          });
        }
      }
    },
    [
      isModeActive,
      activeParameterId,
      assignedKnobs,
      registry,
      assignKnob,
      unassignKnob,
      setIsModeActive,
    ],
  );

  useMidi({
    onNoteOn,
    onNoteOff,
    onCC: handleCC,
  });

  return null;
}
