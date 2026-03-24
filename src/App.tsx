import { useSynth } from './hooks/use-synth.ts';
import { useMidi } from './hooks/use-midi.ts';
import { Oscillators } from './components/oscillators/oscillators.tsx';
import { useEffect } from 'react';
import { StatusBar } from './components/status-bar.tsx';
import { StartAudioDialog } from './components/start-audio-dialog.tsx';
import { Adsr } from './components/adsr/adsr.tsx';
import { useSettingsStore } from './hooks/use-settings-store.ts';
import { useSynthStore } from './hooks/use-synth-store.ts';
import { PresetControl } from './components/preset-control.tsx';
import { WaveformVisualizer } from './components/waveform-visualizer.tsx';

export default function App() {
  const { oscillators, adsr } = useSynthStore();

  const { noteOn, noteOff, updateVoices } = useSynth({ adsr, oscillators });

  const { midiInput, isGranted } = useMidi({
    onNoteOn: noteOn,
    onNoteOff: noteOff,
  });

  const showVisualizer = useSettingsStore((s) => s.showVisualizer);

  useEffect(() => {
    updateVoices(oscillators);
  }, [oscillators, updateVoices]);

  return (
    <main className="flex flex-col gap-4 pt-8 pb-16">
      <div className="px-8 md:px-20 xl:px-48 w-full flex flex-col gap-8">
        {showVisualizer && <WaveformVisualizer />}
        <PresetControl />
        <Oscillators />
        <Adsr />
      </div>

      <StatusBar midiInput={midiInput} isGranted={isGranted} />

      <StartAudioDialog />
    </main>
  );
}
