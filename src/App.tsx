import { useSynth } from './hooks/use-synth.ts';
import { useMidi } from './hooks/use-midi.ts';
import { Oscillators } from './components/oscillators/oscillators.tsx';
import { StatusBar } from './components/status-bar.tsx';
import { StartAudioDialog } from './components/start-audio-dialog.tsx';
import { Adsr } from './components/adsr/adsr.tsx';
import { useSettingsStore } from './stores/use-settings-store.ts';
import { useSynthStore } from './stores/use-synth-store.ts';
import { PresetControl } from './components/preset-control.tsx';
import { WaveformVisualizer } from './components/waveform-visualizer.tsx';
import { MasterSettings } from './components/master-settings.tsx';
import { LoadPresetOnInit } from './components/load-preset-on-init.tsx';
import { useRequestMidiAccess } from './hooks/use-request-midi-access.ts';
import { useMidiStore } from './stores/use-midi-store.tsx';
import { useKeyboard } from './hooks/use-keyboard.ts';
import { Delay } from './components/effects/delay.tsx';
import { Filter } from './components/filter/filter.tsx';
import { Noise } from './components/noise.tsx';

export default function App() {
  const { isGranted } = useRequestMidiAccess();

  const { oscillators, adsr, delay, filter, noise } = useSynthStore();
  const { selectedInput: midiInput } = useMidiStore();

  const { noteOn, noteOff } = useSynth({ adsr, oscillators, delay, filter, noise });

  useMidi({
    onNoteOn: noteOn,
    onNoteOff: noteOff,
  });

  useKeyboard({
    onNoteOn: noteOn,
    onNoteOff: noteOff,
  });

  const showVisualizer = useSettingsStore((s) => s.showVisualizer);

  return (
    <main className="flex flex-col gap-4 pt-8 pb-16">
      <div className="px-8 md:px-20 xl:px-48 w-full flex flex-col gap-8">
        {showVisualizer && <WaveformVisualizer />}
        <div className="flex gap-4">
          <PresetControl />
          <MasterSettings />
        </div>
        <Oscillators />
        <Adsr />

        <div className="flex gap-4">
          <Filter />
          <Delay />
          <Noise />
        </div>
      </div>

      <StatusBar midiInput={midiInput} isGranted={isGranted} />

      <StartAudioDialog />
      <LoadPresetOnInit />
    </main>
  );
}
