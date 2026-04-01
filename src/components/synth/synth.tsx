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
import { LFO } from './lfo.tsx';

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
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <PresetControl />
        <MasterSettings className="w-full lg:w-sm" />
        <WaveformVisualizerDialog trigger={<WaveformVisualizer />} />
      </div>

      <Oscillators />

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
        <Filter className="h-fit" />
        <div className="flex flex-col gap-4 h-fit">
          <Amplitude />
          <LFO />
        </div>
        <div className="flex flex-col gap-4 h-fit">
          <div className="flex flex-col md:flex-row gap-4">
            <Delay className="flex-1" />
            <Reverb className="flex-1" />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <Noise className="flex-1" />
            <Distortion className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
