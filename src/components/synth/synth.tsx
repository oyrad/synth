import { MasterSettings } from '../master-settings.tsx';
import { Oscillators } from './oscillators.tsx';
import { Amplitude } from './amplitude.tsx';
import { Filter } from './filter.tsx';
import { Delay } from './delay.tsx';
import { Noise } from './noise.tsx';
import { useSynth } from '../../hooks/use-synth.ts';
import { useMidi } from '../../hooks/use-midi.ts';
import { useKeyboard } from '../../hooks/use-keyboard.ts';
import { Distortion } from './distortion.tsx';
import { Reverb } from './reverb.tsx';
import { WaveformVisualizer } from './waveform-visualizer.tsx';
import { WaveformVisualizerDialog } from './waveform-visualizer-dialog.tsx';
import { LFO } from './lfo.tsx';
import { PresetControl } from '../preset-control.tsx';
import { usePresetHotkeys } from '../../hooks/use-preset-hotkeys.ts';
import { useAssignKnobStore } from '../../stores/use-assign-knob-store.tsx';
import { AssignKnobDialog } from '../assign-knob-dialog.tsx';
import { useParameterRegistry } from '../../hooks/use-parameter-registry.ts';
import { logToHz } from '../../utils/audio.ts';

export function Synth() {
  const { noteOn, noteOff } = useSynth();

  const registry = useParameterRegistry();

  const assignKnob = useAssignKnobStore((s) => s.assignKnob);
  const activeParameterId = useAssignKnobStore((s) => s.activeParameterId);
  const setIsAssignKnobModeActive = useAssignKnobStore((s) => s.setIsModeActive);
  const isAssignKnobModeActive = useAssignKnobStore((s) => s.isModeActive);
  const assignedKnobs = useAssignKnobStore((s) => s.assignedKnobs);
  const unassignKnob = useAssignKnobStore((s) => s.unassignKnob);

  useMidi({
    onNoteOn: noteOn,
    onNoteOff: noteOff,
    onCC: (controller, value, channel) => {
      if (isAssignKnobModeActive && activeParameterId) {
        if (assignedKnobs[activeParameterId]) {
          unassignKnob(activeParameterId);
        }
        assignKnob(activeParameterId, {
          channel,
          ccNumber: controller,
        });
        setIsAssignKnobModeActive(false);
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
          descriptor.set(mapped);
        }
      }
    },
  });

  useKeyboard({
    onNoteOn: noteOn,
    onNoteOff: noteOff,
  });

  usePresetHotkeys();

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          <PresetControl />
          <MasterSettings className="w-full lg:w-sm" />
          <WaveformVisualizerDialog trigger={<WaveformVisualizer />} />
        </div>

        <Oscillators />

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          <div className="flex flex-col gap-4 h-fit">
            <Amplitude />
            <LFO />
          </div>
          <Filter className="h-fit" />
          <div className="flex flex-col gap-4 h-fit">
            <Reverb className="flex-1" />
            <Delay className="flex-1" />
            <div className="flex flex-col md:flex-row gap-4 h-fit">
              <Noise className="flex-1" />
              <Distortion className="flex-1" />
            </div>
          </div>
        </div>
      </div>

      <AssignKnobDialog />
    </>
  );
}
