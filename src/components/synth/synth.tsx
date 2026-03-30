import { PresetControl } from '../preset-control.tsx';
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

export function Synth() {
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
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <PresetControl />
        <MasterSettings className="w-full lg:w-sm" />
        <WaveformVisualizerDialog trigger={<WaveformVisualizer />} />
      </div>
      <Oscillators />
      <Amplitude />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <Filter />
        <Delay />
        <Reverb />
        <Distortion />
        <Noise />
      </div>
    </div>
  );
}
