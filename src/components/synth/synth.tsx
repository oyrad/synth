import { WaveformVisualizer } from './waveform-visualizer.tsx';
import { PresetControl } from '../preset-control.tsx';
import { MasterSettings } from '../master-settings.tsx';
import { Oscillators } from './oscillators.tsx';
import { Envelope } from './envelope.tsx';
import { Filter } from './filter.tsx';
import { Delay } from './delay.tsx';
import { Noise } from '../noise.tsx';
import { useSettingsStore } from '../../stores/use-settings-store.ts';
import { useSynth } from '../../hooks/use-synth.ts';
import { useMidi } from '../../hooks/use-midi.ts';
import { useKeyboard } from '../../hooks/use-keyboard.ts';

export function Synth() {
  const showVisualizer = useSettingsStore((s) => s.showVisualizer);

  const { noteOn, noteOff } = useSynth();

  useMidi({
    onNoteOn: noteOn,
    onNoteOff: noteOff,
  });

  useKeyboard({
    onNoteOn: noteOn,
    onNoteOff: noteOff,
  });

  return (
    <div className="px-8 md:px-20 xl:px-48 w-full flex flex-col gap-8">
      {showVisualizer && <WaveformVisualizer />}
      <div className="flex gap-4">
        <PresetControl />
        <MasterSettings />
      </div>
      <Oscillators />
      <Envelope />

      <div className="flex gap-4">
        <Filter />
        <Delay />
        <Noise />
      </div>
    </div>
  );
}
