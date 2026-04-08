import { MasterSettings } from '../master-settings.tsx';
import { Oscillators } from './oscillators/oscillators.tsx';
import { Amplitude } from './amplitude/amplitude.tsx';
import { Filter } from './filter/filter.tsx';
import { Delay } from './delay/delay.tsx';
import { Noise } from './noise/noise.tsx';
import { Distortion } from './distortion/distortion.tsx';
import { Reverb } from './reverb/reverb.tsx';
import { WaveformVisualizer } from './waveform-visualizer.tsx';
import { WaveformVisualizerDialog } from './waveform-visualizer-dialog.tsx';
import { LFO } from './lfo/lfo.tsx';
import { PresetControl } from '../preset-control.tsx';
import { PresetHotkeys } from '../preset-hotkeys.tsx';
import { AssignKnobDialog } from '../assign-knob-dialog.tsx';
import { SoundGenerator } from './sound-generator.tsx';

export function Synth() {
  console.log('render');

  return (
    <>
      <SoundGenerator />

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

      <PresetHotkeys />
      <AssignKnobDialog />
    </>
  );
}
